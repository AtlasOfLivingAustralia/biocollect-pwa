import { createContext } from 'react';
import biocollect from './endpoints/biocollect';
import { BioCollectDexie } from './dexie';

interface APIContext {
  db: BioCollectDexie;
  biocollect: ReturnType<typeof biocollect>;
}

const dexie = new BioCollectDexie();

export default createContext<APIContext>({
  db: dexie,
  biocollect: biocollect(dexie),
});
