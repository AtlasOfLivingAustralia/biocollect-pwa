import { useAuth } from 'react-oidc-context';
import { Center, Loader } from '@mantine/core';

// App-specific imports
import Routes from './Routes';
import Logger from 'helpers/logger';

function App() {
  const { isLoading, isAuthenticated } = useAuth();
  Logger.log(
    `[App] isLoading: ${isLoading} | isAuthenticated: ${isAuthenticated}`
  );

  if (isLoading) {
    return (
      <Center sx={{ width: '100vw', height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  return <Routes />;
}

export default App;
