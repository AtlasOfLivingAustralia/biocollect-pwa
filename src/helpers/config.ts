import configJson from 'config.json';

export interface ApplicationConfig {
  timeout: number;
  auth: {
    authority: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
  };
  biocollect: {
    biocollect_url: string;
    ecodata_url: string;
  };
}

export const all = configJson as { [key: string]: ApplicationConfig };
export default all[import.meta.env.MODE];
