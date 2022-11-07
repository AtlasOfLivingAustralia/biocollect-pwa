import { Box, ScrollArea } from '@mantine/core';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
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
