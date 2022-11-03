import { ReactElement } from 'react';
import {
  Header as MantineHeader,
  Group,
  Menu,
  Avatar,
  Image,
  Button,
  UnstyledButton,
  Center,
  Loader,
  useMantineColorScheme,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { useAuth } from 'react-oidc-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faQuestion } from '@fortawesome/free-solid-svg-icons';

// BioCollect logos
import logoDark from 'assets/biocollect-logo.png';
import logoLight from 'assets/biocollect-logo-white.png';

export default function Header() {
  const { colorScheme } = useMantineColorScheme();
  const auth = useAuth();

  return (
    <MantineHeader height={71} p="md">
      <Group position="apart" px="sm">
        <Image
          width="auto"
          height={38}
          src={colorScheme === 'dark' ? logoLight : logoDark}
        />
        <Group>
          {auth.isAuthenticated ? (
            <Menu position="bottom-end">
              <Menu.Target>
                <Avatar component={UnstyledButton} radius="xl" variant="filled">
                  JB
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>User</Menu.Label>
                <Menu.Item>Testing</Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  component="a"
                  href="https://support.ala.org.au/support/solutions/6000139493"
                  target="_blank"
                  icon={<FontAwesomeIcon width={14} icon={faQuestion} />}
                >
                  Help
                </Menu.Item>
                <Menu.Item
                  onClick={() => auth.signoutRedirect()}
                  icon={<FontAwesomeIcon width={14} icon={faSignOut} />}
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
