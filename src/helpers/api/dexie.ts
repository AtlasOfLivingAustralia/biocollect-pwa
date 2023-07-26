import Dexie, { Table } from 'dexie';
import {
  BioCollectBioActivity,
  BioCollectProject,
  BioCollectPWASurvey,
} from 'types';

export class BioCollectDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  projects!: Table<BioCollectProject>;
  surveys!: Table<BioCollectPWASurvey>;
  activities!: Table<BioCollectBioActivity>;

  constructor() {
    super(`biocollect-${import.meta.env.MODE}`);
    this.version(1).stores({
      projects: '++projectId,name', // Primary key and indexed props
      surveys: '++id,projectId,pwaDownloaded',
      activities: '++activityId,projectId,projectActivityId,userId',
    });
  }
}
