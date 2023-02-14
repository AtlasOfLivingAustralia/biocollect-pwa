import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { AuthProvider, hasAuthParams } from 'react-oidc-context';

// App-specific imports
import config from 'helpers/config';
import { themes } from 'theme';
import App from './App';
import { APIProvider } from 'helpers/api';
import Logger from 'helpers/logger';
import { WebStorageStateStore } from 'oidc-client-ts';

// Use localStorage for user persistence
const userStore = new WebStorageStateStore({ store: localStorage });

function Main() {
  const [colourScheme, setColourScheme] = useLocalStorage<ColorScheme>({
    key: 'app-colour-scheme',
    defaultValue: matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
    getInitialValueInEffect: true,
  });

  // Helper function for switching the colour scheme
  const toggleColourScheme = (value?: ColorScheme) =>
    setColourScheme(value || (colourScheme === 'dark' ? 'light' : 'dark'));

  return (
    <AuthProvider
      client_id={config.auth.client_id}
      redirect_uri={config.auth.redirect_uri}
      authority={`https://cognito-idp.${config.auth.region}.amazonaws.com/${config.auth.user_pool_id}`}
      onSigninCallback={(user) => {
        Logger.log('[Main] onSignInCallback', user);
        const params = new URLSearchParams(window.location.search);
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
        }
      }}
      userStore={userStore}
    >
      <APIProvider>
        <ColorSchemeProvider
          colorScheme={colourScheme}
          toggleColorScheme={toggleColourScheme}
        >
          <MantineProvider
            theme={themes[colourScheme]}
            withGlobalStyles
            withNormalizeCSS
          >
            <App />
          </MantineProvider>
        </ColorSchemeProvider>
      </APIProvider>
    </AuthProvider>
  );
}

export default Main;
