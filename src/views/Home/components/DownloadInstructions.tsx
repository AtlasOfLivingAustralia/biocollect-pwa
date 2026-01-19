import { Text, Group, ActionIcon, Transition, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { IconDownload, IconX } from '@tabler/icons-react';

export function DownloadInstructions() {
  const [opened, { close }] = useDisclosure(
    !sessionStorage.getItem('download-dismissed')
  );

  return (
    <Transition mounted={opened} transition="scale-y">
      {(styles) => (
        <Group style={styles} justify="center" gap={8} mb={36}>
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
          <Text size="sm" c="dimmed">
            To save surveys, click the
          </Text>
          <Button size='xs' variant='light' leftSection={<IconDownload size="1rem" />}>
            Download
          </Button>
          <Text size="sm" c="dimmed">
            button, then click <b>Confirm Download</b>
          </Text>
        </Group>
      )}
    </Transition>
  );
}
