import {
  Box,
  BoxProps,
  Chip,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';

import { IconDownload } from '@tabler/icons-react';

interface DownloadInstructionsProps extends BoxProps {}

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
        <Group spacing={8}>
          <Text size="sm">To save surveys, press the</Text>
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
          <Text size="sm">
            button. Once the survey has finished downloading, press{' '}
            <b>Confirm Download</b>.
          </Text>
        </Group>
      </Stack>
    </Box>
  );
}
