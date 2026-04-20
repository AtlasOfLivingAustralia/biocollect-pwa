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
  activity: BioCollectOfflineActivitySummary;
  onDelete: (activityId: string) => Promise<void>;
  onUpload: (activityId: string) => Promise<void>;
  onRefresh: () => void;
}

export function OfflineActivityItem({
  activity,
  onDelete,
  onUpload,
  onRefresh,
}: OfflineActivityItemProps) {
  const frame = useContext(FrameContext);
  const onLine = useOnLine();

  const [deleting, setDeleting] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const speciesText = useMemo(() => {
    const names = activity.species
      .map(({ name, scientificName, commonName }) => name || scientificName || commonName || '')
      .filter(Boolean);

    return names.length > 0 ? names.join(', ') : 'No species recorded';
  }, [activity.species]);

  const surveyDate = activity.surveyDate
    ? new Date(activity.surveyDate).toLocaleString('en-GB')
    : 'Not recorded';

  async function handleUpload() {
    if (activity.isInvalidDraft || uploading || !onLine) {
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
    if (deleting || !onLine) {
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
      imageUrl={activity.thumbnailUrl}
      imageAlt={`${activity.name} thumbnail`}
      actions={
        <>
          <Button
            disabled={deleting || uploading}
            data-testid='view-unpublished-record'
            variant='light'
            color='gray'
            size='xs'
            leftSection={<IconEye size='1rem' />}
            onClick={() => {
              frame.open(
                `${import.meta.env.VITE_API_BIOCOLLECT}${activity.transients.viewActivityUrl}`,
                'View Record',
              );
            }}
          >
            View
          </Button>
          <Button
            disabled={deleting || uploading}
            data-testid='edit-unpublished-record'
            variant='light'
            color='gray'
            size='xs'
            leftSection={<IconPencil size='1rem' />}
            onClick={() => {
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
          {!activity.isInvalidDraft && (
            <Button
              loading={uploading}
              disabled={!onLine || deleting}
              data-testid='upload-unpublished-record'
              variant='light'
              size='xs'
              leftSection={<IconUpload size='1rem' />}
              onClick={handleUpload}
            >
              Upload
            </Button>
          )}
          <Button
            loading={deleting}
            disabled={!onLine || uploading}
            data-testid='delete-unpublished-record'
            color='red'
            variant='light'
            size='xs'
            leftSection={<IconTrash size='1rem' />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </>
      }
    >
      <Skeleton visible={false}>
        <Text>{activity.name}</Text>
      </Skeleton>
      <Flex align='center' gap='sm' mb='xs'>
        <Avatar size='sm' radius='lg'>
          <IconDeviceFloppy size='1rem' />
        </Avatar>
        <Badge color='gray' variant='light'>
          Unpublished Draft
        </Badge>
      </Flex>
      <Text size='sm' c='dimmed'>
        Survey date: <b>{surveyDate}</b>
      </Text>
      <Text size='sm' c='dimmed' lineClamp={2}>
        Species: <b>{speciesText}</b>
      </Text>
      {activity.isInvalidDraft && (
        <Flex align='center' gap='xs'>
          <ThemeIcon color='orange' variant='light'>
            <IconPencilExclamation size='1rem' />
          </ThemeIcon>
          <Text size='xs' c='orange' mt='xs'>
            <b>Incomplete</b> - Please finish editing it before uploading.
          </Text>
        </Flex>
      )}
    </RecordCard>
  );
}
