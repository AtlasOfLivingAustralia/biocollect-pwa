import { Alert, Button, Center, Group, Progress, Stack, Text } from '@mantine/core';
import { Fragment, useMemo, useState } from 'react';

import { useOnLine } from '#/helpers/funcs';
import { usePWA, useUnpublished } from '#/helpers/pwa';
import type { OfflineUploadAllProgress } from '#/helpers/pwa/context';

import type { RecordsProps } from './PublishedRecords';
import { OfflineActivityItem } from './OfflineActivityItem';
import { IconRefresh, IconWorldUpload } from '@tabler/icons-react';

interface UnpublishedRecordsProps extends RecordsProps {
  onMutation?: () => void;
}

export function UnpublishedRecords({ survey, onMutation }: UnpublishedRecordsProps) {
  const pwa = usePWA();
  const onLine = useOnLine();
  const { unpublished, unpublishedError, unpublishedLoading, refresh } = useUnpublished({
    refreshOnMount: false,
  });

  const [uploadingAll, setUploadingAll] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<OfflineUploadAllProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const projectActivityId = survey.projectActivityId as string | undefined;

  const items = useMemo(
    () =>
      (unpublished?.activities || []).filter(
        (activity) => activity.projectActivityId === projectActivityId,
      ),
    [unpublished, projectActivityId],
  );

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

  const displayedError = error || unpublishedError;

  async function handleDelete(activityId: string) {
    if (!projectActivityId) {
      return;
    }

    setError(null);
    await pwa.deleteOfflineActivity(projectActivityId, activityId);
    onMutation?.();
  }

  async function handleUpload(activityId: string) {
    if (!projectActivityId) {
      return;
    }

    setError(null);
    await pwa.uploadOfflineActivity(projectActivityId, activityId);
    onMutation?.();
  }

  async function handleUploadAll() {
    if (!projectActivityId || uploadingAll || !onLine) {
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
      await pwa.uploadAllOfflineActivities(projectActivityId, setUploadProgress);
      onMutation?.();
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
          id='unpublishedRefresh'
          loading={unpublishedLoading}
          variant='light'
          leftSection={<IconRefresh size='1rem' />}
          onClick={() => refresh()}
        >
          Refresh
        </Button>
      </Group>
      {displayedError && (
        <Alert color='red' title='Unpublished records unavailable'>
          {displayedError}
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
      {!displayedError && !unpublishedLoading && items.length === 0 && (
        <Center h='100%' py='xl'>
          <Text c='dimmed'>No unpublished records found</Text>
        </Center>
      )}

      {!unpublishedLoading &&
        items.map((activity) => (
          <OfflineActivityItem
            data-testid='record-unpublished'
            key={activity.activityId}
            activity={activity}
            bulkUploading={uploadingAll}
            bulkUploadingActivityId={bulkUploadingActivityId}
            onDelete={handleDelete}
            onUpload={handleUpload}
            onRefresh={refresh}
          />
        ))}

      {unpublishedLoading &&
        items.length === 0 &&
        [0, 1, 2, 3, 4, 5, 6].map((num) => (
          <Fragment key={num}>
            <OfflineActivityItem />
          </Fragment>
        ))}
    </Stack>
  );
}
