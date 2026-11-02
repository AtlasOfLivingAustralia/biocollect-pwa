import { Button, type ButtonProps, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCheck, IconDownload, IconPlugOff, IconRefresh } from '@tabler/icons-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useContext } from 'react';
import { FrameContext } from '#/helpers/frame';

// Helpers
import type { BioCollectSurvey } from '#/types';
import { dexie } from '#/helpers/api/dexie';

interface DownloadChipProps extends Omit<ButtonProps, 'children'> {
  survey?: BioCollectSurvey;
  onLine?: boolean;
  downloaded?: boolean;
}

export function DownloadChip({ survey, onLine, downloaded, ...rest }: DownloadChipProps) {
  const frame = useContext(FrameContext);
  const entry = useLiveQuery(
    async () => (survey ? await dexie.cached.get(survey.id) : undefined),
    [survey?.id],
  );

  // Only a newer survey counts, as the lists it comes from can lag behind the server
  const outdated = Boolean(
    entry?.lastUpdated &&
    survey?.lastUpdated &&
    Date.parse(survey.lastUpdated) > Date.parse(entry.lastUpdated),
  );

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
              lastUpdated: survey.lastUpdated,
            });
          }

          frame.close();
        },
      },
    );

  // Handler for the chip callback
  const handleChipClick = () => {
    if (!survey) return;
    if (downloaded && !outdated) {
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
        onConfirm: handleDownload,
      });
    } else {
      handleDownload();
    }
  };

  let Icon = IconDownload;
  let label = 'Download';
  if (outdated) {
    Icon = IconRefresh;
    label = 'Update';
  } else if (downloaded) {
    Icon = IconCheck;
    label = 'Downloaded';
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
      {label}
    </Button>
  );
}
