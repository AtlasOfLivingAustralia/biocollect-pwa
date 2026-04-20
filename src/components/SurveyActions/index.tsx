import { ActionIcon, Flex, type FlexProps, Skeleton, Text, Tooltip } from '@mantine/core';
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
    <Flex gap={6} align='center' {...rest}>
      <Text size='xs' c='dimmed'>
        Records
      </Text>
      <Skeleton visible={!survey} w={28}>
        <Tooltip label='All records' withArrow disabled={!survey} position='left'>
          <ActionIcon
            id={survey && `${survey.projectActivityId}ViewRecord`}
            variant='light'
            onClick={
              survey &&
              (() => {
                drawer.open(
                  'projectactivityrecords',
                  {
                    projectId: survey.projectId,
                    projectActivityId: survey.projectActivityId,
                  },
                  `${survey.name} Survey`,
                );
              })
            }
          >
            <IconEye size='1rem' />
          </ActionIcon>
        </Tooltip>
      </Skeleton>
      <Skeleton visible={!survey} w={28}>
        <Tooltip label='My records' withArrow disabled={!survey} position='left'>
          <ActionIcon
            id={survey && `${survey.projectActivityId}MyRecords`}
            variant='light'
            onClick={
              survey &&
              (() => {
                drawer.open(
                  'myrecords',
                  {
                    projectActivityId: survey.projectActivityId,
                    fq: [
                      `projectId:${survey.projectId}`,
                      `projectActivityNameFacet:${survey.name}`,
                    ],
                  },
                  `${survey.name} My Records`,
                );
              })
            }
          >
            <IconUser size='1rem' />
          </ActionIcon>
        </Tooltip>
      </Skeleton>
      <Skeleton visible={!survey} w={28}>
        <Tooltip label='Add a record' withArrow disabled={!survey} position='left'>
          <ActionIcon
            id={survey && `${survey.projectActivityId}AddRecord`}
            variant='light'
            disabled={!onLine && !downloaded}
            onClick={
              survey &&
              (() => {
                frame.open(
                  `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/bioActivity/edit/${
                    survey.projectActivityId
                  }?unpublished=true`,
                  `Add Record - ${survey.name}`,
                  {
                    close: () =>
                      drawer.open('myrecords', {
                        projectActivityId: survey.projectActivityId,
                        fq: [
                          `projectId:${survey.projectId}`,
                          `projectActivityNameFacet:${survey.name}`,
                        ],
                      }),
                  },
                );
              })
            }
          >
            <IconPlus size='1rem' />
          </ActionIcon>
        </Tooltip>
      </Skeleton>
    </Flex>
  );
}
