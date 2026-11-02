import Dexie, { type Table } from 'dexie';
import type { BioCollectHub, BioCollectProject, BioCollectSurvey } from '#/types';

interface Cached {
  surveyId: string;
  projectId: string;
  lastUpdated?: string;
}

const OWNER_KEY = 'cache-owner';
const DOCUMENT_CACHE = 'biocollect-documents';
const MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

export class BioCollectDexie extends Dexie {
  // For TypeScript types
  hubs!: Table<BioCollectHub>;
  projects!: Table<BioCollectProject>;
  surveys!: Table<BioCollectSurvey>;
  cached!: Table<Cached>;

  constructor() {
    super(`biocollect-${import.meta.env.MODE}`);
    this.version(1).stores({
      hubs: '++id,name',
      projects: '++projectId,url', // Primary key and indexed props
      surveys: '++id,projectId,pwaDownloaded',
      activities: '++activityId,projectId,projectActivityId,userId',
      cached: '++surveyId,projectId',
    });
    this.version(2)
      .stores({
        projects: '++projectId,url,hub,cachedAt',
        activities: null,
      })
      .upgrade((tx) =>
        tx
          .table('projects')
          .toCollection()
          .modify((project, ref) => {
            // Rows saved before the hub was tracked can never be listed, so drop them
            if (project.hub) project.cachedAt = Date.now();
            else delete ref.value;
          }),
      );
  }
}

export const dexie = new BioCollectDexie();

// Projects and surveys can be member-only, so they must not outlive the user that fetched them
export const clearApiCache = () =>
  Promise.all([
    dexie.projects.clear(),
    dexie.surveys.clear(),
    globalThis.caches?.delete(DOCUMENT_CACHE),
  ]);

let claimedBy: string | undefined;
let claim: Promise<void> = Promise.resolve();

// Clears the API cache when a different user than the one who filled it signs in
export const claimCache = (userId: string) => {
  if (claimedBy !== userId) {
    claimedBy = userId;
    claim = (async () => {
      const owner = localStorage.getItem(OWNER_KEY);

      // An unknown owner cannot safely be assumed to be the current user.
      if (owner !== userId) await clearApiCache();
      localStorage.setItem(OWNER_KEY, userId);
    })().catch((error) => {
      claimedBy = undefined;
      console.error('[Cache] Failed to claim the cache', error);
      throw error;
    });
  }

  return claim;
};

// Drops projects (and their surveys) not refreshed recently, keeping any with a downloaded survey
export const purgeStaleCache = () =>
  dexie.transaction('rw', dexie.projects, dexie.surveys, dexie.cached, async () => {
    const downloaded = new Set(await dexie.cached.orderBy('projectId').uniqueKeys());
    const staleIds = (
      await dexie.projects
        .where('cachedAt')
        .below(Date.now() - MAX_AGE)
        .primaryKeys()
    ).filter((id) => !downloaded.has(id));

    await dexie.projects.bulkDelete(staleIds);
    await dexie.surveys.where('projectId').anyOf(staleIds).delete();
  });
