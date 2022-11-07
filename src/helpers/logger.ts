export default {
  debug: (...data: any[]) => {
    if (import.meta.env.DEV) console.debug(...data);
  },
  log: (...data: any[]) => {
    if (import.meta.env.DEV) console.log(...data);
  },
  info: (...data: any[]) => {
    if (import.meta.env.DEV) console.info(...data);
  },
  warn: (...data: any[]) => {
    if (import.meta.env.DEV) console.warn(...data);
  },
  error: (...data: any[]) => {
    if (import.meta.env.DEV) console.error(...data);
  },
};
