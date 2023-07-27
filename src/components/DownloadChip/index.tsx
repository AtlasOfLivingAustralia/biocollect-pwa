import { useContext } from 'react';
import { Chip, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons';
import { FrameContext } from 'helpers/frame';
import { APIContext } from 'helpers/api';
import { BioCollectSurvey } from 'types';
import { useLiveQuery } from 'dexie-react-hooks';

interface FrameProps {
  survey: BioCollectSurvey;
  label?: string;
}

export function DownloadChip({ survey, label }: FrameProps) {
  const frame = useContext(FrameContext);
  const api = useContext(APIContext);

  const downloaded = useLiveQuery(async () =>
    Boolean(await api.db.cached.get(survey.id))
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
        if (!downloaded) {
          frame.open(`http://localhost:5173`, `Downloading - ${survey?.name}`, {
            confirm: async () => {
              if (survey) {
                const out = await api.db.cached.put({
                  surveyId: survey.id,
                  projectId: survey.projectId,
                });
              }

              frame.close();
            },
          });
        }
      }}
    >
      {!downloaded && <IconDownload size="0.8rem" style={{ marginRight: 8 }} />}
      <Text ml="xs" color="dimmed" weight="bold" size="xs">
        {label || (downloaded ? 'Downloaded' : 'Download')}
      </Text>
    </Chip>
  );
}
