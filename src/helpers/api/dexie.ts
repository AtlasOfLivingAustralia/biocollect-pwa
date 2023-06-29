import Dexie, { Table } from 'dexie';
import { BioCollectProject, BioCollectSurvey } from 'types';

export class BioCollectDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  projects!: Table<BioCollectProject>;
  surveys!: Table<BioCollectSurvey>;

  constructor() {
    super('biocollect');
    this.version(1).stores({
      projects: '++projectId,name', // Primary key and indexed props
      surveys: '++id,projectId',
    });
  }
}
