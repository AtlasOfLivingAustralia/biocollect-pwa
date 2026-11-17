import axios from 'axios';
import { userManager } from '../auth';
import { dexie } from './dexie';
import biocollectApi from './endpoints/biocollect';

const configuredTimeout = import.meta.env.VITE_API_TIMEOUT;
const timeout = Number(configuredTimeout);
if (
  typeof configuredTimeout !== 'string' ||
  configuredTimeout.trim() === '' ||
  !Number.isInteger(timeout) ||
  timeout < 0 ||
  timeout > 2_147_483_647
) {
  throw new Error('VITE_API_TIMEOUT must be an integer between 0 and 2147483647 milliseconds.');
}
axios.defaults.timeout = timeout;

axios.interceptors.request.use(async (config) => {
  const user = await userManager.getUser();

  // Add the authorization header if the user is authenticated
  if (user) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }

  return config;
});

export const biocollect = biocollectApi(dexie);
