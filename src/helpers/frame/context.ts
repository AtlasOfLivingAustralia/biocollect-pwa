import { createContext } from 'react';

interface FrameContext {
  open: (src: string, title?: string) => void;
  close: () => void;
}

const defaultFunc = () => {
  throw new Error('Frame context not initialized');
};

export default createContext<FrameContext>({
  open: defaultFunc,
  close: defaultFunc,
});
