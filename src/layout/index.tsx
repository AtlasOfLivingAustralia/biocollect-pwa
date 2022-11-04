import { Box, ScrollArea } from '@mantine/core';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('code') && params.get('state')) {
      params.delete('code');
      params.delete('state');
      // Remove the auth code & state variables from the history
      window.history.replaceState(
        null,
        '',
        window.location.origin + window.location.pathname + params.toString()
      );
    }
  }, []);

  return (
    <>
      <Header />
      <ScrollArea type="hover" style={{ height: 'calc(100vh - 71px)' }}>
        <Box style={{ width: '100vw' }}>
          <Outlet />
        </Box>
      </ScrollArea>
    </>
  );
}
