import { Alert, Button, Center, Group, Progress, Stack, Text } from '@mantine/core';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { useOnLine } from '#/helpers/funcs';
import { usePWA } from '#/helpers/pwa';
import type { OfflineProjectActivities, OfflineUploadAllProgress } from '#/helpers/pwa/context';

import type { RecordsProps } from './PublishedRecords';
import { OfflineActivityItem } from './OfflineActivityItem';
import { IconRefresh, IconWorldUpload } from '@tabler/icons-react';

interface UnpublishedRecordsProps extends RecordsProps {
  initialError?: string | null;
  initialActivities: OfflineProjectActivities | null;
  onPublishedMutation?: () => void;
}

const PAGE_SIZE = 20;

export function UnpublishedRecords({
  initialActivities,
  initialError,
  filters,
  onPublishedMutation,
}: UnpublishedRecordsProps) {
  const pwa = usePWA();
  const onLine = useOnLine();

  const [items, setItems] = useState(initialActivities?.activities || []);
  const [total, setTotal] = useState(initialActivities?.total || 0);
  const [loading, setLoading] = useState(!initialActivities && !!filters.projectActivityId);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uploadingAll, setUploadingAll] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<OfflineUploadAllProgress | null>(null);
  const [error, setError] = useState<string | null>(initialError || null);

  const canUploadAll = useMemo(
    () => items.filter((item) => !item.isInvalidDraft).length > 0,
    [items],
  );
  const bulkUploadingActivityId =
    uploadProgress?.phase === 'uploading' ? uploadProgress.currentActivityId : undefined;
  const uploadProgressValue =
    uploadProgress && uploadProgress.total > 0
      ? Math.round((uploadProgress.processed / uploadProgress.total) * 100)
      : 0;

  const syncActivities = useCallback((activities: OfflineProjectActivities) => {
    setItems(activities.activities);
    setTotal(activities.total);
  }, []);

  const refresh = useCallback(async () => {
    if (!filters.projectActivityId) {
      syncActivities({ activities: [], total: 0 });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetched = await pwa.getOfflineProjectActivityActivities(
        filters.projectActivityId as string,
        PAGE_SIZE,
        0,
      );
      syncActivities(fetched);
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : 'Failed to load unpublished records.',
      );
    } finally {
      setLoading(false);
    }
  }, [filters.projectActivityId, pwa, syncActivities]);

  useEffect(() => {
    setError(initialError || null);
    syncActivities(initialActivities || { activities: [], total: 0 });
    setLoading(false);
  }, [initialActivities, initialError, syncActivities]);

  useEffect(() => {
    if (!initialActivities && filters.projectActivityId) {
      refresh().catch(() => undefined);
    }
  }, [filters.projectActivityId, initialActivities, refresh]);

  async function loadMore() {
    if (!filters.projectActivityId || loadingMore || items.length >= total) {
      return;
    }

    setLoadingMore(true);
    setError(null);

    try {
      const fetched = await pwa.getOfflineProjectActivityActivities(
        filters.projectActivityId as string,
        PAGE_SIZE,
        items.length,
      );

      const next = {
        activities: [...items, ...fetched.activities],
        total: fetched.total,
      };
      syncActivities(next);
    } catch (loadMoreError) {
      setError(
        loadMoreError instanceof Error
          ? loadMoreError.message
          : 'Failed to load more unpublished records.',
      );
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleDelete(activityId: string) {
    if (!filters.projectActivityId) {
      return;
    }

    setError(null);
    await pwa.deleteOfflineActivity(filters.projectActivityId as string, activityId);

    setItems((previousItems) =>
      previousItems.filter((activity) => activity.activityId !== activityId),
    );
    setTotal((previousTotal) => Math.max(previousTotal - 1, 0));

    onPublishedMutation?.();
  }

  async function handleUpload(activityId: string) {
    if (!filters.projectActivityId) {
      return;
    }

    setError(null);
    await pwa.uploadOfflineActivity(filters.projectActivityId as string, activityId);

    const next = {
      activities: items.filter((activity) => activity.activityId !== activityId),
      total: Math.max(total - 1, 0),
    };
    syncActivities(next);
    onPublishedMutation?.();
  }

  async function handleUploadAll() {
    if (!filters.projectActivityId || uploadingAll || !onLine) {
      return;
    }

    setUploadingAll(true);
    setUploadProgress({
      currentActivityId: undefined,
      failed: 0,
      phase: 'preparing',
      processed: 0,
      skipped: items.filter((item) => item.isInvalidDraft).length,
      total: items.filter((item) => !item.isInvalidDraft).length,
      uploaded: 0,
    });
    setError(null);

    try {
      await pwa.uploadAllOfflineActivities(filters.projectActivityId as string, setUploadProgress);
      await refresh();
      onPublishedMutation?.();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Failed to upload unpublished records.',
      );
    } finally {
      setUploadProgress(null);
      setUploadingAll(false);
    }
  }

  return (
    <Stack pb='sm'>
      <Group>
        <Button
          onClick={handleUploadAll}
          loading={uploadingAll}
          disabled={!onLine || !canUploadAll}
          variant='light'
          leftSection={<IconWorldUpload size='1rem' />}
          style={{ flexGrow: 1 }}
        >
          Upload all
        </Button>
        <Button
          loading={loading || loadingMore}
          variant='light'
          leftSection={<IconRefresh size='1rem' />}
          onClick={refresh}
        >
          Refresh
        </Button>
      </Group>
      {error && (
        <Alert color='red' title='Unpublished records unavailable'>
          {error}
        </Alert>
      )}
      {uploadProgress && (
        <Alert color='blue' title='Uploading unpublished records'>
          <Stack gap='xs'>
            <Group justify='space-between' gap='xs'>
              <Text size='sm'>
                {uploadProgress.phase === 'refreshing'
                  ? 'Refreshing unpublished records after upload...'
                  : `${uploadProgress.processed} of ${uploadProgress.total} uploadable records processed`}
              </Text>
              <Text size='sm' c='dimmed'>
                Uploaded {uploadProgress.uploaded}
                {uploadProgress.failed > 0 ? ` | Failed ${uploadProgress.failed}` : ''}
                {uploadProgress.skipped > 0 ? ` | Skipped ${uploadProgress.skipped}` : ''}
              </Text>
            </Group>
            <Progress
              value={uploadProgress.phase === 'refreshing' ? 100 : uploadProgressValue}
              animated
            />
          </Stack>
        </Alert>
      )}
      {!error && items.length === 0 && (
        <Center h='100%' py='xl'>
          <Text c='dimmed'>No unpublished records found</Text>
        </Center>
      )}

      {!loading &&
        items.map((activity) => (
          <OfflineActivityItem
            key={activity.activityId}
            activity={activity}
            bulkUploading={uploadingAll}
            bulkUploadingActivityId={bulkUploadingActivityId}
            onDelete={handleDelete}
            onUpload={handleUpload}
            onRefresh={refresh}
          />
        ))}

      {loading &&
        [0, 1, 2, 3, 4, 5, 6].map((num) => (
          <Fragment key={num}>
            <OfflineActivityItem />
          </Fragment>
        ))}

      {items.length < total && (
        <Button mt='md' onClick={loadMore} fullWidth loading={loadingMore} variant='light'>
          Load more
        </Button>
      )}
    </Stack>
  );
}
