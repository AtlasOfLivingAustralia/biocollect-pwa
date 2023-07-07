import { Button, Card, Title, useMantineTheme } from '@mantine/core';
import { BioCollectSurvey } from 'types';

interface SurveyCardProps {
  survey: BioCollectSurvey;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  const theme = useMantineTheme();
  console.log(survey);
  return (
    <Card
      radius="lg"
      shadow="md"
      withBorder
      bg={theme.colorScheme === 'dark' ? theme.colors.dark[5] : 'white'}
      miw={325}
      maw={325}
    >
      <Title order={5}>{survey.name}</Title>
      <Button>Testin</Button>
    </Card>
  );
}
