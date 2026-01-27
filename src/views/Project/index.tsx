import {
  Accordion,
  Box,
  Button,
  Center,
  Divider,
  Grid,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconArrowBack,
  IconClipboardList,
  IconFlask2,
  IconHeartHandshake,
  IconInfoCircle,
  IconPhone,
} from '@tabler/icons-react';
import { Suspense } from 'react';
import { Await, Link, useAsyncValue, useLoaderData } from 'react-router';

import { Wave } from '#/components/Wave';
import type { BioCollectProject, BioCollectSurvey } from '#/types';
import { DownloadInstructions } from './components/DownloadInstructions';
// Local components
import { Header } from './components/Header';
import { ScienceTypes } from './components/ScienceTypes';
import { SurveyCard } from './components/SurveyCard';

type ProjectLoaderArr = [BioCollectProject, BioCollectSurvey[]];

export function Project() {
  const { data } = useLoaderData<{ data: ProjectLoaderArr }>();
  return (
    <Suspense
      fallback={
        <Center h='calc(100vh - 71px)'>
          <Loader />
        </Center>
      }
    >
      <Await resolve={data}>
        <ProjectBody />
      </Await>
    </Suspense>
  );
}

function ProjectBody() {
  const [project, surveys] = useAsyncValue() as ProjectLoaderArr;
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const highlight = 'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-8))';

  if (!project) {
    return (
      <Center w='100%' h='calc(100vh - 71px)'>
        <Stack align='center'>
          <Title>404</Title>
          <Text>The requested project could not be found</Text>
          <Button mt='lg' leftSection={<IconArrowBack />} component={Link} to='/'>
            Go home
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <Header project={project} mobile={mobile} />
      <Box px={36} pb='sm'>
        <Divider mb='xl' opacity={0.45} />
        <DownloadInstructions />
      </Box>
      <Wave
        style={{ marginTop: 'var(--mantine-spacing-xl)', marginBottom: -30 }}
        preserveAspectRatio='none'
        waveColour={highlight}
        waveType={mobile ? 'body' : 'bodyFull'}
        height={75}
        width='100%'
      />
      <Box py='xl' px={36} bg={highlight}>
        <Group align='center' mb='lg' mt={-20}>
          <ThemeIcon variant='light' size={50} radius={25}>
            <IconClipboardList />
          </ThemeIcon>
          <Title order={2}>Surveys</Title>
        </Group>
        <Grid gutter='xl'>
          {surveys.length > 0 ? (
            surveys.map((survey) => (
              <Grid.Col key={survey.id} span={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
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
        preserveAspectRatio='none'
        waveColour={highlight}
        waveType={mobile ? 'bodyBottom' : 'bodyBottomFull'}
        height={75}
        width='100%'
      />
      <Box py='xl' mb='xl' px={36}>
        <Grid gutter='xl' pb='xl'>
          <Grid.Col span={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 9 }}>
            <Accordion variant='contained'>
              {project.description && (
                <Accordion.Item value='description'>
                  <Accordion.Control>
                    <Group align='center'>
                      <IconInfoCircle />
                      <Title order={4}>Description</Title>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text size='sm'>{project.description}</Text>
                  </Accordion.Panel>
                </Accordion.Item>
              )}
              {project.scienceType.length > 0 && (
                <Accordion.Item value='scienceType'>
                  <Accordion.Control>
                    <Group align='center'>
                      <IconFlask2 />
                      <Title order={4}>Science Type</Title>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <ScienceTypes types={project.scienceType} />
                  </Accordion.Panel>
                </Accordion.Item>
              )}
              {(project.projectEquipment ||
                project.projectTask ||
                project.projectHowToParticipate) && (
                  <Accordion.Item value='getInvolved'>
                    <Accordion.Control>
                      <Group align='center'>
                        <IconHeartHandshake />
                        <Title order={4}>Get Involved</Title>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap='xs'>
                        {project.projectEquipment && (
                          <Stack gap={0}>
                            <Text fw='bold' size='sm'>
                              Equipment
                            </Text>
                            <Text c='dimmed' size='sm'>
                              {project.projectEquipment}
                            </Text>
                          </Stack>
                        )}
                        {project.projectTask && (
                          <Stack gap={0}>
                            <Text fw='bold' size='sm'>
                              Tasks
                            </Text>
                            <Text c='dimmed' size='sm'>
                              {project.projectTask}
                            </Text>
                          </Stack>
                        )}
                        {project.projectHowToParticipate && (
                          <Stack gap={0}>
                            <Text fw='bold' size='sm'>
                              How to Participate
                            </Text>
                            <Text c='dimmed' size='sm'>
                              {project.projectHowToParticipate}
                            </Text>
                          </Stack>
                        )}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                )}
            </Accordion>
          </Grid.Col>
          {(project.contactName || project.contactDetails) && (
            <Grid.Col span={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 3 }}>
              <Paper p='md' withBorder>
                <Group align='center' mb='lg'>
                  <IconPhone />
                  <Title order={4}>Contact</Title>
                </Group>
                <Stack>
                  {project.contactName && (
                    <Stack gap={0}>
                      <Text fw='bold' size='sm'>
                        Contact Name
                      </Text>
                      <Text c='dimmed' size='sm'>
                        {project.contactName}
                      </Text>
                    </Stack>
                  )}
                  {project.contactDetails && (
                    <Stack gap={0}>
                      <Text fw='bold' size='sm'>
                        Contact Details
                      </Text>
                      <Text c='dimmed' size='sm'>
                        {project.contactDetails}
                      </Text>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            </Grid.Col>
          )}
        </Grid>
      </Box>
    </>
  );
}
