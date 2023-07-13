import {
  Badge,
  Box,
  Card,
  Group,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconCalendar } from '@tabler/icons';
import { DownloadChip, SurveyActions } from 'components';
import { BioCollectSurvey } from 'types';

interface SurveyCardProps {
  survey: BioCollectSurvey;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  const theme = useMantineTheme();

  return (
    <Card
      radius="lg"
      shadow="md"
      withBorder
      bg={theme.colorScheme === 'dark' ? theme.colors.dark[5] : 'white'}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Title order={5} mb={2}>
          {survey.name}
        </Title>
        <Badge miw={70} color="dark">
          {survey.status}
        </Badge>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <IconCalendar size="1rem" />
        <Text size="sm" ml="xs" color="dimmed">
          Started {new Date(survey.startDate).toLocaleDateString()}
        </Text>
      </Box>
      <Group mt="md" position="apart">
        <DownloadChip projectActivityId={survey.projectActivityId} />
        <SurveyActions survey={survey} />
      </Group>
    </Card>
  );
}
