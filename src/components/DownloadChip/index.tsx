import { useContext } from 'react';
import { Chip, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons';
import { FrameContext } from 'helpers/frame';
import { BioCollectSurvey } from 'types';

interface FrameProps {
  survey?: BioCollectSurvey;
  label?: string;
  downloaded?: boolean;
}

export function DownloadChip({ survey, label, downloaded }: FrameProps) {
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
          `${import.meta.env.VITE_API_BIOCOLLECT}/pwa?projectActivityId=${
            survey?.projectActivityId
          }`,
          `Downloading - ${survey?.name}`
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
