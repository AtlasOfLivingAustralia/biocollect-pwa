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
import { UnpublishedBadge, UnpublishedWrapper } from '#/components/Unpublished';
import { Corner } from '#/components/Wave';
import type { BioCollectProject, BioCollectSurvey } from '#/types';
import { useOnLine } from '#/helpers/funcs';

import classes from './ProjectItem.module.css';
import type { OfflineProjectActivitiesMap } from '#/helpers/pwa/context';

interface ProjectItemSurveyProps {
  survey?: BioCollectSurvey;
  downloaded?: boolean;
  unpublishedCount?: number;
}

function ProjectItemSurvey({ survey, downloaded, unpublishedCount = 0 }: ProjectItemSurveyProps) {
  const onLine = useOnLine();

  return (
    <Group justify='space-between'>
      <Box style={{ minWidth: 0 }}>
        <Skeleton visible={!survey} radius='lg'>
          {!survey ? (
            <Chip>Placeholder Chip</Chip>
          ) : (
            <DownloadChip
              className={classes.download}
              survey={survey}
              label={survey.name}
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

  return (
    <Grid.Col span={{ xl: 4, lg: 6, md: 6, sm: 12, xs: 12 }}>
      <Paper
        pos='relative'
        style={{ display: 'flex', flexDirection: 'column' }}
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
                <Text fw={700} ff='heading' size='xl' lineClamp={2}>
                  {project?.name || 'Project Name'}
                </Text>
              </Stack>
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
                surveys.sort((survey) => unpublished?.projectActivity[survey.projectActivityId] ? -1 : 1).map((survey) => (
                  <ProjectItemSurvey
                    key={survey.id}
                    survey={survey}
                    downloaded={downloaded?.[survey.id]}
                    unpublishedCount={unpublished?.projectActivity[survey.projectActivityId] || 0}
                  />
                ))
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
