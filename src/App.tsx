import { Center, Loader } from '@mantine/core';
import { useContext, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { FrameContext } from '#/helpers/frame';
import { preventExpire, useOnLine } from '#/helpers/funcs';
// App-specific imports
import Routes from './Routes';
import { handleSignOut } from './helpers/auth';

function App() {
  const auth = useAuth();
  const frame = useContext(FrameContext);
  const onLine = useOnLine();

  console.log(`[App] isLoading: ${auth.isLoading} | isAuthenticated: ${auth.isAuthenticated}`);

  // Helper function to try and refresh the auth token
  const tryTokenRefresh = async () => {
    try {
      await auth.signinSilent();
    } catch (_) {
      await handleSignOut();
    }
  };

  // Check for showUnpublishedRecords flag
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('showUnpublishedRecords') === 'true') {
      // Open the unpublished records dialog
      frame.open(`${import.meta.env.VITE_API_BIOCOLLECT}/pwa/offlineList`, 'Unpublished Records');

      // Remove the query param
      params.delete('showUnpublishedRecords');
      window.history.replaceState(
        null,
        '',
        window.location.origin + window.location.pathname + params.toString(),
      );
    }
  }, []);

  // Check to check & refresh the authentication (if needed)
  useEffect(() => {
    if (onLine) {
      tryTokenRefresh();
    } else {
      preventExpire();
    }
  }, [onLine]);

  useEffect(() => {
    // Setup a token refresh interval if a valid interval is configured.
    const refreshInterval = Number.parseInt(import.meta.env.VITE_AUTH_TOKEN_REFRESH_INTERVAL, 10);
    console.log('[Auth] Valid token refresh interval found');

    // Setup the refresh interbal
    setInterval(() => {
      if (onLine) tryTokenRefresh();
    }, refreshInterval || 600000);
  }, []);

  if (auth.isLoading) {
    return (
      <Center style={{ width: '100vw', height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  return <Routes />;
}

export default App;
