import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { IconCalendar, IconEye, IconPlus } from '@tabler/icons';
import { RecordsDrawerContext } from 'helpers/drawer';
import { useContext } from 'react';
import { BioCollectSurvey } from 'types';

interface SurveyCardProps {
  survey: BioCollectSurvey;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  const theme = useMantineTheme();
  const drawer = useContext(RecordsDrawerContext);

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
        <Badge miw={70}>{survey.status}</Badge>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <IconCalendar size="1rem" />
        <Text size="sm" ml="xs" color="dimmed">
          Started {new Date(survey.startDate).toLocaleDateString()}
        </Text>
      </Box>
      <Group mt="md" position="apart">
        <Button
          variant="light"
          size="xs"
          onClick={() =>
            drawer.open(
              'project',
              {
                projectId: survey.projectId,
                fq: `projectActivityNameFacet:${survey.name}`,
              },
              `${survey.name} Survey`
            )
          }
          leftIcon={<IconEye size="0.8rem" />}
        >
          View Records
        </Button>
        <UnstyledButton
          sx={{
            ':hover': {
              opacity: 0.6,
            },
          }}
          component="a"
          href={`${import.meta.env.VITE_API_BIOCOLLECT}/bioActivity/create/${
            survey?.projectActivityId
          }`}
        >
          <Group spacing="xs">
            <ThemeIcon variant="light" color="blue">
              <IconPlus size="1rem" />
            </ThemeIcon>
            <Text size="xs" color="dimmed">
              Record
            </Text>
          </Group>
        </UnstyledButton>
      </Group>
    </Card>
  );
}
