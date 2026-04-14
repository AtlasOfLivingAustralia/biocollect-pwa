import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { AuthProvider } from 'react-oidc-context';

// Helpers
import { RecordsDrawerProvider } from '#/helpers/drawer';
import { FrameProvider } from '#/helpers/frame';
import { PWAProvider } from '#/helpers/pwa';
import { theme } from '#/theme';

import App from './App';

// Auth helpers
import { userManager } from './helpers/auth/config';
import { handleSignIn } from './helpers/auth/handleSignIn';

// Mantine styles
import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/spotlight/styles.css';

function Main() {
  return (
    <AuthProvider userManager={userManager} onSigninCallback={handleSignIn}>
      <MantineProvider theme={theme} defaultColorScheme='dark'>
        <ModalsProvider>
          <PWAProvider>
            <FrameProvider>
              <RecordsDrawerProvider>
                <App />
              </RecordsDrawerProvider>
            </FrameProvider>
          </PWAProvider>
        </ModalsProvider>
      </MantineProvider>
    </AuthProvider>
  );
}

export default Main;
