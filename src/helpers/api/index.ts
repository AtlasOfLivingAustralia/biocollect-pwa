import axios from 'axios';
import { userManager } from '../auth';
import { claimCache, dexie, purgeStaleCache } from './dexie';
import biocollectApi from './endpoints/biocollect';

// A configured 0 means "none" for axios, which would hang forever on a poor connection
axios.defaults.timeout = Number.parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 30000;

axios.interceptors.request.use(async (config) => {
  const user = await userManager.getUser();

  // Add the authorization header if the user is authenticated
  if (user) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }

  return config;
});

purgeStaleCache().catch((error) => console.warn('[Cache] Failed to purge stale data', error));

export const biocollect = biocollectApi(dexie, async () => {
  const user = await userManager.getUser();
  if (user) await claimCache(user.profile.sub);
});
