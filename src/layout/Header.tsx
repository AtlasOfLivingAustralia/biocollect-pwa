import {
  AppShell,
  Avatar,
  Group,
  Image,
  Loader,
  Menu,
  ThemeIcon,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconBug,
  IconFileUpload,
  IconLogout,
  IconMoon,
  IconPlugConnected,
  IconPlugConnectedX,
  IconQuestionMark,
  IconSearch,
  IconSun,
  IconUser,
} from '@tabler/icons-react';
import { jwtDecode } from 'jwt-decode';
import { useContext, useMemo } from 'react';
import { useAuth } from 'react-oidc-context';
import { Link } from 'react-router';

import { FrameContext } from '#/helpers/frame';
import { getInitials, useOnLine } from '#/helpers/funcs';

import classes from './Header.module.css';

// BioCollect logos
import logoDark from '/assets/logo-dark-32x32.png';
import logoLight from '/assets/logo-light-32x32.png';

// Install button
import { handleSignOut } from '#/helpers/auth/handleSignOut';
import { InstallButton } from './InstallButton';
import { StorageSummary } from './StorageSummary';

export default function Header() {
  const { toggleColorScheme } = useMantineColorScheme();
  const frame = useContext(FrameContext);
  const auth = useAuth();
  const onLine = useOnLine();
  const isDark = useComputedColorScheme() === 'dark';
  const decoded = useMemo(() => {
    return auth.user ? jwtDecode(auth.user.access_token) : null;
  }, [auth.user]);

  return (
    <AppShell.Header className={classes.header} p='md'>
      <Group justify='space-between' px='sm'>
        <Group>
          <Link to='/'>
            <Image width='auto' height={32} src={isDark ? logoLight : logoDark} />
          </Link>
          <ThemeIcon color={onLine ? 'green' : 'red'} radius='lg' variant='light'>
            {onLine ? <IconPlugConnected size='1rem' /> : <IconPlugConnectedX size='1rem' />}
          </ThemeIcon>
        </Group>
        <Group>
          <InstallButton />
          <Menu position='bottom-end' disabled={!auth.isAuthenticated}>
            <Menu.Target>
              <Avatar
                component={UnstyledButton}
                radius='xl'
                variant='filled'
                opacity={auth.isAuthenticated ? 1 : 0.4}
              >
                {(() => {
                  const { user, isAuthenticated } = auth;

                  if (!isAuthenticated) return <Loader size='sm' />;

                  // Use the given name from the profile field, otherwise fallback to the JWT
                  const given_name =
                    user?.profile.given_name || (decoded as { given_name: string } | null)?.given_name;

                  // Use the family name from the profile field, otherwise fallback to the JWT
                  const family_name =
                    user?.profile.family_name || (decoded as { family_name: string } | null)?.family_name;

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
              <Menu.Item component={Link} to='/' leftSection={<IconSearch size='1rem' />}>
                Search projects
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  frame.open(
                    `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/offlineList`,
                    'Unpublished Records',
                  )
                }
                leftSection={<IconFileUpload size='1rem' />}
              >
                Unpublished records
              </Menu.Item>
              <StorageSummary />
              {import.meta.env.DEV && (
                <>
                  <Menu.Divider />
                  <Menu.Label>Development</Menu.Label>
                  <Menu.Item component={Link} to='/debug' leftSection={<IconBug size='1rem' />}>
                    Debug info
                  </Menu.Item>
                </>
              )}
              <Menu.Divider />
              <Menu.Item closeMenuOnClick={false} leftSection={isDark ? <IconMoon size='1rem' /> : <IconSun size='1rem' />} onClick={toggleColorScheme}>
                Toggle theme
              </Menu.Item>
              <Menu.Item
                component='a'
                href='https://support.ala.org.au/support/solutions/articles/6000276298-biocollect-pwa-app/'
                target='_blank'
                leftSection={<IconQuestionMark size='1rem' />}
              >
                Help
              </Menu.Item>
              <Menu.Item
                id='signOut'
                onClick={handleSignOut}
                leftSection={<IconLogout size='1rem' />}
                disabled={auth.isLoading || !onLine}
                color='red'
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
