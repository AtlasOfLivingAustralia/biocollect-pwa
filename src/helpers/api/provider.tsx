import { ReactElement, useEffect, PropsWithChildren, useRef } from 'react';
import { useAuth } from 'react-oidc-context';
import axios from 'axios';

// Contexts
import APIContext from './context';

// API endpoints & environment config
import biocollect from './endpoints/biocollect';
import { BioCollectDexie } from './dexie';

const APIProvider = (props: PropsWithChildren<{}>): ReactElement => {
  const dexie = useRef<BioCollectDexie>(new BioCollectDexie());
  const auth = useAuth();

  // useEffect hook to add / remove access token the axios globals
  useEffect(() => {
    if (auth.isAuthenticated) {
      axios.defaults.headers[
        'Authorization'
      ] = `Bearer ${auth.user?.access_token}`;
      axios.defaults.timeout = import.meta.env.VITE_API_TIMEOUT;
    } else {
      delete axios.defaults.headers['Authorization'];
    }
  }, [auth.isAuthenticated]);

  return (
    <APIContext.Provider
      value={{ db: dexie.current, biocollect: biocollect(dexie.current) }}
    >
      {props.children}
    </APIContext.Provider>
  );
};

export default APIProvider;
