import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from '@mantine/core';
import { useLocalStorage, useColorScheme } from '@mantine/hooks';
import { AuthProvider } from 'react-oidc-context';

// App-specific imports
import config from 'helpers/config';
import Routes from './Routes';
import Layout from 'views/Layout';
import { themes } from 'theme';

function App() {
  const [colourScheme, setColourScheme] = useLocalStorage<ColorScheme>({
    key: 'app-colour-scheme',
    defaultValue: useColorScheme(),
    getInitialValueInEffect: true,
  });

  // Helper function for switching the colour scheme
  const toggleColourScheme = (value?: ColorScheme) =>
    setColourScheme(value || (colourScheme === 'dark' ? 'light' : 'dark'));

  const onSigninCallback = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('code') && params.get('state')) {
      params.delete('code');
      params.delete('state');
    }

    // Remove the auth code & state variables from the history
    window.history.replaceState(
      null,
      '',
      window.location.origin + window.location.pathname + params.toString()
    );
  };

  return (
    <AuthProvider {...config.auth} onSigninCallback={onSigninCallback}>
      <ColorSchemeProvider
        colorScheme={colourScheme}
        toggleColorScheme={toggleColourScheme}
      >
        <MantineProvider
          theme={themes[colourScheme]}
          withGlobalStyles
          withNormalizeCSS
        >
          <Layout>
            <Routes />
          </Layout>
        </MantineProvider>
      </ColorSchemeProvider>
    </AuthProvider>
  );
}

export default App;
