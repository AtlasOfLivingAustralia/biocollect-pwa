import axios from 'axios';
import { userManager } from '../auth';
import { dexie } from './dexie';
import biocollectApi from './endpoints/biocollect';

axios.interceptors.request.use(async (config) => {
  const user = await userManager.getUser();

  // Add the authorization header if the user is authenticated
  if (user) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }

  return config;
});

export const biocollect = biocollectApi(dexie);
