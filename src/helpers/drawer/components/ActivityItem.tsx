import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { IconEye } from '@tabler/icons';
import { BioCollectBioActivity } from 'types';

interface ActivityItemProps {
  activity?: BioCollectBioActivity;
}

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
              JB
            </Avatar>
          </Skeleton>
          <Skeleton visible={loading} style={{ flexGrow: 1 }}>
            <Text size="sm" color="dimmed">
              {activity?.activityOwnerName || 'Owner Name'}
            </Text>
          </Skeleton>
        </Box>
      </Stack>
      <ActionIcon variant="light" color="gray">
        <IconEye size="1rem" />
      </ActionIcon>
    </Group>
  );
}
