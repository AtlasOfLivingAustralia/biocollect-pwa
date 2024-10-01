const EXPIRE_TIME = Math.pow(10, 12) * 2;

export const getStoredState = () => {
  const { VITE_AUTH_AUTHORITY, VITE_AUTH_CLIENT_ID } = import.meta.env;
  const [storeKey, storeState] = Object.entries(localStorage).find(
    ([key]) => key === `oidc.user:${VITE_AUTH_AUTHORITY}:${VITE_AUTH_CLIENT_ID}`
  ) || [null, null];

  // If a user exists in the store, return the parsed JSON, otherwise return null
  return [storeKey, JSON.parse(storeState || '{}')];
};

export const preventExpire = () => {
  const [storeKey, storeState] = getStoredState();

  if (storeKey) {
    // Overwrite the expires_at property to prevent re-login
    localStorage.setItem(
      storeKey,
      JSON.stringify({ ...storeState, expires_at: EXPIRE_TIME })
    );
  }
};
