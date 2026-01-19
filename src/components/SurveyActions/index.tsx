import { useContext } from 'react';
import {
  ActionIcon,
  Flex,
  type FlexProps,
  Skeleton,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconEye, IconPlus, IconUser } from '@tabler/icons-react';

// Helpers
import type { BioCollectSurvey } from '#/types';
import { RecordsDrawerContext } from '#/helpers/drawer';
import { FrameContext } from '#/helpers/frame';

interface SurveyActionsProps extends FlexProps {
  survey?: BioCollectSurvey;
}

export function SurveyActions({ survey, ...rest }: SurveyActionsProps) {
  const drawer = useContext(RecordsDrawerContext);
  const frame = useContext(FrameContext);

  const loading = !survey;

  return (
    <Flex gap={6} align="center" {...rest}>
      <Text size="xs" c="dimmed">Records</Text>
      <Skeleton visible={loading} w={28}>
        <Tooltip label="All records" withArrow disabled={loading} position='left'>
          <ActionIcon
            id={survey && survey.projectActivityId + "ViewRecord"}
            variant="light"
            onClick={
              survey &&
              (() => {
                drawer.open(
                  "projectactivityrecords",
                  {
                    projectId: survey.projectId,
                    projectActivityId: survey.projectActivityId,
                  },
                  `${survey.name} Survey`
                );
              })
            }
          >
            <IconEye size="1rem" />
          </ActionIcon>
        </Tooltip>
      </Skeleton>
      <Skeleton visible={loading} w={28}>
        <Tooltip label="My records" withArrow disabled={loading} position='left'>
          <ActionIcon
            id={survey && survey.projectActivityId + "MyRecords"}
            variant="light"
            disabled={!survey}
            onClick={
              survey &&
              (() => {
                drawer.open(
                  "myrecords",
                  {
                    fq: [
                      `projectId:${survey.projectId}`,
                      `projectActivityNameFacet:${survey.name}`,
                    ],
                  },
                  `${survey.name} My Records`
                );
              })
            }
          >
            <IconUser size="1rem" />
          </ActionIcon>
        </Tooltip>
      </Skeleton>
      <Skeleton visible={loading} w={28}>
        <Tooltip label="Add a record" withArrow disabled={loading} position='left'>
          <ActionIcon
            id={survey && survey.projectActivityId + "AddRecord"}
            variant="light"
            onClick={
              survey &&
              (() => {
                frame.open(
                  `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/bioActivity/edit/${survey.projectActivityId
                  }`,
                  `Add Record - ${survey.name}`
                );
              })
            }
          >
            <IconPlus size="1rem" />
          </ActionIcon>
        </Tooltip>
      </Skeleton>
    </Flex>
  );
}
