import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { AuthProvider } from 'react-oidc-context';

// Helpers
import { RecordsDrawerProvider } from '#/helpers/drawer';
import { FrameProvider } from '#/helpers/frame';
import { theme } from '#/theme';

import PWAProvider from './helpers/pwa/provider';
import App from './App';

// Auth helpers
import { userManager } from './helpers/auth/config';
import { handleSignIn } from './helpers/auth/handleSignIn';

// Mantine styles
import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';

function Main() {
  return (
    <AuthProvider
      userManager={userManager}
      onSigninCallback={handleSignIn}
    >
      <PWAProvider>
        <MantineProvider theme={theme} defaultColorScheme='dark'>
          <ModalsProvider>
            <FrameProvider>
              <RecordsDrawerProvider>
                <App />
              </RecordsDrawerProvider>
            </FrameProvider>
          </ModalsProvider>
        </MantineProvider>
      </PWAProvider>
    </AuthProvider>
  );
}

export default Main;
