import {
  Box,
  type BoxProps,
  Button,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';

import { IconDownload } from '@tabler/icons-react';

interface DownloadInstructionsProps extends BoxProps { }

export function DownloadInstructions({ ...props }: DownloadInstructionsProps) {
  return (
    <Box {...props}>
      <Stack>
        <Group>
          <ThemeIcon variant="light" size="lg" radius="lg">
            <IconDownload size="1rem" />
          </ThemeIcon>
          <Title order={4}>How to download</Title>
        </Group>
        <Group gap={8}>
          <Text size="sm">To save surveys, press the</Text>
          <Button size='xs' variant='light' leftSection={<IconDownload size="1rem" />}>
            Download
          </Button>
          <Text size="sm">
            button. Once the survey has finished downloading, press{' '}
            <b>Confirm Download</b>.
          </Text>
        </Group>
      </Stack>
    </Box>
  );
}
