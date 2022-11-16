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
} from '@tabler/icons';

// BioCollect logos
// import logoDark from 'assets/biocollect-logo.png';
// import logoLight from 'assets/biocollect-logo-white.png';

export default function Header() {
  const { colorScheme } = useMantineColorScheme();
  const auth = useAuth();

  return (
    <MantineHeader height={71} p="md">
      <Group position="apart" px="sm">
        <Group>
          <Link to="/">
            <Image
              width="auto"
              height={32}
              src={
                colorScheme === 'dark'
                  ? './icon/light/32x32.png'
                  : './icon/light/32x32.png'
              }
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
                  onClick={() => auth.signoutRedirect()}
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
