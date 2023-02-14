import { useEffect } from 'react';
import { Box, ScrollArea } from '@mantine/core';
import { Outlet, useNavigation } from 'react-router-dom';
import {
  NavigationProgress,
  startNavigationProgress,
  completeNavigationProgress,
  resetNavigationProgress,
} from '@mantine/nprogress';
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
      <Header />
      <ScrollArea type="hover" style={{ height: 'calc(100vh - 71px)' }}>
        <Box style={{ width: '100vw' }}>
          <Outlet />
        </Box>
      </ScrollArea>
    </>
  );
}
