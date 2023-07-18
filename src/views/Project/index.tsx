import { useLoaderData } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { BioCollectProject, BioCollectSurvey } from 'types';
import { useMediaQuery } from '@mantine/hooks';

// import { Frame } from 'components';
import { Header } from './components/Header';
import { Wave } from 'components/Wave';
import { SurveyCard } from './components/SurveyCard';
import {
  IconClipboardList,
  IconFlask2,
  IconInfoCircle,
  IconSocial,
} from '@tabler/icons';
import { ScienceTypes } from './components/ScienceTypes';
import { SocialLinks } from './components/SocialLinks';

interface ProjectLoaderData {
  project: BioCollectProject;
  surveys: BioCollectSurvey[];
}

export function Project() {
  const { project, surveys } = useLoaderData() as ProjectLoaderData;

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const highlight =
    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2];

  console.log(project, surveys);

  return (
    <>
      <Header project={project} mobile={mobile} />
      <Wave
        style={{ marginTop: theme.spacing.sm, marginBottom: -30 }}
        preserveAspectRatio="none"
        waveColour={highlight}
        waveType={mobile ? 'body' : 'bodyFull'}
        height={75}
        width="100%"
      />
      <Box py="xl" px={36} bg={highlight}>
        <Group align="center" mb="lg" mt={-20}>
          <IconClipboardList />
          <Title order={2}>Surveys</Title>
        </Group>
        <Grid gutter="xl">
          {surveys.length > 0 ? (
            surveys.map((survey) => (
              <Grid.Col key={survey.id} xs={12} sm={12} md={6} lg={4} xl={4}>
                <SurveyCard survey={survey} />
              </Grid.Col>
            ))
          ) : (
            <Grid.Col span={12}>
              <Text>No surveys</Text>
            </Grid.Col>
          )}
        </Grid>
      </Box>
      <Wave
        preserveAspectRatio="none"
        waveColour={highlight}
        waveType={mobile ? 'bodyBottom' : 'bodyBottomFull'}
        height={75}
        width="100%"
      />
      <Box pb="xl" px={36}>
        <Grid gutter="xl" pb="xl">
          {project.description && (
            <Grid.Col xs={12} sm={12} md={6} lg={6} xl={4}>
              <Group align="center" mb="lg">
                <IconInfoCircle />
                <Title order={4}>Description</Title>
              </Group>
              <ScrollArea.Autosize type="always" offsetScrollbars mah={175}>
                <Text size="sm">{project.description}</Text>
              </ScrollArea.Autosize>
            </Grid.Col>
          )}
          {project.scienceType.length > 0 && (
            <Grid.Col xs={12} sm={6} md={6} lg={6} xl={4}>
              <Group align="center" mb="lg">
                <IconFlask2 />
                <Title order={4}>Science Type</Title>
              </Group>
              <ScienceTypes types={project.scienceType} />
            </Grid.Col>
          )}
          {project.links.length > 0 && (
            <Grid.Col xs={12} sm={6} md={6} lg={6} xl={4}>
              <Group align="center" mb="lg">
                <IconSocial />
                <Title order={4}>Science Type</Title>
              </Group>
              <SocialLinks links={project.links} />
            </Grid.Col>
          )}
        </Grid>
      </Box>
    </>
  );
}
