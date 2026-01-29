import {
  type PropsWithChildren,
  type ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// Contexts
import PWAContext, { type StorageSummaryStats } from './context';
import { APIContext } from '../api';

interface StorageSummaryEvent {
  event: string;
  data: StorageSummaryStats;
}

const PWAProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [storageStats, setStorageStats] = useState<StorageSummaryStats | null>(null);
  const [clearingStorage, setClearingStorage] = useState<boolean>(false);
  const ref = useRef<HTMLIFrameElement>(null);
  const api = useContext(APIContext);

  const send = (event: string, data?: unknown) => {
    if (ref.current?.contentWindow) {
      ref.current.contentWindow.postMessage({ event, data }, '*');
    }
  };

  useEffect(() => {
    // Define a message handler to listen for download events
    const messageHandler = async (message: MessageEvent<StorageSummaryEvent>) => {
      const { data } = message;
      if (data?.event === 'storage-stats') {
        setStorageStats(data.data);

        // If the storage was just cleared
        if (data.data.cleared) setClearingStorage(false);
      }
    };

    // Subscribe & setup unmount callback
    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, []);

  const clearStorage = () => {
    send('clear-storage');
    setClearingStorage(true);

    // Clear the cached table in the DB
    api.db.cached.clear();
  };

  return (
    <PWAContext.Provider value={{ storageStats, clearingStorage, clearStorage }}>
      <iframe ref={ref} title="PWA Sync" src={`${import.meta.env.VITE_API_BIOCOLLECT}/pwa/sync`} style={{ display: 'none' }} />
      {children}
    </PWAContext.Provider>
  );
};

export default PWAProvider;
