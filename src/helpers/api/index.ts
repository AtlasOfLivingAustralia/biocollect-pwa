import { dexie } from './dexie';
import biocollectApi from './endpoints/biocollect';

export const biocollect = biocollectApi(dexie);
