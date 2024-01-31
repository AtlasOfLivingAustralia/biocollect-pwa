import { useEffect } from 'react';
import { Box, Center, Loader } from '@mantine/core';

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
      <Center sx={{ width: '100vw', height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <NavigationProgress stepInterval={0} />
      <Header />
      <Box pt={71}>
        <Outlet />
      </Box>
    </>
  );
}
