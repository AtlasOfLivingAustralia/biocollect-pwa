import { createContext } from 'react';

export interface FrameCallbacks {
  confirm?: () => void;
}

interface FrameContext {
  open: (src: string, title: string, callbacks?: FrameCallbacks) => void;
  close: () => void;
}

const defaultFunc = () => {
  throw new Error('Frame context not initialized');
};

export default createContext<FrameContext>({
  open: defaultFunc,
  close: defaultFunc,
});
