import { Avatar, Box, Button, Center, Divider, Flex, Group, Image, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { IconEye, IconPencil, IconPhoto, IconTrash, IconUser } from '@tabler/icons-react';
import { useCallback, useContext, useState } from 'react';
import { FrameContext } from '#/helpers/frame';
import { getInitials, useOnLine } from '#/helpers/funcs';
import { biocollect } from '#/helpers/api';

// Helpers
import type { BioCollectBioActivity } from '#/types';

// Local components
const IMAGE_SIZE = 100;

function ActivityImage({ activity }: { activity?: BioCollectBioActivity }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  if ((activity && !activity.thumbnailUrl) || error) {
    return (
      <Box
        style={{ borderRadius: 'var(--mantine-radius-lg)' }}
        miw={IMAGE_SIZE}
        mih={IMAGE_SIZE}
        w={IMAGE_SIZE}
        h={IMAGE_SIZE}
        bg="light-dark(var(--mantine-color-gray-2),var(--mantine-color-dark-4))"
      >
        <Center h="100%">
          <IconPhoto size="1.5rem" />
        </Center>
      </Box>
    )
  }

  return (
    <Skeleton visible={loading && !error} w={IMAGE_SIZE} h={IMAGE_SIZE}>
      <Image
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        src={activity?.thumbnailUrl}
        radius='lg'
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
        }}
      />
    </Skeleton>
  );
}

interface ActivityItemProps {
  activity?: BioCollectBioActivity;
  onDelete?: () => void;
}

export function ActivityItem({ activity, onDelete }: ActivityItemProps) {
  const [deleting, setDeleting] = useState<boolean>(false);
  const frame = useContext(FrameContext);
  const loading = !activity;
  const onLine = useOnLine();

  const handleDelete = useCallback(async () => {
    if (activity && !deleting) {
      try {
        setDeleting(true);
        await biocollect.deleteActivity(activity.activityId);

        if (onDelete) {
          onDelete();
        }
      } catch (error) {
        console.error('Failed to delete activity!', error);
        setDeleting(false);
      }
    }
  }, [deleting, activity]);

  return (
    <Paper p='sm' pr='lg' withBorder>
      <Stack>
        <Flex justify='space-between'>
          <Stack gap={4}>
            <Skeleton visible={loading}>
              <Text>{activity?.name || 'Long Activity Name Here'}</Text>
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
          </Stack>
          <ActivityImage activity={activity} />
        </Flex>
        <Divider />
        <Group gap='xs'>
          {onLine && (
            <Skeleton visible={loading} w={90}>
              <Button
                disabled={deleting}
                data-testid='view-record'
                variant='light'
                size='sm'
                leftSection={<IconEye size='1rem' />}
                fullWidth
                onClick={
                  activity &&
                  (() => {
                    // drawer.close();
                    frame.open(
                      `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/bioActivity/index/${activity.projectActivityId
                      }?projectId=${activity.projectId}&activityId=${activity.activityId}`,
                      `View Record - ${activity.name}`,
                    );
                  })}
              >
                View
              </Button>
            </Skeleton>
          )}
          {onLine && (activity?.showCrud || activity?.userCanModerate) && (
            <Skeleton visible={loading} w={90}>
              <Button
                disabled={deleting}
                data-testid='edit-record'
                variant='light'
                size='sm'
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
                  })}
              >
                Edit
              </Button>
            </Skeleton>
          )}
          {onLine && (activity?.showCrud || activity?.userCanModerate) && (
            <Skeleton visible={loading} w={100}>
              <Button
                loading={deleting}
                data-testid='delete-record'
                color='red'
                variant='light'
                size='sm'
                leftSection={<IconTrash size='1rem' />}
                fullWidth
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Skeleton>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
