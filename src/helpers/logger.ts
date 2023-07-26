import { isFrame } from './funcs';

export default {
  debug: (...data: any[]) => {
    if (import.meta.env.DEV && !isFrame()) console.debug(...data);
  },
  log: (...data: any[]) => {
    if (import.meta.env.DEV && !isFrame()) console.log(...data);
  },
  info: (...data: any[]) => {
    if (import.meta.env.DEV && !isFrame()) console.info(...data);
  },
  warn: (...data: any[]) => {
    if (import.meta.env.DEV && !isFrame()) console.warn(...data);
  },
  error: (...data: any[]) => {
    if (import.meta.env.DEV && !isFrame()) console.error(...data);
  },
};
