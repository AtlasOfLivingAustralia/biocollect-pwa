import { MantineProvider } from '@mantine/core';
import { AuthProvider, hasAuthParams } from 'react-oidc-context';

// App-specific imports
import { WebStorageStateStore } from 'oidc-client-ts';
import { themes } from 'theme';
import { APIProvider } from 'helpers/api';
import { RecordsDrawerProvider } from 'helpers/drawer';

import Logger from 'helpers/logger';
import App from './App';
import { FrameProvider } from 'helpers/frame';

// Use localStorage for user persistence
const userStore = new WebStorageStateStore({ store: localStorage });

function Main() {
  const [authRegion] = import.meta.env.VITE_AUTH_USER_POOL.split('_');

  return (
    <AuthProvider
      client_id={import.meta.env.VITE_AUTH_CLIENT_ID}
      redirect_uri={import.meta.env.VITE_AUTH_REDIRECT_URI}
      authority={`https://cognito-idp.${authRegion}.amazonaws.com/${
        import.meta.env.VITE_AUTH_USER_POOL
      }`}
      onSigninCallback={(user) => {
        const params = new URLSearchParams(window.location.search);

        Logger.log('[Main] onSignInCallback', user);

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
          Logger.log('[Main] onSigninCallback', 'No auth params in location!');
        }
      }}
      userStore={userStore}
    >
      <APIProvider>
        <MantineProvider
          theme={themes[import.meta.env.VITE_BIOCOLLECT_HUB || 'dark']}
          withGlobalStyles
          withNormalizeCSS
        >
          <FrameProvider>
            <RecordsDrawerProvider>
              <App />
            </RecordsDrawerProvider>
          </FrameProvider>
        </MantineProvider>
      </APIProvider>
    </AuthProvider>
  );
}

export default Main;
