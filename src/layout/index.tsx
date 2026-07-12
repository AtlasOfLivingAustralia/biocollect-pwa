import { AppShell } from '@mantine/core';
import { Outlet, ScrollRestoration } from 'react-router';

import { Header } from './Header';
import { NavigationProgress } from './NavigationProgress';
import { TokenHandler } from './TokenHandler';

export default function Layout() {


  return (
    <>
      <ScrollRestoration />
      <NavigationProgress />
      <TokenHandler />
      <AppShell header={{ height: 70 }}>
        <Header />
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
}
