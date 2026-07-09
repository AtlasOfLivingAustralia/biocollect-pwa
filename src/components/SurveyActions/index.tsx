import { ActionIcon, Button, Flex, type FlexProps, Skeleton, Text, Tooltip } from '@mantine/core';
import { IconEye, IconPlus, IconUser } from '@tabler/icons-react';
import { useContext } from 'react';
import { RecordsDrawerContext } from '#/helpers/drawer';
import { FrameContext } from '#/helpers/frame';
// Helpers
import type { BioCollectSurvey } from '#/types';

interface SurveyActionsProps extends FlexProps {
  survey?: BioCollectSurvey;
  onLine?: boolean;
  downloaded?: boolean;
}

export function SurveyActions({ survey, onLine, downloaded, ...rest }: SurveyActionsProps) {
  const drawer = useContext(RecordsDrawerContext);
  const frame = useContext(FrameContext);

  return (
    <Flex gap={4} align='center' {...rest}>
      <Skeleton w={115} visible={!survey}>
        <Button
          id={survey && `${survey.projectActivityId}ViewRecord`}
          variant='subtle'
          px='sm'
          leftSection={<IconEye size='1rem' />}
          size='xs'
          fullWidth
          onClick={
            survey &&
            (() => {
              drawer.open(
                survey,
              );
            })
          }>
          View records
        </Button>
      </Skeleton>
      <Skeleton w={115} visible={!survey}>
        <Button
          id={survey && `${survey.projectActivityId}AddRecord`}
          variant='subtle'
          disabled={!onLine && !downloaded}
          leftSection={<IconPlus size='1rem' />}
          size='xs'
          fullWidth
          onClick={
            survey &&
            (() => {
              frame.open(
                `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/bioActivity/edit/${survey.projectActivityId
                }?unpublished=true`,
                `Add Record - ${survey.name}`,
                {
                  close: () => {
                    drawer.open(
                      survey,
                      true
                    )
                  }
                },
              );
            })
          }
        >
          Add record
        </Button>
      </Skeleton>
    </Flex>
  );
}
