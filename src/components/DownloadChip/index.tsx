import { Button, type ButtonProps, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCheck, IconDownload, IconPlugOff } from '@tabler/icons-react';
import { useContext } from 'react';
import { FrameContext } from '#/helpers/frame';

// Helpers
import type { BioCollectSurvey } from '#/types';
import { dexie } from '#/helpers/api/dexie';

interface DownloadChipProps extends Omit<ButtonProps, 'children'> {
  survey?: BioCollectSurvey;
  label?: string;
  onLine?: boolean;
  downloaded?: boolean;
}

export function DownloadChip({ survey, label, onLine, downloaded, ...rest }: DownloadChipProps) {
  const frame = useContext(FrameContext);

  // Handler for the download popup
  const handleDownload = () =>
    frame.open(
      `${import.meta.env.VITE_API_BIOCOLLECT}/pwa?projectActivityId=${survey?.projectActivityId}`,
      `Downloading - ${survey?.name}`,
      {
        confirm: async () => {
          if (survey) {
            await dexie.cached.put({
              surveyId: survey.id,
              projectId: survey.projectId,
            });
          }

          frame.close();
        },
      },
    );

  // Handler for the chip callback
  const handleChipClick = () => {
    if (!survey) return;
    if (downloaded) {
      modals.openConfirmModal({
        title: (
          <Text size='lg' ff='heading'>
            Confirm Re-Download
          </Text>
        ),
        centered: true,
        children: (
          <Text>
            You have already downloaded <b>{survey.name}</b>. Click <b>Confirm</b> to redownload.
          </Text>
        ),
        labels: {
          confirm: 'Confirm',
          cancel: 'Cancel',
        },
        confirmProps: {
          'data-testid': 'redownload-confirm',
        },
        onConfirm: async () => {
          await dexie.cached.delete(survey.id);
          handleDownload();
        },
      });
    } else {
      handleDownload();
    }
  };

  let Icon = IconDownload;
  if (downloaded) {
    Icon = IconCheck;
  } else if (!onLine) {
    Icon = IconPlugOff;
  }

  return (
    <Button
      id={`${survey?.projectActivityId}Download`}
      size='xs'
      variant='light'
      disabled={!onLine}
      onClick={handleChipClick}
      leftSection={<Icon size="1rem" />}
      maw={250}
      {...rest}
    >
      {label || (downloaded ? 'Downloaded' : 'Download')}
    </Button>
  );
}
