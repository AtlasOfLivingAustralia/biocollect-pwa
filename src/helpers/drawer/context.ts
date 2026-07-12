import { createContext } from 'react';
import type { BioCollectSurvey } from '#/types';

interface RecordsDrawerContext {
  open: (
    survey: BioCollectSurvey,
    showUnpublished?: boolean,
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
