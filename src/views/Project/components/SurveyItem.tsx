import { Card, Text, Title, useMantineTheme } from '@mantine/core';
import { BioCollectSurvey } from 'types';

interface SurveyItemProps {
  survey: BioCollectSurvey;
}

export function SurveyItem({ survey }: SurveyItemProps) {
  const theme = useMantineTheme();
  return (
    <Card
      shadow="md"
      withBorder
      bg={theme.colorScheme === 'dark' ? theme.colors.dark[5] : 'white'}
      miw={325}
      maw={325}
    >
      <Title order={5}>{survey.name}</Title>
    </Card>
  );
}
