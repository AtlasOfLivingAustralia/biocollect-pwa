import { createContext } from 'react';

export interface StorageSummaryStats {
  maximum: number;
  used: number;
  free: number;
  cleared: boolean;
}

interface PWAContext {
  storageStats: StorageSummaryStats | null;
  clearingStorage: boolean;
  clearStorage: () => void;
}

export default createContext<PWAContext>({
  storageStats: null,
  clearingStorage: false,
  clearStorage: () => {
    console.warn('Called clearStorage before it was ready!');
  },
});
