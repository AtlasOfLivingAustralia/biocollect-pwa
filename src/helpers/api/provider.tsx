import { ReactNode, ReactElement, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import config from 'helpers/config';
import axios from 'axios';

// Contexts
import APIContext from './context';

// API endpoints & environment config
import biocollect from './endpoints/biocollect';

interface APIProviderProps {
  children?: ReactNode;
}

const APIProvider = (props: APIProviderProps): ReactElement => {
  const auth = useAuth();

  // useEffect hook to add / remove access token the axios globals
  useEffect(() => {
    if (auth.isAuthenticated) {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${auth.user?.access_token}`;
      axios.defaults.timeout = config.timeout;
      console.log('[API : Provider] Updated axios auth header & timeout');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log('[API : Provider] Removed token from axios auth header');
    }
  }, [auth.isAuthenticated]);

  return (
    <APIContext.Provider value={{ biocollect }}>
      {props.children}
    </APIContext.Provider>
  );
};

export default APIProvider;
