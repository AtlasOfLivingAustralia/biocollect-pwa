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
  unpublished: OfflineProjectActivities | null;
  unpublishedError: string | null;
  unpublishedLoading: boolean;
  unpublishedMap: OfflineProjectActivitiesMap;
  clearStorage: () => void;
  getOfflineActivities: (max: number) => Promise<OfflineProjectActivities>;
  getOfflineActivitiesMap: () => Promise<OfflineProjectActivitiesMap>;
  getOfflineProjectActivityActivities: (projectActivityId: string, max: number, offset: number) => Promise<OfflineProjectActivities>;
  refreshUnpublished: () => Promise<OfflineProjectActivities>;
  uploadOfflineActivity: (projectActivityId: string, activityId: string) => Promise<OfflineActivityMutationResult>;
  uploadAllOfflineActivities: (
    projectActivityId: string,
    onProgress?: (progress: OfflineUploadAllProgress) => void,
  ) => Promise<OfflineUploadAllResult>;
  deleteOfflineActivity: (projectActivityId: string, activityId: string) => Promise<OfflineActivityMutationResult>;
}

export interface OfflineProjectActivities {
  activities: BioCollectOfflineActivitySummary[];
  total: number;
}

export interface OfflineProjectActivitiesMap {
  project: { [projectId: string]: number };
  projectActivity: { [projectActivityId: string]: number };
}

export interface OfflineActivityMutationResult {
  activityId?: string;
  activityIds?: string[];
}

export interface OfflineUploadAllProgress {
  currentActivityId?: string;
  failed: number;
  phase: 'preparing' | 'uploading' | 'refreshing' | 'complete';
  processed: number;
  skipped: number;
  total: number;
  uploaded: number;
}

export interface OfflineUploadAllResult {
  errors: unknown[];
  failedActivityIds: string[];
  refreshError?: unknown;
  skippedActivityIds: string[];
  totalActivities: number;
  totalUploadableActivities: number;
  uploadedActivityIds: string[];
}

const fallbackMethod = () => console.error('Called PWA sync method before it was ready!');
const emptyUnpublishedMap = { project: {}, projectActivity: {} };

export default createContext<PWAContext>({
  storageStats: null,
  clearingStorage: false,
  unpublished: null,
  unpublishedError: null,
  unpublishedLoading: false,
  unpublishedMap: emptyUnpublishedMap,
  clearStorage: fallbackMethod,
  getOfflineActivities: () => Promise.resolve({ activities: [], total: 0 }),
  getOfflineActivitiesMap: () => Promise.resolve(emptyUnpublishedMap),
  getOfflineProjectActivityActivities: () => Promise.resolve({ activities: [], total: 0 }),
  refreshUnpublished: () => Promise.resolve({ activities: [], total: 0 }),
  uploadOfflineActivity: () => Promise.resolve({}),
  uploadAllOfflineActivities: () =>
    Promise.resolve({
      errors: [],
      failedActivityIds: [],
      skippedActivityIds: [],
      totalActivities: 0,
      totalUploadableActivities: 0,
      uploadedActivityIds: [],
    }),
  deleteOfflineActivity: () => Promise.resolve({}),
});
