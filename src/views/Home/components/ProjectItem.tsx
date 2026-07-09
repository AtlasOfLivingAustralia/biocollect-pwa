import {
  Box,
  Button,
  Center,
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
import { Link, useViewTransitionState } from 'react-router';

import { Background, DownloadChip, SurveyActions } from '#/components';
import { UnpublishedBadge, UnpublishedWrapper } from '#/components/Unpublished';
import { Corner } from '#/components/Wave';
import type { BioCollectProject, BioCollectSurvey } from '#/types';
import { useOnLine } from '#/helpers/funcs';

import type { OfflineProjectActivitiesMap } from '#/helpers/pwa/context';

interface ProjectItemSurveyProps {
  survey?: BioCollectSurvey;
  downloaded?: boolean;
  unpublishedCount?: number;
}

function ProjectItemSurvey({ survey, downloaded, unpublishedCount = 0 }: ProjectItemSurveyProps) {
  const onLine = useOnLine();

  return (
    <Stack gap='xs'>
      <Skeleton visible={!survey}>
        <Text size='xs'>{survey?.name || "Survey Name"}</Text>
      </Skeleton>
      <Group justify='space-between'>
        <Box style={{ minWidth: 0 }}>
          <Skeleton visible={!survey} radius='lg'>
            {!survey ? (
              <Chip>Placeholder Chip</Chip>
            ) : (
              <DownloadChip
                survey={survey}
                onLine={onLine}
                downloaded={downloaded}
              />
            )}
          </Skeleton>
        </Box>
        <UnpublishedWrapper count={unpublishedCount}>
          <SurveyActions survey={survey} onLine={onLine} downloaded={downloaded} />
        </UnpublishedWrapper>
      </Group>
    </Stack>
  );
}

interface ProjectItemProps {
  project: BioCollectProject | null;
  downloaded?: { [survey: string]: true }
  unpublished?: OfflineProjectActivitiesMap;
}

export function ProjectItem({
  project,
  downloaded,
  unpublished,
}: ProjectItemProps) {
  const loading = !project;
  const surveys = project?.projectActivities || [];

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const unpublishedCount = unpublished?.project[project?.projectId || ''];
  const href = project ? `/project/${project.projectId}` : '';

  const isTransitioning = useViewTransitionState(href);
  const imageTransitionName = isTransitioning && project ? `project-image-${project.projectId}` : 'none';
  const titleTransitionName = isTransitioning && project ? `project-title-${project.projectId}` : 'none';

  return (
    <Grid.Col span={{ xl: 4, lg: 6, md: 6, sm: 12, xs: 12 }}>
      <Paper
        pos='relative'
        style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        shadow='xl'
        radius='xl'
        withBorder
        h='100%'
      >
        <UnpublishedBadge count={unpublishedCount} fixed />
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
              contain: 'layout',
              viewTransitionName: imageTransitionName,
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
              <Stack gap={6} align='flex-end'>
                <Text
                  fw={700}
                  ff='heading'
                  size='xl'
                  lineClamp={2}
                  style={{ viewTransitionName: titleTransitionName, width: 'fit-content' }}
                >
                  {project?.name || 'Project Name'}
                </Text>
              </Stack>
            </Skeleton>
            <Skeleton mt='sm' visible={loading}>
              <Button
                id={project?.projectId}
                component={Link}
                viewTransition
                to={`/project/${project?.projectId}`}
                rightSection={<IconArrowUpRight size='0.8rem' />}
                size='xs'
                variant='outline'
              >
                View project
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
            mt='sm'
            labelPosition='center'
            label={`${surveys.length} survey${surveys.length === 1 ? '' : 's'}`}
            variant='dashed'
          />
          {loading ? (
            <Stack px='md' py='sm'>
              <ProjectItemSurvey />
            </Stack>
          ) : (
            <>
              {surveys.length > 0 ? (
                <ScrollArea h={85} type='auto'>
                  <Stack px='md' py='sm' gap='md'>
                    {surveys.sort((survey) => unpublished?.projectActivity[survey.projectActivityId] ? -1 : 1).map((survey, index) => (
                      <ProjectItemSurvey
                        key={survey.id}
                        survey={survey}
                        downloaded={downloaded?.[survey.id]}
                        unpublishedCount={unpublished?.projectActivity[survey.projectActivityId] || 0}
                      />
                    ))}
                  </Stack>
                </ScrollArea>
              ) : (
                <Center h={85}>
                  <Text ta='center' size='sm' c='dimmed'>
                    No surveys available
                  </Text>
                </Center>
              )}
            </>
          )}
        </Stack>
      </Paper>
    </Grid.Col>
  );
}
