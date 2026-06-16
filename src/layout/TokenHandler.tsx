import axios from 'axios';

import { useCallback, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

// Helpers
import { handleRefresh, handleSignOut } from '#/helpers/auth';
import { useOnLine } from '#/helpers/funcs';

export function TokenHandler() {
  const auth = useAuth();
  const onLine = useOnLine();

  console.log(
    `[Auth] ${auth.isLoading ? 'loading' : 'loaded'} | ${auth.isAuthenticated ? 'authenticated' : 'unauthenticated'}`,
  );

  // Helper function to try and refresh the auth token
  const tryTokenRefresh = useCallback(async (from: string) => {
    console.log('[Auth] Trying token refresh, triggered by: ', from);
    try {
      await handleRefresh();
    } catch (error) {
      console.log('[Auth] Refresh error', error);
      await handleSignOut();
    }
  }, []);

  // Update the axios tokens when authenticated
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

      axios.defaults.headers.Authorization = `Bearer ${auth.user?.access_token}`;
      axios.defaults.timeout = import.meta.env.VITE_API_TIMEOUT;
    } else {
      delete axios.defaults.headers.Authorization;
    }

    return () => {
      if (refreshHandler) clearInterval(refreshHandler);
    };
  }, [auth]);

  // Check to check & refresh the authentication (if needed)
  useEffect(() => {
    tryTokenRefresh('onLine hook');
  }, [onLine]);

  return null;
}
