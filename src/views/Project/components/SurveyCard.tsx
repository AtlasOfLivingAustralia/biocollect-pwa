import {
  Badge,
  Box,
  Button,
  Card,
  Chip,
  Group,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconCalendar, IconDownload } from '@tabler/icons';
import { SurveyActions } from 'components';
import { BioCollectSurvey } from 'types';

interface SurveyCardProps {
  survey: BioCollectSurvey;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  const theme = useMantineTheme();
  const checked = false;

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
        <Chip
          checked={checked}
          styles={{
            label: {
              padding: '0.8rem',
              '& .mantine-Text-root': {
                marginLeft: 2,
              },
            },
          }}
          onClick={() =>
            window.open(
              `${import.meta.env.VITE_API_BIOCOLLECT}/pwa?projectActivityId=${
                survey.projectActivityId
              }`
            )
          }
        >
          {!checked && (
            <IconDownload size="0.8rem" style={{ marginRight: 8 }} />
          )}
          <Text ml="xs" color="dimmed" weight="bold" size="xs">
            {checked ? 'Downloaded' : 'Download'}
          </Text>
        </Chip>
        <SurveyActions survey={survey} />
      </Group>
    </Card>
  );
}
