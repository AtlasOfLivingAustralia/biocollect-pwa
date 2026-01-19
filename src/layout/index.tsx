import { useEffect } from 'react';
import { AppShell, Center, Loader } from '@mantine/core';

import { Outlet, useNavigation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

import {
  NavigationProgress,
  startNavigationProgress,
  completeNavigationProgress,
  resetNavigationProgress,
} from '@mantine/nprogress';

import Header from './Header';

export default function Layout() {
  const { isLoading } = useAuth();
  const { state } = useNavigation();

  useEffect(() => {
    if (state === 'loading') {
      resetNavigationProgress();
      startNavigationProgress();
    } else {
      completeNavigationProgress();
    }
  }, [state]);

  if (isLoading) {
    return (
      <Center style={{ width: '100vw', height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <NavigationProgress stepInterval={0} />
      <AppShell header={{ height: 70 }}>
        <Header />
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
}
