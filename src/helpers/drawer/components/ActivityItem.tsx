import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { IconEdit, IconEye, IconUser } from '@tabler/icons';
import { BioCollectBioActivity } from 'types';

interface ActivityItemProps {
  activity?: BioCollectBioActivity;
}

const getInitials = (name: string) => {
  return name
    .toUpperCase()
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('');
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const loading = !activity;

  return (
    <Group position="apart">
      <Stack spacing={4}>
        <Skeleton visible={loading}>
          <Text>{activity?.name || 'Long Activity Name Here'}</Text>
        </Skeleton>
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Skeleton
            circle
            visible={loading}
            mr="xs"
            width={26}
            height={26}
            miw={26}
            mih={26}
          >
            <Avatar size="sm" radius="lg">
              {activity?.activityOwnerName ? (
                getInitials(activity.activityOwnerName)
              ) : (
                <IconUser />
              )}
            </Avatar>
          </Skeleton>
          <Skeleton visible={loading} style={{ flexGrow: 1 }}>
            <Text size="sm" color="dimmed">
              {activity?.activityOwnerName || 'Owner Name'}
            </Text>
          </Skeleton>
        </Box>
      </Stack>
      <Group spacing="xs">
        {(loading || activity?.showCrud) && (
          <Skeleton visible={loading} width={28} miw={28}>
            <ActionIcon
              variant="light"
              color="gray"
              component="a"
              href={`${
                import.meta.env.VITE_API_BIOCOLLECT
              }/bioActivity/mobileEdit/${activity?.activityId}?mobile=true`}
            >
              <IconEdit size="1rem" />
            </ActionIcon>
          </Skeleton>
        )}
        <Skeleton visible={loading} width={28} miw={28}>
          <ActionIcon
            variant="light"
            color="gray"
            component="a"
            href={`${import.meta.env.VITE_API_BIOCOLLECT}/bioActivity/index/${
              activity?.activityId
            }?mobile=true`}
          >
            <IconEye size="1rem" />
          </ActionIcon>
        </Skeleton>
      </Group>
    </Group>
  );
}
