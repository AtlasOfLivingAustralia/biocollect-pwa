import Dexie, { type Table } from 'dexie';
import type {
  BioCollectBioActivity,
  BioCollectHub,
  BioCollectProject,
  BioCollectSurvey,
} from '#/types';

interface Cached {
  surveyId: string;
  projectId: string;
}

export class BioCollectDexie extends Dexie {
  // For TypeScript types
  hubs!: Table<BioCollectHub>;
  projects!: Table<BioCollectProject>;
  surveys!: Table<BioCollectSurvey>;
  activities!: Table<BioCollectBioActivity>;
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
  }
}

export const dexie = new BioCollectDexie();
