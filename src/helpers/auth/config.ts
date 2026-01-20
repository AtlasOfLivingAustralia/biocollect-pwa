import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

// Use localStorage for user persistence
export const userStore = new WebStorageStateStore({ store: localStorage });

export const authConfig = {
  client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
  authority: import.meta.env.VITE_AUTH_AUTHORITY,
  scope: import.meta.env.VITE_AUTH_SCOPE,
  automaticSilentRenew: false,
  userStore,
};

export const userManager = new UserManager(authConfig);

if (import.meta.env.DEV) {
  console.log('Auth Config', authConfig);
}
