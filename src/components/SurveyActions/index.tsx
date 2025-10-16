import { useContext } from 'react';
import {
  ActionIcon,
  Group,
  GroupProps,
  Skeleton,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { IconEye, IconPlus, IconUser, IconListDetails } from '@tabler/icons-react';
import { BioCollectSurvey } from 'types';

import { RecordsDrawerContext } from 'helpers/drawer';
import { FrameContext } from 'helpers/frame';

interface SurveyActionsProps extends GroupProps {
  survey?: BioCollectSurvey;
}

export function SurveyActions({ survey, ...rest }: SurveyActionsProps) {
  const drawer = useContext(RecordsDrawerContext);
  const frame = useContext(FrameContext);
  const theme = useMantineTheme();

  const loading = !survey;

  return (
    <Group spacing={6} align="center" noWrap {...rest}>
      <Text size="xs" c="dimmed">Records</Text>
      <Skeleton visible={loading} w={28}>
        <Tooltip label="All records" withArrow disabled={loading} position='left'>
          <ActionIcon
            id={survey && survey.projectActivityId + "ViewRecord"}
            variant="light"
            color={theme.primaryColor}
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
          color={theme.primaryColor}
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
            color={theme.primaryColor}
            onClick={
              survey &&
              (() => {
                frame.open(
                  `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/bioActivity/edit/${
                    survey.projectActivityId
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
    </Group>
  );
}
