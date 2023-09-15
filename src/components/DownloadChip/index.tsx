import { useContext } from 'react';
import { Chip, Text, useMantineTheme } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { FrameContext } from 'helpers/frame';
import { APIContext } from 'helpers/api';
import { BioCollectSurvey } from 'types';
import { useLiveQuery } from 'dexie-react-hooks';
import { modals } from '@mantine/modals';
import { useMediaQuery } from '@mantine/hooks';

interface FrameProps {
  survey: BioCollectSurvey;
  label?: string;
}

export function DownloadChip({ survey, label }: FrameProps) {
  const frame = useContext(FrameContext);
  const api = useContext(APIContext);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const downloaded = useLiveQuery(async () =>
    Boolean(await api.db.cached.get(survey.id))
  );

  // Handler for the download popup
  const handleDownload = () =>
    frame.open(
      `${import.meta.env.VITE_API_BIOCOLLECT}/pwa?projectActivityId=${
        survey?.projectActivityId
      }`,
      `Downloading - ${survey?.name}`,
      {
        confirm: async () => {
          if (survey) {
            await api.db.cached.put({
              surveyId: survey.id,
              projectId: survey.projectId,
            });
          }

          frame.close();
        },
      }
    );

  // Handler for the chip callback
  const handleChipClick = () => {
    if (downloaded) {
      modals.openConfirmModal({
        title: (
          <Text
            size="lg"
            sx={(theme) => ({ fontFamily: theme.headings.fontFamily })}
          >
            Confirm Re-Download
          </Text>
        ),
        centered: true,
        children: (
          <Text>
            You have already downloaded <b>{survey.name}</b>. Click{' '}
            <b>Confirm</b> to redownload.
          </Text>
        ),
        labels: {
          confirm: 'Confirm',
          cancel: 'Cancel',
        },
        onConfirm: async () => {
          await api.db.cached.delete(survey.id);
          handleDownload();
        },
      });
    } else {
      handleDownload();
    }
  };

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
      onClick={handleChipClick}
    >
      {!downloaded && <IconDownload size="0.8rem" style={{ marginRight: 8 }} />}
      <Text
        ml="xs"
        color="dimmed"
        weight="bold"
        size="xs"
        maw={mobile ? 115 : 200}
        truncate
      >
        {label || (downloaded ? 'Downloaded' : 'Download')}
      </Text>
    </Chip>
  );
}
