import {
  Header as MantineHeader,
  Group,
  Menu,
  Avatar,
  Image,
  Button,
  UnstyledButton,
  // MediaQuery,
  useMantineColorScheme,
  Badge,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import {
  IconSearch,
  IconPlus,
  IconBug,
  IconQuestionMark,
  IconLogout,
  IconMoon,
  IconSun,
} from '@tabler/icons';

// BioCollect logos
import logoDark from '/assets/logo-dark-32x32.png';
import logoLight from '/assets/logo-light-32x32.png';

export default function Header() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const auth = useAuth();

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
    <MantineHeader height={71} p="md">
      <Group position="apart" px="sm">
        <Group>
          <Link to="/">
            <Image
              width="auto"
              height={32}
              src={colorScheme === 'dark' ? logoLight : logoDark}
            />
          </Link>
          <Group spacing="xs">
            <Badge radius="sm" color="grey">
              ver 0.0
            </Badge>
            {navigator.onLine ? (
              <Badge radius="sm" color="green">
                online
              </Badge>
            ) : (
              <Badge radius="sm" color="red">
                offline
              </Badge>
            )}
          </Group>
        </Group>
        <Group>
          {/* <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
            <TextInput icon={<IconSearch />} placeholder="Search Projects" />
          </MediaQuery> */}
          {auth.isAuthenticated ? (
            <Menu position="bottom-end">
              <Menu.Target>
                <Avatar component={UnstyledButton} radius="xl" variant="filled">
                  JB
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Projects</Menu.Label>
                <Menu.Item component={Link} to="/" icon={<IconSearch />}>
                  Search projects
                </Menu.Item>
                <Menu.Item
                  component="a"
                  href="https://biocollect.ala.org.au/acsa/project/create"
                  target="_blank"
                  icon={<IconPlus />}
                >
                  Add your project
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>Settings</Menu.Label>
                <Menu.Item
                  closeMenuOnClick={false}
                  icon={colorScheme === 'dark' ? <IconMoon /> : <IconSun />}
                  onClick={() => toggleColorScheme()}
                >
                  Toggle theme
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
                  disabled={auth.isLoading}
                  color="red"
                >
                  Sign Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button
              variant="light"
              onClick={() => auth.signinRedirect()}
              loading={auth.isLoading}
            >
              Sign In
            </Button>
          )}
        </Group>
      </Group>
    </MantineHeader>
  );
}
