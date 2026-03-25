import { useContext } from 'react';
import PWAContext from './context';

export { default as PWAContext, type StorageSummaryStats } from './context';
export { default as PWAProvider } from './provider';

export const usePWA = () => useContext(PWAContext);
