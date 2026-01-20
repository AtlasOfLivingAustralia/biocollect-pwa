import { createContext } from 'react';
import { BioCollectDexie } from './dexie';
import biocollect from './endpoints/biocollect';

interface APIContext {
  db: BioCollectDexie;
  biocollect: ReturnType<typeof biocollect>;
}

const dexie = new BioCollectDexie();

export default createContext<APIContext>({
  db: dexie,
  biocollect: biocollect(dexie),
});
