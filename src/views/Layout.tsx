import { ReactElement } from 'react';
import {
  Header,
  Group,
  Menu,
  Avatar,
  Image,
  Button,
  UnstyledButton,
  Center,
  Loader,
  useMantineColorScheme,
} from '@mantine/core';
import { useAuth } from 'react-oidc-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';

// BioCollect logos
import logoDark from 'assets/biocollect-logo.png';
import logoLight from 'assets/biocollect-logo-white.png';

interface LayoutProps {
  children: ReactElement;
}

export default function Layout({ children }: LayoutProps) {
  const { colorScheme } = useMantineColorScheme();
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <Center sx={{ width: '100vw', height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <Header height={71} p="md">
        <Group position="apart" px="sm">
          <Image
            width="auto"
            height={38}
            src={colorScheme === 'dark' ? logoLight : logoDark}
          />
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
                  onClick={() => auth.signoutRedirect()}
                  icon={<FontAwesomeIcon icon={faSignOut} />}
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
      </Header>
      {children}
    </>
  );
}
