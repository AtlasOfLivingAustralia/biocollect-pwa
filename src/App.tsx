import { FrameContext } from '#/helpers/frame';
import { useOnLine } from '#/helpers/funcs';
import { useContext, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
// App-specific imports
import Routes from './Routes';
import { handleRefresh, handleSignOut } from './helpers/auth';

function App() {
  const auth = useAuth();
  const frame = useContext(FrameContext);
  const onLine = useOnLine();

  console.log(`[App] isLoading: ${auth.isLoading} | isAuthenticated: ${auth.isAuthenticated}`);

  // Helper function to try and refresh the auth token
  const tryTokenRefresh = async (from: string) => {
    console.log('trying token refresh', from);
    try {
      await handleRefresh();
    } catch (error) {
      console.log('[Auth] Refresh error', error);
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
    tryTokenRefresh('onLine hook');
  }, [onLine]);

  useEffect(() => {
    // Setup a token refresh interval if a valid interval is configured.
    const refreshInterval = Number.parseInt(import.meta.env.VITE_AUTH_TOKEN_REFRESH_INTERVAL, 10);
    console.log(`[Auth] Valid token refresh interval found, ${refreshInterval / 1000}s`);

    // Setup the refresh interbal
    let refreshHandler: ReturnType<typeof setInterval> | null = null;

    if (auth.isAuthenticated) {
      refreshHandler = setInterval(() => {
        tryTokenRefresh('interval hook');
      }, refreshInterval || 600000);
    }

    return () => {
      if (refreshHandler) clearInterval(refreshHandler);
    }
  }, [auth.isAuthenticated]);

  return <Routes />;
}

export default App;
