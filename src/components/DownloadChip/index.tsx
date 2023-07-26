import { useContext } from 'react';
import { Chip, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons';
import { FrameContext } from 'helpers/frame';
import { APIContext } from 'helpers/api';
import { BioCollectPWASurvey } from 'types';
import { useLiveQuery } from 'dexie-react-hooks';

interface FrameProps {
  survey: BioCollectPWASurvey;
  label?: string;
}

export function DownloadChip({ survey, label }: FrameProps) {
  const frame = useContext(FrameContext);
  const api = useContext(APIContext);

  const downloaded = useLiveQuery(async () =>
    Boolean((await api.db.surveys.get(survey.id))?.pwaDownloaded)
  );

  return (
    <Chip
      checked={downloaded}
      styles={{
        label: {
          padding: '0.8rem',
          '& .mantine-Text-root': {
            marginLeft: 2,
          },
        },
      }}
      onClick={() => {
        // frame.open(
        //   `${import.meta.env.VITE_API_BIOCOLLECT}/pwa?projectActivityId=${
        //     survey?.projectActivityId
        //   }`,
        //   `Downloading - ${survey?.name}`
        // )
        frame.open(`http://localhost:5173`, `Downloading - ${survey?.name}`, {
          confirm: async () => {
            if (survey) {
              await api.db.surveys.update(survey.id, { pwaDownloaded: 1 });
              console.log(survey.id, 'Surveys updated');
            }

            frame.close();
          },
        });
      }}
    >
      {!downloaded && <IconDownload size="0.8rem" style={{ marginRight: 8 }} />}
      <Text ml="xs" color="dimmed" weight="bold" size="xs">
        {label || (downloaded ? 'Downloaded' : 'Download')}
      </Text>
    </Chip>
  );
}
