const EXPIRE_TIME = Math.pow(10, 12) * 2;

const getStoredState = () => {
  const { VITE_AUTH_AUTHORITY, VITE_AUTH_CLIENT_ID } = import.meta.env;
  const [storeKey, storeState] = Object.entries(localStorage).find(
    ([key]) => key === `oidc.user:${VITE_AUTH_AUTHORITY}:${VITE_AUTH_CLIENT_ID}`
  ) || [null, null];

  // If a user exists in the store, return the parsed JSON, otherwise return null
  return [storeKey, JSON.parse(storeState || '{}')];
};

export const needsReauth = () => {
  const [storeKey, storeState] = getStoredState();

  if (storeKey) {
    if (storeState.expires_at === EXPIRE_TIME) {
      console.log('[Reauth] Re-auth already flagged');
      return true;
    }

    // Overwrite the expires_at property to prevent re-login
    if (Date.now() >= storeState.expires_at * 1000) {
      console.log('[Reauth] Token expired, re-auth needed');

      localStorage.setItem(
        storeKey,
        JSON.stringify({ ...storeState, expires_at: EXPIRE_TIME })
      );
      return true;
    }
  }

  console.log('[Reauth] Re-auth not needed');
  return false;
};
