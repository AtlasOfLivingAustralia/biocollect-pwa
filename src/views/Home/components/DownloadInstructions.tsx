import { Text, Group, Chip, ActionIcon, Transition } from '@mantine/core';
import { useDisclosure, useSessionStorage } from '@mantine/hooks';

import { IconDownload, IconX } from '@tabler/icons-react';

export function DownloadInstructions() {
  const [opened, { close }] = useDisclosure(
    !sessionStorage.getItem('download-dismissed')
  );

  return (
    <Transition mounted={opened} transition="scale-y">
      {(styles) => (
        <Group style={styles} position="center" spacing={8} mb={36}>
          <ActionIcon
            variant="default"
            mr="md"
            onClick={() => {
              sessionStorage.setItem('download-dismissed', 'true');
              close();
            }}
          >
            <IconX size="1rem" />
          </ActionIcon>
          <Text size="sm" color="dimmed">
            To save surveys, click the
          </Text>
          <Chip
            size="xs"
            checked={false}
            styles={{
              label: {
                padding: '0.8rem',
                '& .mantine-Text-root': {
                  marginLeft: 2,
                },
              },
            }}
          >
            <IconDownload size="0.8rem" style={{ marginRight: 8 }} />
            <Text ml="xs" color="dimmed" weight="bold" size="xs">
              Download
            </Text>
          </Chip>
          <Text size="sm" color="dimmed">
            button, then click <b>Confirm Download</b>
          </Text>
        </Group>
      )}
    </Transition>
  );
}
