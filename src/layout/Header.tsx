import { useContext, useRef } from 'react';
import {
  Group,
  Menu,
  Avatar,
  Image,
  UnstyledButton,
  Loader,
  ThemeIcon,
  useComputedColorScheme,
  AppShell,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import {
  IconSearch,
  IconBug,
  IconQuestionMark,
  IconLogout,
  IconFileUpload,
  IconUser,
  IconSettings,
  IconPlugConnected,
  IconPlugConnectedX,
} from '@tabler/icons-react';
import { jwtDecode } from 'jwt-decode';

import { FrameContext } from '#/helpers/frame';
import { getInitials, useOnLine } from '#/helpers/funcs';

// BioCollect logos
import logoDark from '/assets/logo-dark-32x32.png';
import logoLight from '/assets/logo-light-32x32.png';

// Install button
import { InstallButton } from './InstallButton';

export default function Header() {
  const frame = useContext(FrameContext);
  const auth = useAuth();
  const onLine = useOnLine();
  const decoded = useRef(jwtDecode(auth.user?.access_token || ''));
  const isDark = useComputedColorScheme();

  const signOut = async () => {
    // Handle Cognito signout differently (they don't supply an end session endpoint via OIDC discovery)
    if (import.meta.env.VITE_AUTH_AUTHORITY.startsWith('https://cognito-idp')) {
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
        logout_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
      });

      await auth.removeUser();
      window.location.replace(
        `${import.meta.env.VITE_AUTH_END_SESSION_URI}?${params.toString()}`
      );
    } else {
      await auth.signoutRedirect({
        post_logout_redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
      });
    }
  };

  return (
    <AppShell.Header p="md">
      <Group justify='space-between' px="sm">
        <Group>
          <Link to="/">
            <Image
              width="auto"
              height={32}
              src={isDark ? logoLight : logoDark}
            />
          </Link>
          <ThemeIcon
            color={onLine ? 'green' : 'red'}
            radius="lg"
            variant="light"
          >
            {onLine ? (
              <IconPlugConnected size="1rem" />
            ) : (
              <IconPlugConnectedX size="1rem" />
            )}
          </ThemeIcon>
        </Group>
        <Group>
          <InstallButton />
          <Menu position="bottom-end" disabled={!auth.isAuthenticated}>
            <Menu.Target>
              <Avatar
                component={UnstyledButton}
                radius="xl"
                variant="filled"
                opacity={auth.isAuthenticated ? 1 : 0.4}
              >
                {(() => {
                  const { user, isAuthenticated } = auth;

                  if (!isAuthenticated) return <Loader size="sm" />;

                  // Use the given name from the profile field, otherwise fallback to the JWT
                  const given_name =
                    user?.profile.given_name ||
                    (decoded.current as any)?.given_name;

                  // Use the family name from the profile field, otherwise fallback to the JWT
                  const family_name =
                    user?.profile.family_name ||
                    (decoded.current as any)?.family_name;

                  // If the user has a first & last name
                  return given_name && family_name ? (
                    getInitials(`${given_name} ${family_name}`)
                  ) : (
                    <IconUser />
                  );
                })()}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component={Link} to="/" leftSection={<IconSearch size="1rem" />}>
                Search projects
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  frame.open(
                    `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/offlineList`,
                    'Unpublished Records'
                  )
                }
                leftSection={<IconFileUpload size="1rem" />}
              >
                Unpublished records
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  frame.open(
                    `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/settings`,
                    'Manage Storage'
                  )
                }
                leftSection={<IconSettings size="1rem" />}
              >
                Manage storage
              </Menu.Item>
              {import.meta.env.DEV && (
                <>
                  <Menu.Divider />
                  <Menu.Label>Development</Menu.Label>
                  <Menu.Item component={Link} to="/debug" leftSection={<IconBug size="1rem" />}>
                    Debug info
                  </Menu.Item>
                </>
              )}
              <Menu.Divider />
              <Menu.Item
                component="a"
                href="https://support.ala.org.au/support/solutions/articles/6000276298-biocollect-pwa-app/"
                target="_blank"
                leftSection={<IconQuestionMark size="1rem" />}
              >
                Help
              </Menu.Item>
              <Menu.Item
                id="signOut"
                onClick={signOut}
                leftSection={<IconLogout size="1rem" />}
                disabled={auth.isLoading || !onLine}
                color="red"
              >
                Sign Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
