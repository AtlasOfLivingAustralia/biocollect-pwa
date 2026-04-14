import type { BioCollectOfflineActivitySummary } from '#/types';
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
  getOfflineProjectActivityActivities: (projectActivityId: string, max: number, offset: number) => Promise<OfflineProjectActivities>;
  uploadOfflineActivity: (projectActivityId: string, activityId: string) => Promise<OfflineActivityMutationResult>;
  uploadAllOfflineActivities: (projectActivityId: string) => Promise<OfflineActivityMutationResult>;
  deleteOfflineActivity: (projectActivityId: string, activityId: string) => Promise<OfflineActivityMutationResult>;
}

export interface OfflineProjectActivities {
  activities: BioCollectOfflineActivitySummary[];
  total: number;
}

export interface OfflineActivityMutationResult {
  activityId?: string;
  activityIds?: string[];
}

const fallbackMethod = () => console.error('Called PWA sync method before it was ready!');

export default createContext<PWAContext>({
  storageStats: null,
  clearingStorage: false,
  clearStorage: fallbackMethod,
  getOfflineProjectActivityActivities: () => Promise.resolve({ activities: [], total: 0 }),
  uploadOfflineActivity: () => Promise.resolve({}),
  uploadAllOfflineActivities: () => Promise.resolve({ activityIds: [] }),
  deleteOfflineActivity: () => Promise.resolve({}),
});
