import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

// App-specific imports
import Routes from './Routes';
import Layout from 'layout';

function App() {
  const auth = useAuth();

  // Effect hook to remove authentication search params from the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('code') && params.get('state') && auth.isAuthenticated) {
      params.delete('code');
      params.delete('state');

      // Remove the auth code & state variables from the history
      window.history.replaceState(
        null,
        '',
        window.location.origin + window.location.pathname + params.toString()
      );
    }
  }, [auth.isAuthenticated]);

  return (
    <Layout>
      <Routes />
    </Layout>
  );
}

export default App;
