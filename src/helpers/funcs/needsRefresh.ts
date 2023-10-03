const EXPIRE_TIME = Math.pow(10, 12) * 2;

const getStoredState = () => {
  const [storeKey, storeState] = Object.entries(localStorage).find(([key]) =>
    key.startsWith('oidc.user')
  ) || [null, null];

  // If a user exists in the store, return the parsed JSON, otherwise return null
  return [storeKey, JSON.parse(storeState || '{}')];
};

export const needsRefresh = () => {
  const [storeKey, storeState] = getStoredState();

  if (storeKey) {
    if (storeState.expires_at === EXPIRE_TIME) return true;

    // Overwrite the expires_at property to prevent re-login
    if (Date.now() >= storeState.expires_at * 1000) {
      localStorage.setItem(
        storeKey,
        JSON.stringify({ ...storeState, expires_at: EXPIRE_TIME })
      );
      return true;
    }
  }

  return false;
};
