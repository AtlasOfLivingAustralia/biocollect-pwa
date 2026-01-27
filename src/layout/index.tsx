import { AppShell } from '@mantine/core';
import {
  completeNavigationProgress,
  NavigationProgress,
  resetNavigationProgress,
  startNavigationProgress,
} from '@mantine/nprogress';
import { useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router';

import Header from './Header';

export default function Layout() {
  const { state } = useNavigation();

  useEffect(() => {
    if (state === 'loading') {
      resetNavigationProgress();
      startNavigationProgress();
    } else {
      completeNavigationProgress();
    }
  }, [state]);

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
