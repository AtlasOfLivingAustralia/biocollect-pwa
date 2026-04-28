import { useCallback, useContext, useEffect } from 'react';
import PWAContext from './context';

interface UseUnpublishedOptions {
  refreshOnMount?: boolean;
}

export function useUnpublished({ refreshOnMount = true }: UseUnpublishedOptions = {}) {
  const {
    unpublished,
    unpublishedError,
    unpublishedLoading,
    unpublishedMap,
    refreshUnpublished,
  } = useContext(PWAContext);

  const refresh = useCallback(async () => {
    try {
      return await refreshUnpublished();
    } catch (error) {
      console.error('Failed to refresh unpublished records.', error);
      return undefined;
    }
  }, [refreshUnpublished]);

  useEffect(() => {
    if (refreshOnMount) {
      refresh();
    }
  }, [refresh, refreshOnMount]);

  return {
    unpublished,
    unpublishedError,
    unpublishedLoading,
    unpublishedMap,
    refresh,
  };
}
