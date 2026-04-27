import { Badge, Box, Card, Group, Text, Title } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { useLiveQuery } from 'dexie-react-hooks';

import { DownloadChip, SurveyActions } from '#/components';
import { dexie } from '#/helpers/api/dexie';
import { useOnLine } from '#/helpers/funcs';
import type { BioCollectSurvey } from '#/types';

interface SurveyCardProps {
  survey: BioCollectSurvey;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  const onLine = useOnLine();
  const downloaded = Boolean(useLiveQuery(async () => await dexie.cached.get(survey?.id || '')));

  return (
    <Card radius='xl' shadow='md' bg='light-dark(white, var(--mantine-color-dark-6)'>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Title order={5} mb={2} lineClamp={1}>
          {survey.name}
        </Title>
        {survey.status && (
          <Badge miw={70} color='gray'>
            {survey.status}
          </Badge>
        )}
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <IconCalendar size='1rem' />
        <Text size='sm' ml='xs' c='dimmed'>
          Started {new Date(survey.startDate).toLocaleDateString()}
        </Text>
      </Box>
      <Group mt='md' justify='space-between'>
        <DownloadChip survey={survey} onLine={onLine} downloaded={downloaded} />
        <SurveyActions survey={survey} onLine={onLine} downloaded={downloaded} />
      </Group>
    </Card>
  );
}
