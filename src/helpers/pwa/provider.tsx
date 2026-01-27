import {
  type PropsWithChildren,
  type ReactElement,
  useEffect,
  useState,
} from 'react';

// Contexts
import PWAContext, { type StorageSummaryStats } from './context';

interface StorageSummaryEvent {
  event: string;
  data: StorageSummaryStats;
}

const PWAProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [storageStats, setStorageStats] = useState<StorageSummaryStats | null>(null);

  useEffect(() => {
    // Define a message handler to listen for download events
    const messageHandler = (message: MessageEvent<StorageSummaryEvent>) => {
      const { data } = message;
      if (data?.event === 'storage-stats') {
        setStorageStats(data.data);
      }
    };

    // Subscribe & setup unmount callback
    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, []);

  return (
    <PWAContext.Provider value={{ storageStats }}>
      <iframe title="PWA Sync" src={`${import.meta.env.VITE_API_BIOCOLLECT}/pwa/sync`} style={{ display: 'none' }} />
      {children}
    </PWAContext.Provider>
  );
};

export default PWAProvider;
