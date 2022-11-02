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

  return (
    <AuthProvider {...config.auth}>
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
