import { createContext } from 'react';
import { BioCollectProject } from 'types';

interface DrawerContext {
  open: (projects: BioCollectProject[] | Promise<BioCollectProject[]>) => void;
  close: () => void;
}

const defaultFunc = () => {
  throw new Error('Drawer context not initialized');
};

export default createContext<DrawerContext>({
  open: defaultFunc,
  close: defaultFunc,
});
