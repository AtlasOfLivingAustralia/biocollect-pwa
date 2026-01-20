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
import { Link } from 'react-router-dom';

import { Background, DownloadChip, SurveyActions } from '#/components';
import { Corner } from '#/components/Wave';
import type { BioCollectProject, BioCollectSurvey } from '#/types';

interface ProjectItemSurveyProps {
  survey?: BioCollectSurvey;
}

function ProjectItemSurvey({ survey }: ProjectItemSurveyProps) {
  const loading = !survey;

  return (
    <Group justify='space-between' gap={0}>
      <Box>
        <Skeleton visible={loading} radius='lg'>
          {loading || !survey ? (
            <Chip>Placeholder Chip</Chip>
          ) : (
            <DownloadChip survey={survey} label={survey?.name || 'Survey Name'} />
          )}
        </Skeleton>
      </Box>
      <SurveyActions survey={survey} />
    </Group>
  );
}

interface ProjectItemProps {
  project: BioCollectProject | null;
}

export function ProjectItem({ project }: ProjectItemProps) {
  const loading = !project;
  const surveys = project?.projectActivities || [];
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  return (
    <Grid.Col span={{ xl: 4, lg: 6, md: 6, sm: 12, xs: 12 }}>
      <Paper
        style={{ display: 'flex', flexDirection: 'column' }}
        shadow='lg'
        radius='lg'
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
              borderTopLeftRadius: 'var(--mantine-radius-lg)',
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
                zIndex: 100,
                bottom: 0,
                transform: 'scaleX(-100%)',
                width: 'calc(100% + 1px)',
                height: '100%',
              }}
              preserveAspectRatio='none'
            />
          </Box>
          <Stack pr='xl' pt='sm' gap={0} align='flex-end' style={{ textAlign: 'right' }}>
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
            <Text size='sm' lineClamp={3}>
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
          <ScrollArea h={80} type='auto'>
            <Stack px='md' mb='md' gap='sm'>
              {(() => {
                if (loading) {
                  return <ProjectItemSurvey />;
                } else if (surveys.length > 0) {
                  return surveys.map((survey) => <ProjectItemSurvey key={survey.id} survey={survey} />);
                } else {
                  return (
                    <Text ta='center' size='sm' c='dimmed' h={28.2}>
                      No surveys available
                    </Text>
                  );
                }
              })()}
            </Stack>
          </ScrollArea>
        </Stack>
      </Paper>
    </Grid.Col>
  );
}
