import { useAuth } from 'react-oidc-context';
import { Center, Loader } from '@mantine/core';

// App-specific imports
import Routes from './Routes';
import { useContext, useEffect } from 'react';
import { FrameContext } from 'helpers/frame';

function App() {
  const { isLoading, isAuthenticated } = useAuth();
  const frame = useContext(FrameContext);

  console.log(
    `[App] isLoading: ${isLoading} | isAuthenticated: ${isAuthenticated}`
  );

  // Check for showUnpublishedRecords flag
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('showUnpublishedRecords') === 'true') {
      // Open the unpublished records dialog
      frame.open(
        `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/offlineList`,
        'Unpublished Records'
      );

      // Remove the query param
      params.delete('showUnpublishedRecords');
      window.history.replaceState(
        null,
        '',
        window.location.origin + window.location.pathname + params.toString()
      );
    }
  }, []);

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
