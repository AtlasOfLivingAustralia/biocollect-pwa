import {
  Header as MantineHeader,
  Group,
  Menu,
  Avatar,
  Image,
  UnstyledButton,
  Badge,
  Loader,
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
} from '@tabler/icons-react';
import jwtDecode from 'jwt-decode';

// BioCollect logos
import logoDark from '/assets/logo-dark-32x32.png';
import logoLight from '/assets/logo-light-32x32.png';
import { themes } from 'theme';
import { useContext, useRef } from 'react';
import { FrameContext } from 'helpers/frame';
import { getInitials, useOnLine } from 'helpers/funcs';

// Install button
import { InstallButton } from './InstallButton';

export default function Header() {
  const frame = useContext(FrameContext);
  const auth = useAuth();
  const onLine = useOnLine();
  const decoded = useRef(jwtDecode(auth.user?.access_token || ''));

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
    <MantineHeader height={71} p="md" pos="fixed" zIndex={200}>
      <Group position="apart" px="sm">
        <Group>
          <Link to="/">
            <Image
              width="auto"
              height={32}
              src={
                themes[import.meta.env.BIOCOLLECT_HUB || 'dark'].colorScheme ===
                'dark'
                  ? logoLight
                  : logoDark
              }
            />
          </Link>
          <Group spacing="xs">
            <Badge radius="sm" color={onLine ? 'green' : 'red'}>
              {onLine ? 'online' : 'offline'}
            </Badge>
          </Group>
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
              <Menu.Item component={Link} to="/" icon={<IconSearch />}>
                Search projects
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  frame.open(
                    `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/offlineList`,
                    'Unpublished Records'
                  )
                }
                icon={<IconFileUpload />}
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
                icon={<IconSettings />}
              >
                Manage storage
              </Menu.Item>
              {import.meta.env.DEV && (
                <>
                  <Menu.Divider />
                  <Menu.Label>Development</Menu.Label>
                  <Menu.Item component={Link} to="/debug" icon={<IconBug />}>
                    Debug info
                  </Menu.Item>
                </>
              )}
              <Menu.Divider />
              <Menu.Item
                component="a"
                href="https://support.ala.org.au/support/solutions/6000139493"
                target="_blank"
                icon={<IconQuestionMark />}
              >
                Help
              </Menu.Item>
              <Menu.Item
                id='signOut'
                onClick={signOut}
                icon={<IconLogout />}
                disabled={auth.isLoading || !onLine}
                color="red"
              >
                Sign Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </MantineHeader>
  );
}
