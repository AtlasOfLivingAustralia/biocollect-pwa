import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { Center, Loader } from '@mantine/core';

// App-specific imports
import Routes from './Routes';

function App() {
  const auth = useAuth();
  if (auth.isLoading) {
    return (
      <Center sx={{ width: '100vw', height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  return <Routes isAuthenticated={auth.isAuthenticated} />;
}

export default App;
