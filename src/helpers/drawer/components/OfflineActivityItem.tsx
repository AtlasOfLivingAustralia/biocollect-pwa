import { Avatar, Badge, Button, Flex, Skeleton, Text, ThemeIcon } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconDeviceFloppy,
  IconEye,
  IconPencil,
  IconPencilExclamation,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';
import { useContext, useMemo, useState } from 'react';

import { FrameContext } from '#/helpers/frame';
import { useOnLine } from '#/helpers/funcs';
import type { BioCollectOfflineActivitySummary } from '#/types';

import { RecordCard } from './RecordCard';

interface OfflineActivityItemProps {
  activity?: BioCollectOfflineActivitySummary;
  bulkUploading?: boolean;
  bulkUploadingActivityId?: string;
  onDelete?: (activityId: string) => Promise<void>;
  onUpload?: (activityId: string) => Promise<void>;
  onRefresh?: () => void;
}

export function OfflineActivityItem({
  activity,
  bulkUploading = false,
  bulkUploadingActivityId,
  onDelete,
  onUpload,
  onRefresh,
}: OfflineActivityItemProps) {
  const frame = useContext(FrameContext);
  const onLine = useOnLine();
  const loading = !activity;

  const [deleting, setDeleting] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const speciesText = useMemo(() => {
    const names = (activity?.species || [])
      .map(({ name, scientificName, commonName }) => name || scientificName || commonName || '')
      .filter(Boolean);

    return names.length > 0 ? names.join(', ') : 'No species recorded';
  }, [activity?.species]);

  const surveyDate = activity?.surveyDate
    ? new Date(activity.surveyDate).toLocaleString('en-GB')
    : 'Not recorded';
  const isBulkUploadingCurrentActivity =
    !!activity && bulkUploading && activity.activityId === bulkUploadingActivityId;

  async function handleUpload() {
    if (
      !activity ||
      activity.isInvalidDraft ||
      uploading ||
      bulkUploading ||
      !onLine ||
      !onUpload
    ) {
      return;
    }

    try {
      setUploading(true);
      await onUpload(activity.activityId);
    } finally {
      setUploading(false);
    }
  }

  function handleDelete() {
    if (!activity || deleting || bulkUploading || !onLine || !onDelete) {
      return;
    }

    modals.openConfirmModal({
      title: (
        <Text size='lg' ff='heading'>
          Confirm deletion
        </Text>
      ),
      centered: true,
      children: <Text>Are you sure you want to delete this unpublished record?</Text>,
      labels: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setDeleting(true);
          await onDelete(activity.activityId);
        } finally {
          setDeleting(false);
        }
      },
    });
  }

  return (
    <RecordCard
      imageUrl={activity?.thumbnailUrl}
      imageAlt={`${activity?.name || 'Record'} thumbnail`}
      actions={
        <>
          <Skeleton visible={loading} w={85}>
            <Button
              disabled={deleting || uploading || bulkUploading || loading}
              data-testid='view-unpublished-record'
              variant='light'
              color='gray'
              size='xs'
              leftSection={<IconEye size='1rem' />}
              fullWidth
              onClick={() => {
                if (!activity) {
                  return;
                }
                frame.open(
                  `${import.meta.env.VITE_API_BIOCOLLECT}${activity.transients.viewActivityUrl}`,
                  'View Record',
                );
              }}
            >
              View
            </Button>
          </Skeleton>
          <Skeleton visible={loading} w={85}>
            <Button
              disabled={deleting || uploading || bulkUploading || loading}
              data-testid='edit-unpublished-record'
              variant='light'
              color='gray'
              size='xs'
              leftSection={<IconPencil size='1rem' />}
              fullWidth
              onClick={() => {
                if (!activity) {
                  return;
                }
                frame.open(
                  `${import.meta.env.VITE_API_BIOCOLLECT}${activity.transients.editActivityUrl}`,
                  'Edit Record',
                  {
                    close: onRefresh,
                  },
                );
              }}
            >
              Edit
            </Button>
          </Skeleton>
          {!activity?.isInvalidDraft && (
            <Skeleton visible={loading} w={90}>
              <Button
                loading={uploading || isBulkUploadingCurrentActivity}
                disabled={!onLine || deleting || bulkUploading || loading}
                data-testid='upload-unpublished-record'
                variant='light'
                size='xs'
                leftSection={<IconUpload size='1rem' />}
                fullWidth
                onClick={handleUpload}
              >
                Upload
              </Button>
            </Skeleton>
          )}
          <Skeleton visible={loading} w={85}>
            <Button
              loading={deleting}
              disabled={!onLine || uploading || bulkUploading || loading}
              data-testid='delete-unpublished-record'
              color='red'
              variant='light'
              size='xs'
              leftSection={<IconTrash size='1rem' />}
              fullWidth
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Skeleton>
        </>
      }
    >
      <Skeleton visible={loading} mb='xs'>
        <Flex align='center' gap='xs'>
          <Avatar size='sm' radius='lg'>
            <IconDeviceFloppy size='1rem' />
          </Avatar>
          <Badge color='gray' variant='light'>
            Unpublished Draft
          </Badge>
        </Flex>
      </Skeleton>
      <Skeleton visible={loading}>
        <Text size='sm' c='dimmed'>
          Survey date: <b>{surveyDate}</b>
        </Text>
      </Skeleton>
      <Skeleton visible={loading}>
        <Text size='sm' c='dimmed' lineClamp={2}>
          Species: <b>{speciesText}</b>
        </Text>
      </Skeleton>
      {activity?.isInvalidDraft && (
        <Flex align='center' gap='xs'>
          <ThemeIcon color='orange' variant='light'>
            <IconPencilExclamation size='1rem' />
          </ThemeIcon>
          <Text size='xs' c='orange' mt='xs'>
            <b>Incomplete</b> - Please finish editing it before uploading.
          </Text>
        </Flex>
      )}
      {isBulkUploadingCurrentActivity && (
        <Text size='xs' c='blue' mt='xs'>
          Uploading this record now...
        </Text>
      )}
    </RecordCard>
  );
}
