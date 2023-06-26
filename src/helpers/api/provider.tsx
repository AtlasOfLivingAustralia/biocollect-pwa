import { ReactNode, ReactElement, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import axios from 'axios';
import Logger from 'helpers/logger';

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
      axios.defaults.headers[
        'Authorization'
      ] = `Bearer ${auth.user?.access_token}`;
      axios.defaults.timeout = import.meta.env.VITE_API_TIMEOUT;
      Logger.log('[API : Provider] Updated axios auth header & timeout');
    } else {
      delete axios.defaults.headers['Authorization'];
      Logger.log('[API : Provider] Removed token from axios auth header');
    }
  }, [auth.isAuthenticated]);

  return (
    <APIContext.Provider value={{ biocollect }}>
      {props.children}
    </APIContext.Provider>
  );
};

export default APIProvider;
