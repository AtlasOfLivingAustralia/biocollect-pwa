import { useCallback, useState } from 'react';

const KEY = 'current-hub';
const DEFAULT_HUB = import.meta.env.VITE_API_BIOCOLLECT_HUB || 'acsa';

export const getHubId = () => localStorage.getItem(KEY) || DEFAULT_HUB;

export const useHubId = (): [string, (hubId: string) => void] => {
  const [hubId, setHubId] = useState<string>(getHubId());

  // Update hub helpder
  const updateHubId = useCallback(
    (newHubId: string) => {
      if (hubId !== newHubId) {
        localStorage.setItem(KEY, newHubId);
        setHubId(newHubId);
      }
    },
    [hubId, setHubId],
  );

  return [hubId, updateHubId];
};
