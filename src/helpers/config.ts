import config from 'ala.config.json';

export interface ApplicationConfig {
  timeout: number;
  auth: {
    user_pool?: string;
    url?: string;
    client_id: string;
    scopes: string;
  };
  biocollect: {
    biocollect_url: string;
    ecodata_url: string;
  };
}

export default config as { [key: string]: ApplicationConfig };
