import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { AuthProvider, hasAuthParams } from 'react-oidc-context';

// App-specific imports
import { WebStorageStateStore } from 'oidc-client-ts';

// Helpers
import { APIProvider } from '#/helpers/api';
import { RecordsDrawerProvider } from '#/helpers/drawer';
import { FrameProvider } from '#/helpers/frame';

import App from './App';

// Mantine styles
import '@mantine/core/styles.css';
import { theme } from '#/theme';

// Use localStorage for user persistence
const userStore = new WebStorageStateStore({ store: localStorage });

const authConfig = {
  client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
  authority: import.meta.env.VITE_AUTH_AUTHORITY,
  scope: import.meta.env.VITE_AUTH_SCOPE,
}

if (import.meta.env.DEV) {
  console.log('Auth Config', authConfig);
}

function Main() {
  return (
    <AuthProvider
      {...authConfig}
      userStore={userStore}
      onSigninCallback={(user) => {
        const params = new URLSearchParams(window.location.search);

        console.log('[Main] onSignInCallback', user);

        if (hasAuthParams(window.location)) {
          params.delete('code');
          params.delete('state');
          // Remove the auth code & state variables from the history
          window.history.replaceState(
            null,
            '',
            window.location.origin +
            window.location.pathname +
            params.toString()
          );
        } else {
          console.log('[Main] onSigninCallback', 'No auth params in location!');
        }
      }}
    >
      <APIProvider>
        <MantineProvider theme={theme} defaultColorScheme='dark'>
          <ModalsProvider>
            <FrameProvider>
              <RecordsDrawerProvider>
                <App />
              </RecordsDrawerProvider>
            </FrameProvider>
          </ModalsProvider>
        </MantineProvider>
      </APIProvider>
    </AuthProvider>
  );
}

export default Main;
