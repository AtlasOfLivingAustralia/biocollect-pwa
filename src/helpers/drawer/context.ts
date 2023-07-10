import { createContext } from 'react';
import { BioCollectBioActivityView } from 'types';

interface RecordsDrawerContext {
  open: (
    view: BioCollectBioActivityView,
    fq?: { [filter: string]: string },
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
