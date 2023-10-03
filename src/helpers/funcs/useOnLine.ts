import { useEffect, useState } from 'react';

// Helper function to get whether the client is online
export const isOnline = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;

export const useOnLine = () => {
  const [status, setStatus] = useState(isOnline());

  // Helper / callback functions for online status changing
  const handleOnline = () => setStatus(true);
  const handleOffline = () => setStatus(false);

  // Add event listeners for changing online/offile state
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
};
