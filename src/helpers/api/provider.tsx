import axios from 'axios';
import { type PropsWithChildren, type ReactElement, useEffect, useRef } from 'react';
import { useAuth } from 'react-oidc-context';

// Contexts
import APIContext from './context';
import { BioCollectDexie } from './dexie';
// API endpoints & environment config
import biocollect from './endpoints/biocollect';

const APIProvider = (props: PropsWithChildren): ReactElement => {
  const dexie = useRef<BioCollectDexie>(new BioCollectDexie());
  const auth = useAuth();

  // useEffect hook to add / remove access token the axios globals
  useEffect(() => {
    if (auth.isAuthenticated) {
      axios.defaults.headers.Authorization = `Bearer ${auth.user?.access_token}`;
      axios.defaults.timeout = import.meta.env.VITE_API_TIMEOUT;
    } else {
      delete axios.defaults.headers.Authorization;
    }
  }, [auth.isAuthenticated, auth.user, auth]);

  return (
    <APIContext.Provider value={{ db: dexie.current, biocollect: biocollect(dexie.current) }}>
      {props.children}
    </APIContext.Provider>
  );
};

export default APIProvider;
