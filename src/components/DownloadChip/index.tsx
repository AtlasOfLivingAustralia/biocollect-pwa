import { useContext } from 'react';
import { Chip, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons';
import { FrameContext } from 'helpers/frame';

interface FrameProps {
  projectActivityId: string;
  label?: string;
  downloaded?: boolean;
}

export function DownloadChip({
  projectActivityId,
  label,
  downloaded,
}: FrameProps) {
  const frame = useContext(FrameContext);

  return (
    <Chip
      checked={Boolean(downloaded)}
      styles={{
        label: {
          padding: '0.8rem',
          '& .mantine-Text-root': {
            marginLeft: 2,
          },
        },
      }}
      onClick={() =>
        frame.open(
          `${
            import.meta.env.VITE_API_BIOCOLLECT
          }/pwa?projectActivityId=${projectActivityId}`
        )
      }
    >
      {!downloaded && <IconDownload size="0.8rem" style={{ marginRight: 8 }} />}
      <Text ml="xs" color="dimmed" weight="bold" size="xs">
        {label || (downloaded ? 'Downloaded' : 'Download')}
      </Text>
    </Chip>
  );
}
