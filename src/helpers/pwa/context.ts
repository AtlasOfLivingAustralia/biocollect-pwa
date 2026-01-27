import { createContext } from 'react';

export interface StorageSummaryStats {
  maximum: number;
  used: number;
  free: number;
}

interface PWAContext {
  storageStats: StorageSummaryStats | null;
}

export default createContext<PWAContext>({
  storageStats: null,
});
