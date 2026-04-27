import { type PropsWithChildren, type ReactElement, useEffect, useRef, useState } from 'react';

// Contexts
import { dexie } from '../api/dexie';
import { userManager } from '../auth';
import PWAContext, {
  type OfflineActivityMutationResult,
  type OfflineProjectActivities,
  type OfflineUploadAllProgress,
  type OfflineUploadAllResult,
  type StorageSummaryStats,
} from './context';

interface StorageSummaryEvent {
  event: string;
  data: StorageSummaryStats;
}

interface WaitForEventOptions<TProgress> {
  onProgress?: (progress: TProgress) => void;
  progressEventName?: string;
  timeout?: number;
}

type SyncEvent =
  | 'clear-storage'
  | 'offline-project-activity-activities'
  | 'offline-upload-activity'
  | 'offline-upload-all-activities'
  | 'offline-delete-activity';

type SyncPayload = Record<string, unknown>;

interface SyncMessage<TPayload = unknown> {
  event?: string;
  requestId?: string;
  payload?: TPayload & {
    error?: string;
  };
}

function createRequestId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const PWAProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [storageStats, setStorageStats] = useState<StorageSummaryStats | null>(null);
  const [clearingStorage, setClearingStorage] = useState<boolean>(false);
  const ref = useRef<HTMLIFrameElement>(null);
  const syncFrameLoaded = useRef<boolean>(false);

  function waitForSyncFrame(timeout = 5000): Promise<Window> {
    return new Promise((resolve, reject) => {
      const loadedFrameWindow = ref.current?.contentWindow;
      if (syncFrameLoaded.current && loadedFrameWindow) {
        resolve(loadedFrameWindow);
        return;
      }

      const started = Date.now();
      const interval = setInterval(() => {
        const frameWindow = ref.current?.contentWindow;
        if (syncFrameLoaded.current && frameWindow) {
          clearInterval(interval);
          resolve(frameWindow);
          return;
        }

        if (Date.now() - started >= timeout) {
          clearInterval(interval);
          reject(new Error('PWA sync frame did not load in time.'));
        }
      }, 50);
    });
  }

  const send = async (event: SyncEvent, requestId: string, payload?: SyncPayload) => {
    const user = await userManager.getUser();
    const frameWindow = await waitForSyncFrame();

    frameWindow.postMessage(
      {
        event,
        requestId,
        payload: {
          ...(payload || {}),
          jwt: user?.access_token,
        },
      },
      import.meta.env.VITE_API_BIOCOLLECT,
    );

    return frameWindow;
  };

  function waitForEvent<T, TProgress = never>(
    eventName: SyncEvent,
    eventPayload: SyncPayload,
    options?: WaitForEventOptions<TProgress>,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let frameWindow: Window | null = null;
      const requestId = createRequestId();
      const timeout = options?.timeout ?? 2000;
      let eventTimeout: ReturnType<typeof setTimeout>;

      const clearListeners = () => {
        clearTimeout(eventTimeout);
        window.removeEventListener('message', eventHandler);
      };

      const resetTimeout = () => {
        clearTimeout(eventTimeout);
        eventTimeout = setTimeout(() => {
          window.removeEventListener('message', eventHandler);
          reject(new Error(`${timeout}ms timeout exceeded when waiting for '${eventName}' event!`));
        }, timeout);
      };

      const eventHandler = (message: MessageEvent<SyncMessage>) => {
        if (!frameWindow || message.source !== frameWindow) {
          return;
        }

        const { data } = message;
        if (data?.requestId !== requestId) {
          return;
        }

        if (options?.progressEventName && data?.event === options.progressEventName) {
          options.onProgress?.(data.payload as TProgress);
          resetTimeout();
          return;
        }

        if (data?.event !== eventName) {
          return;
        }

        clearListeners();

        if (data?.payload?.error) {
          reject(new Error(data.payload.error));
          return;
        }

        resolve(data.payload);
      };

      window.addEventListener('message', eventHandler);
      resetTimeout();
      send(eventName, requestId, eventPayload)
        .then((targetWindow) => {
          frameWindow = targetWindow;
        })
        .catch((error) => {
          clearListeners();
          reject(error);
        });
    });
  }

  useEffect(() => {
    // Define a message handler to listen for download events
    const messageHandler = async (message: MessageEvent<StorageSummaryEvent>) => {
      if (ref.current?.contentWindow && message.source !== ref.current.contentWindow) {
        return;
      }

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
    send('clear-storage', createRequestId()).catch((error) => {
      console.error('Failed to clear PWA sync storage.', error);
      setClearingStorage(false);
    });
    setClearingStorage(true);

    // Clear the cached table in the DB
    dexie.cached.clear();
  };

  const getOfflineProjectActivityActivities = async (
    projectActivityId: string,
    max = 10,
    offset = 0,
  ) => {
    return await waitForEvent<OfflineProjectActivities>(
      'offline-project-activity-activities',
      {
        projectActivityId,
        max,
        offset,
      },
      { timeout: 10000 },
    );
  };

  const uploadOfflineActivity = async (projectActivityId: string, activityId: string) => {
    return await waitForEvent<OfflineActivityMutationResult>(
      'offline-upload-activity',
      { projectActivityId, activityId },
      { timeout: 30000 },
    );
  };

  const uploadAllOfflineActivities = async (
    projectActivityId: string,
    onProgress?: (progress: OfflineUploadAllProgress) => void,
  ) => {
    return await waitForEvent<OfflineUploadAllResult, OfflineUploadAllProgress>(
      'offline-upload-all-activities',
      { projectActivityId },
      {
        onProgress,
        progressEventName: 'offline-upload-all-activities-progress',
        timeout: 120000,
      },
    );
  };

  const deleteOfflineActivity = async (projectActivityId: string, activityId: string) => {
    return await waitForEvent<OfflineActivityMutationResult>(
      'offline-delete-activity',
      { projectActivityId, activityId },
      { timeout: 30000 },
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
      {/** biome-ignore lint/a11y/noNoninteractiveElementInteractions: the hidden sync frame must report readiness before messages are sent */}
      <iframe
        ref={ref}
        title='PWA Sync'
        src={`${import.meta.env.VITE_API_BIOCOLLECT}/pwa/sync`}
        onLoad={() => {
          syncFrameLoaded.current = true;
        }}
        style={{ display: 'none' }}
      />
      {children}
    </PWAContext.Provider>
  );
};

export default PWAProvider;
