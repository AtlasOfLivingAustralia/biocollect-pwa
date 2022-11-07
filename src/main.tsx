import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from '@mantine/core';
import { useLocalStorage, useColorScheme } from '@mantine/hooks';
import { AuthProvider, hasAuthParams } from 'react-oidc-context';

// App-specific imports
import config from 'helpers/config';
import { themes } from 'theme';
import App from './App';
import { APIProvider } from 'helpers/api';
import Logger from 'helpers/logger';

function Main() {
  const [colourScheme, setColourScheme] = useLocalStorage<ColorScheme>({
    key: 'app-colour-scheme',
    defaultValue: useColorScheme(),
    getInitialValueInEffect: true,
  });

  // Helper function for switching the colour scheme
  const toggleColourScheme = (value?: ColorScheme) =>
    setColourScheme(value || (colourScheme === 'dark' ? 'light' : 'dark'));

  return (
    <AuthProvider
      {...config.auth}
      onSigninCallback={(user) => {
        Logger.log('[Main] onSignInCallback', user);
        const params = new URLSearchParams(window.location.search);
        if (hasAuthParams()) {
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
