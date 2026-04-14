import { type PropsWithChildren, type ReactElement, useEffect, useRef, useState } from 'react';

// Contexts
import { dexie } from '../api/dexie';
import { userManager } from '../auth';
import PWAContext, {
  type OfflineActivityMutationResult,
  type OfflineProjectActivities,
  type StorageSummaryStats,
} from './context';

interface StorageSummaryEvent {
  event: string;
  data: StorageSummaryStats;
}

const PWAProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [storageStats, setStorageStats] = useState<StorageSummaryStats | null>(null);
  const [clearingStorage, setClearingStorage] = useState<boolean>(false);
  const ref = useRef<HTMLIFrameElement>(null);

  const send = (event: string, payload?: unknown) => {
    if (ref.current?.contentWindow) {
      ref.current.contentWindow.postMessage({ event, payload }, import.meta.env.VITE_API_BIOCOLLECT);
    }
  };

  function waitForEvent<T>(eventName: string, eventPayload: unknown, timeout = 2000): Promise<T> {
    return new Promise((resolve, reject) => {
      const frameWindow = ref.current?.contentWindow;
      const eventHandler = (message: MessageEvent) => {
        if (frameWindow && message.source !== frameWindow) {
          return;
        }

        const { data } = message;
        if (data?.event !== eventName) {
          return;
        }

        clearTimeout(eventTimeout);
        window.removeEventListener('message', eventHandler);

        if (data?.payload?.error) {
          reject(new Error(data.payload.error));
          return;
        }

        resolve(data.payload);
      };

      const eventTimeout = setTimeout(() => {
        window.removeEventListener('message', eventHandler);
        reject(new Error(`${timeout}ms timeout exceeded when waiting for '${eventName}' event!`));
      }, timeout);

      window.addEventListener('message', eventHandler);
      send(eventName, eventPayload);
    });
  }

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
    dexie.cached.clear();
  };

  const getOfflineProjectActivityActivities = async (
    projectActivityId: string,
    max = 10,
    offset = 0,
  ) => {
    return await waitForEvent<OfflineProjectActivities>('offline-project-activity-activities', {
      projectActivityId,
      max,
      offset,
    }, 10000);
  };

  const uploadOfflineActivity = async (projectActivityId: string, activityId: string) => {
    const user = await userManager.getUser();
    return await waitForEvent<OfflineActivityMutationResult>(
      'offline-upload-activity',
      { projectActivityId, activityId, token: user?.access_token },
      30000,
    );
  };

  const uploadAllOfflineActivities = async (projectActivityId: string) => {
    const user = await userManager.getUser();
    return await waitForEvent<OfflineActivityMutationResult>(
      'offline-upload-all-activities',
      { projectActivityId, token: user?.access_token },
      120000,
    );
  };

  const deleteOfflineActivity = async (projectActivityId: string, activityId: string) => {
    return await waitForEvent<OfflineActivityMutationResult>(
      'offline-delete-activity',
      { projectActivityId, activityId },
      30000,
    );
  };

  return (
    <PWAContext.Provider
      value={{
        storageStats,
        clearingStorage,
        clearStorage,
        getOfflineProjectActivityActivities,
        uploadOfflineActivity,
        uploadAllOfflineActivities,
        deleteOfflineActivity,
      }}
    >
      <iframe
        ref={ref}
        title='PWA Sync'
        src={`${import.meta.env.VITE_API_BIOCOLLECT}/pwa/sync`}
        style={{ display: 'none' }}
      />
      {children}
    </PWAContext.Provider>
  );
};

export default PWAProvider;
