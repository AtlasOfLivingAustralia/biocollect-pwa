import { useAuth } from 'react-oidc-context';
import { Center, Loader } from '@mantine/core';

// App-specific imports
import Routes from './Routes';
import { useContext, useEffect } from 'react';
import { FrameContext } from 'helpers/frame';
import { needsReauth, useOnLine } from 'helpers/funcs';

function App() {
  const auth = useAuth();
  const frame = useContext(FrameContext);
  const onLine = useOnLine();

  console.log(
    `[App] isLoading: ${auth.isLoading} | isAuthenticated: ${auth.isAuthenticated}`
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

  // Check to check & refresh the authentication (if needed)
  useEffect(() => {
    async function checkAuth() {
      if (needsReauth() && onLine) {
        try {
          await auth.signinSilent();
        } catch (error) {
          // Handle Cognito signout differently (they don't supply an end session endpoint via OIDC discovery)
          if (
            !import.meta.env.VITE_AUTH_AUTHORITY.startsWith(
              'https://cognito-idp'
            )
          ) {
            const params = new URLSearchParams({
              client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
              redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
              logout_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
            });

            await auth.removeUser();
            window.location.replace(
              `${
                import.meta.env.VITE_AUTH_END_SESSION_URI
              }?${params.toString()}`
            );
          } else {
            await auth.signoutRedirect({
              post_logout_redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
            });
          }
        }
      }
    }

    checkAuth();
  }, []);

  if (auth.isLoading) {
    return (
      <Center sx={{ width: '100vw', height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  return <Routes />;
}

export default App;
