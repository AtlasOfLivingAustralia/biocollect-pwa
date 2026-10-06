import { Button, Flex, type FlexProps, Skeleton } from '@mantine/core';
import { IconEye, IconPlus } from '@tabler/icons-react';
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
    <Flex gap='md' align='center' {...rest}>
      <Skeleton visible={!survey}>
        <Button.Group>
          <Button
            id={survey && `${survey.projectActivityId}ViewRecord`}
            variant='default'
            leftSection={<IconEye size='1rem' />}
            size='xs'
            onClick={
              survey &&
              (() => {
                drawer.open(
                  survey,
                );
              })
            }>
            View
          </Button>
          <Button
            id={survey && `${survey.projectActivityId}AddRecord`}
            variant='default'
            disabled={!onLine && !downloaded}
            leftSection={<IconPlus size='1rem' />}
            size='xs'
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
            Add
          </Button>
        </Button.Group>
      </Skeleton>
    </Flex>
  );
}
