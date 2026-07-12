import { Avatar, Box, Button, Flex, Skeleton, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { IconEye, IconLock, IconPencil, IconTrash, IconUser } from '@tabler/icons-react';
import { act, useCallback, useContext, useState } from 'react';
import { FrameContext } from '#/helpers/frame';
import { getInitials, useOnLine } from '#/helpers/funcs';
import { biocollect } from '#/helpers/api';
import { modals } from '@mantine/modals';

// Helpers
import type { BioCollectBioActivity } from '#/types';
import { RecordCard } from './RecordCard';

// Local components
interface ActivityItemProps {
  activity?: BioCollectBioActivity;
  onDelete?: (activityIdToDelete: string) => void;
}

export function ActivityItem({ activity, onDelete, ...rest }: ActivityItemProps) {
  const [deleting, setDeleting] = useState<boolean>(false);
  const frame = useContext(FrameContext);
  const loading = !activity;
  const onLine = useOnLine();

  const handleDelete = useCallback(async () => {
    if (activity && !deleting) {
      modals.openConfirmModal({
        title: (
          <Text size='lg' ff='heading'>
            Confirm deletion
          </Text>
        ),
        centered: true,
        children: <Text>Are you sure you want to delete this activity?</Text>,
        labels: {
          confirm: 'Confirm',
          cancel: 'Cancel',
        },
        onConfirm: async () => {
          try {
            setDeleting(true);
            await biocollect.deleteActivity(activity.activityId);

            if (onDelete) {
              onDelete(activity.activityId);
            }
          } catch (error) {
            console.error('Failed to delete activity!', error);
            setDeleting(false);
          }
        },
      });
    }
  }, [deleting, activity]);

  return (
    <RecordCard
      imageUrl={activity?.thumbnailUrl}
      imageAlt={activity?.name || 'Record image'}
      actions={
        <>
          {onLine && (
            <Skeleton visible={loading} w={90}>
              <Button
                disabled={deleting}
                data-testid='view-published-record'
                variant='light'
                size='xs'
                leftSection={<IconEye size='1rem' />}
                fullWidth
                onClick={
                  activity &&
                  (() => {
                    frame.open(
                      `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/bioActivity/index/${activity.projectActivityId}?projectId=${activity.projectId}&activityId=${activity.activityId}`,
                      `View Record - ${activity.name}`,
                    );
                  })
                }
              >
                View
              </Button>
            </Skeleton>
          )}
          {onLine && (activity?.showCrud || activity?.userCanModerate) && (
            <Skeleton visible={loading} w={90}>
              <Button
                disabled={deleting}
                data-testid='edit-published-record'
                variant='light'
                size='xs'
                leftSection={<IconPencil size='1rem' />}
                fullWidth
                onClick={
                  activity &&
                  (() => {
                    const editUrl =
                      `${import.meta.env.VITE_API_BIOCOLLECT}` +
                      `/pwa/bioActivity/edit/${activity.projectActivityId}` +
                      `?activityId=${activity.activityId}`;
                    frame.open(editUrl, `Edit Record - ${activity.name ?? activity.activityId}`);
                  })
                }
              >
                Edit
              </Button>
            </Skeleton>
          )}
          {onLine && (activity?.showCrud || activity?.userCanModerate) && (
            <Skeleton visible={loading} w={100}>
              <Button
                loading={deleting}
                data-testid='delete-published-record'
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
          )}
        </>
      }
      {...rest}
    >
      <Skeleton visible={loading}>
        <Flex>
          <Text>
            {activity?.embargoed && (
              <Tooltip
                withArrow
                label={(
                  <Stack gap={0} py={4}>
                    <Text size='sm' fw='bold'>Embargoed</Text>
                    <Text size='xs' maw={200}>Only members with appropriate permissions can access this record</Text>
                  </Stack>
                )}
              >
                <ThemeIcon mr='xs' size='sm' variant='light'>
                  <IconLock size='0.8rem' />
                </ThemeIcon>
              </Tooltip>
            )}
            {activity?.name || 'Long Activity Name Here'}</Text>
        </Flex>
      </Skeleton>
      <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Skeleton circle visible={loading} mr='xs' width={26} height={26} miw={26} mih={26}>
          <Avatar size='sm' radius='lg'>
            {activity?.activityOwnerName ? getInitials(activity.activityOwnerName) : <IconUser />}
          </Avatar>
        </Skeleton>
        <Skeleton visible={loading} style={{ flexGrow: 1 }}>
          <Text size='sm' c='dimmed'>
            {activity?.activityOwnerName || 'Owner Name'}
          </Text>
        </Skeleton>
      </Box>
      <Stack gap={4} mt='xs'>
        <Skeleton visible={loading} style={{ flexGrow: 1 }}>
          <Text size='sm' c='dimmed'>
            Created: <b>{new Date(activity?.lastUpdated || '').toLocaleString('en-GB')}</b>
          </Text>
        </Skeleton>
        <Skeleton visible={loading} style={{ flexGrow: 1 }}>
          <Text size='sm' c='dimmed'>
            Last updated: <b>{new Date(activity?.lastUpdated || '').toLocaleString('en-GB')}</b>
          </Text>
        </Skeleton>
      </Stack>
    </RecordCard>
  );
}
