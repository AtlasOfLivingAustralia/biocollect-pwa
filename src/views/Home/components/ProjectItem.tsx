import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { Background, DownloadChip, SurveyActions } from '#/components';
import { Corner } from '#/components/Wave';
import type { BioCollectProject, BioCollectSurvey } from '#/types';
import { useOnLine } from '#/helpers/funcs';

interface ProjectItemSurveyProps {
  survey?: BioCollectSurvey;
  downloaded?: boolean;
}

function ProjectItemSurvey({ survey, downloaded }: ProjectItemSurveyProps) {
  const onLine = useOnLine();

  return (
    <Group justify='space-between' gap={0}>
      <Box>
        <Skeleton visible={!survey} radius='lg'>
          {!survey ? (
            <Chip>Placeholder Chip</Chip>
          ) : (
            <DownloadChip survey={survey} label={survey.name} onLine={onLine} downloaded={downloaded} />
          )}
        </Skeleton>
      </Box>
      <SurveyActions survey={survey} onLine={onLine} downloaded={downloaded} />
    </Group>
  );
}

interface ProjectItemProps {
  project: BioCollectProject | null;
  downloaded?: { [survey: string]: true }
}

export function ProjectItem({ project, downloaded }: ProjectItemProps) {
  const loading = !project;
  const surveys = project?.projectActivities || [];
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  return (
    <Grid.Col span={{ xl: 4, lg: 6, md: 6, sm: 12, xs: 12 }}>
      <Paper
        style={{ display: 'flex', flexDirection: 'column' }}
        shadow='xl'
        radius='xl'
        withBorder
        h='100%'
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Box
            style={{
              position: 'relative',
              minWidth: 160,
              width: 220,
              maxWidth: 220,
              height: 125,
              overflow: 'clip',
              borderTopLeftRadius: 'var(--mantine-radius-xl)',
            }}
          >
            {(project?.urlImage && !imageError) ? (
              <Skeleton visible={!imageLoaded} radius={0}>
                <Image
                  src={project?.urlImage}
                  height={125}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              </Skeleton>
            ) : (
              <Background parallax={false} h={125} />
            )}
            <Corner
              style={{
                position: 'absolute',
                zIndex: 10,
                bottom: 0,
                transform: 'scaleX(-100%)',
                width: 'calc(100% + 1px)',
                height: '100%',
              }}
              preserveAspectRatio='none'
            />
          </Box>
          <Stack pr='xl' pt='md' gap={0} align='flex-end' style={{ textAlign: 'right' }}>
            <Skeleton visible={loading}>
              <Text fw={700} ff='heading' size='xl' lineClamp={2}>
                {project?.name || 'Project Name'}
              </Text>
            </Skeleton>
            <Skeleton mt='sm' visible={loading}>
              <Button
                id={project?.projectId}
                component={Link}
                to={`/project/${project?.projectId}`}
                rightSection={<IconArrowUpRight size='0.8rem' />}
                size='xs'
                variant='outline'
              >
                View Project
              </Button>
            </Skeleton>
          </Stack>
        </Box>
        <Box px='md' pt='md' pb='xs'>
          <Skeleton visible={loading}>
            <Text size='sm' lineClamp={3} h={61}>
              {project?.description || 'Project description that will typically span two lines'}
            </Text>
          </Skeleton>
        </Box>
        <Stack gap={0} mt='auto'>
          <Divider
            labelPosition='center'
            label={
              <Skeleton visible={loading} w={42}>
                Surveys
              </Skeleton>
            }
            mb={6}
          />
          <ScrollArea h={90} type='auto'>
            <Stack px='md' mb='md' gap='sm'>
              {loading && <ProjectItemSurvey />}
              {(!loading && surveys.length > 0) &&
                surveys.map((survey) => <ProjectItemSurvey key={survey.id} survey={survey} downloaded={downloaded?.[survey.id]} />)
              }
              {(!loading && surveys.length === 0) && (
                <Text ta='center' size='sm' c='dimmed' h={28.2}>
                  No surveys available
                </Text>
              )}
            </Stack>
          </ScrollArea>
        </Stack>
      </Paper>
    </Grid.Col>
  );
}
