import { ActionIcon, Group, Skeleton, Text } from '@mantine/core';
import { IconEye, IconPlus } from '@tabler/icons';
import { RecordsDrawerContext } from 'helpers/drawer';
import { useContext } from 'react';
import { BioCollectSurvey } from 'types';

interface SurveyActionsProps {
  survey?: BioCollectSurvey;
}

export function SurveyActions({ survey }: SurveyActionsProps) {
  const drawer = useContext(RecordsDrawerContext);
  const loading = !survey;

  return (
    <Group spacing={8}>
      <Skeleton visible={loading} w={44} mr={4}>
        <Text size="xs" color="dimmed">
          Records
        </Text>
      </Skeleton>
      <Skeleton visible={loading} w={28}>
        <ActionIcon
          variant="light"
          color="blue"
          onClick={
            survey &&
            (() => {
              drawer.open(
                'project',
                {
                  projectId: survey.projectId,
                  fq: `projectActivityNameFacet:${survey.name}`,
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
          color="blue"
          component="a"
          href={`${import.meta.env.VITE_API_BIOCOLLECT}/pwa/bioActivity/edit/${
            survey?.projectActivityId
          }`}
        >
          <IconPlus size="1rem" />
        </ActionIcon>
      </Skeleton>
    </Group>
  );
}
