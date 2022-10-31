import { createContext } from 'react';
import biocollect from './endpoints/biocollect';

interface APIContext {
  biocollect: typeof biocollect;
}

export default createContext<APIContext>({ biocollect });
