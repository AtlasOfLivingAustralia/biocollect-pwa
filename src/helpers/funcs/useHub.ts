import { useCallback, useState } from 'react';
import { hubs, type Hub } from '../hubs';

const KEY = 'current-hub';
const DEFAULT_HUB = import.meta.env.VITE_API_BIOCOLLECT_HUB || 'acsa';

export const getHubId = () => localStorage.getItem(KEY) || DEFAULT_HUB;

export const useHub = (): [Hub, (hubId: string) => void] => {
  const [hubId, setHubId] = useState<string>(getHubId());
  const hub: Hub = hubs[hubId];

  // Update hub helpder
  const updateHub = useCallback(
    (newHubId: string) => {
      if (Object.keys(hubs).includes(newHubId) && hubId !== newHubId) {
        localStorage.setItem(KEY, newHubId);
        setHubId(newHubId);
      } else {
        console.warn(`Tried to set hub to invalid ID '${newHubId}'!`);
      }
    },
    [hubId, setHubId],
  );

  if (!hub) {
    console.warn('Invalid hub state, reverting to acsa...');

    // Reset the hub localStorage state and return defaults
    localStorage.setItem(KEY, 'acsa');
    return [hubs.acsa, updateHub];
  }

  return [hub, updateHub];
};
