import { useContext } from 'react';
import {
  ActionIcon,
  Group,
  GroupProps,
  Skeleton,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { IconEye, IconPlus } from '@tabler/icons-react';
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
    <Group spacing={8} {...rest}>
      <Skeleton visible={loading} w={44} mr={4}>
        <Text size="xs" color="dimmed">
          Records
        </Text>
      </Skeleton>
      <Skeleton visible={loading} w={28}>
        <ActionIcon
          variant="light"
          color={theme.primaryColor}
          onClick={
            survey &&
            (() => {
              drawer.open(
                'project',
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
      </Skeleton>
      <Skeleton visible={loading} w={28}>
        <ActionIcon
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
      </Skeleton>
    </Group>
  );
}
