import { Button, Card, Title, useMantineTheme } from '@mantine/core';
import { RecordsDrawerContext } from 'helpers/drawer';
import { useContext } from 'react';
import { BioCollectSurvey } from 'types';

interface SurveyCardProps {
  survey: BioCollectSurvey;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  const theme = useMantineTheme();
  const drawer = useContext(RecordsDrawerContext);
  console.log(survey);
  return (
    <Card
      radius="lg"
      shadow="md"
      withBorder
      bg={theme.colorScheme === 'dark' ? theme.colors.dark[5] : 'white'}
    >
      <Title order={5}>{survey.name}</Title>
      <Button onClick={() => drawer.open('allrecords')}>Testin</Button>
    </Card>
  );
}
