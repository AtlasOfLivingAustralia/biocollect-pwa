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

// BioCollect logos
import logoDark from '/assets/logo-dark-32x32.png';
import logoLight from '/assets/logo-light-32x32.png';
import { themes } from 'theme';
import { useContext } from 'react';
import { FrameContext } from 'helpers/frame';
import { getInitials, useOnLine } from 'helpers/funcs';

// Install button
import { InstallButton } from './InstallButton';

export default function Header() {
  const frame = useContext(FrameContext);
  const auth = useAuth();
  const onLine = useOnLine();

  const signOut = async () => {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
      logout_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
    });

    await auth.removeUser();
    window.location.replace(
      `${import.meta.env.VITE_AUTH_END_SESSION_URI}?${params.toString()}`
    );
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
                  const { given_name, family_name } = user?.profile || {};

                  if (!isAuthenticated) return <Loader size="sm" />;

                  // If the user has a first & last name
                  return given_name && family_name ? (
                    getInitials(
                      `${auth.user?.profile.given_name} ${auth.user?.profile.family_name}`
                    )
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
                    `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/REPLACE-ME`,
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
