import { Card, Text } from '@mantine/core';
import { BioCollectSurvey } from 'types';

interface SurveyCardProps {
  survey: BioCollectSurvey;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  return (
    <Card>
      <Text>{survey.name}</Text>
    </Card>
  );
}
