import { createContext } from 'react';
import { BioCollectBioActivityView, FilterQueries } from 'types';

interface RecordsDrawerContext {
  open: (
    view: BioCollectBioActivityView,
    fq?: FilterQueries,
    recordsFor?: string
  ) => void;
  close: () => void;
}

const defaultFunc = () => {
  throw new Error('Records drawer context not initialized');
};

export default createContext<RecordsDrawerContext>({
  open: defaultFunc,
  close: defaultFunc,
});
