import { useCallback, useState } from 'react';

const KEY = 'current-hub';

// Apply a deep-linked hub once, then drop it from the URL so a later
// switch (or an invalid value falling back to the default) is what a refresh restores.
const searchParams = new URLSearchParams(window.location.search);
if (searchParams.has('hub')) {
  const paramHub = searchParams.get('hub')?.trim();
  if (paramHub) {
    localStorage.setItem(KEY, paramHub);
  }

  searchParams.delete('hub');
  const search = searchParams.toString();
  const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
  window.history.replaceState(window.history.state, '', nextUrl);
}

export const DEFAULT_HUB = import.meta.env.VITE_API_BIOCOLLECT_HUB || 'acsa';

export const getHubId = () => localStorage.getItem(KEY) || DEFAULT_HUB;

export const useHubId = (): [string, (hubId: string | null) => void] => {
  const [hubId, setHubId] = useState<string>(getHubId());

  // Update hub helper. Pass null to discard the stored hub.
  const updateHubId = useCallback(
    (newHubId: string | null) => {
      if (!newHubId) {
        localStorage.removeItem(KEY);
        if (hubId !== DEFAULT_HUB) setHubId(DEFAULT_HUB);
        return;
      }

      if (hubId !== newHubId) {
        localStorage.setItem(KEY, newHubId);
        setHubId(newHubId);
      }
    },
    [hubId],
  );

  return [hubId, updateHubId];
};
