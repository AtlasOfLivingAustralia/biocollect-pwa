import {
  Grid,
  Text,
  Image,
  Skeleton,
  Box,
  Stack,
  Paper,
  Group,
  Divider,
  useMantineTheme,
  Button,
  Chip,
  ScrollArea,
} from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';
import { SurveyActions, Background, DownloadChip } from 'components';
import { Corner } from 'components/Wave';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BioCollectProject, BioCollectSurvey } from 'types';

interface ProjectItemSurveyProps {
  survey?: BioCollectSurvey;
}

function ProjectItemSurvey({ survey }: ProjectItemSurveyProps) {
  const loading = !Boolean(survey);

  return (
    <Group position="apart" spacing={0}>
      <Skeleton visible={loading} radius="lg" w="calc(100% - 130px)">
        {loading || !survey ? (
          <Chip>Placeholder Chip</Chip>
        ) : (
          <DownloadChip survey={survey} label={survey?.name || 'Survey Name'} />
        )}
      </Skeleton>
      <SurveyActions survey={survey} />
    </Group>
  );
}

interface ProjectItemProps {
  project: BioCollectProject | null;
}

export function ProjectItem({ project }: ProjectItemProps) {
  const theme = useMantineTheme();
  const loading = !Boolean(project);
  const surveys = project?.projectActivities || [];
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return (
    <Grid.Col xl={4} lg={6} md={6} sm={12} xs={12}>
      <Paper
        style={{ display: 'flex', flexDirection: 'column' }}
        shadow="lg"
        radius="lg"
        withBorder
        h="100%"
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
              borderTopLeftRadius: theme.radius.lg,
            }}
          >
            {project?.urlImage ? (
              <Skeleton visible={!imageLoaded} radius={0}>
                <Image
                  src={project?.urlImage}
                  height={125}
                  withPlaceholder
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
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
              preserveAspectRatio="none"
            />
          </Box>
          <Stack
            pr="xl"
            pt="sm"
            spacing={0}
            align="flex-end"
            style={{ textAlign: 'right' }}
          >
            <Skeleton visible={loading}>
              <Text
                sx={{
                  fontFamily: theme.headings.fontFamily,
                  fontWeight: 700,
                }}
                size="xl"
                lineClamp={2}
              >
                {project?.name || 'Project Name'}
              </Text>
            </Skeleton>
            <Skeleton mt="sm" visible={loading}>
              <Button
                component={Link}
                to={`/project/${project?.projectId}`}
                rightIcon={<IconArrowUpRight size="0.8rem" />}
                size="xs"
                variant="outline"
              >
                View Project
              </Button>
            </Skeleton>
          </Stack>
        </Box>
        <Box px="md" pt="md" pb="xs">
          <Skeleton visible={loading}>
            <Text size="sm" lineClamp={3}>
              {project?.description ||
                'Project description that will typically span two lines'}
            </Text>
          </Skeleton>
        </Box>
        <Stack spacing={0} mt="auto">
          <Divider
            labelPosition="center"
            label={
              <Skeleton visible={loading} w={42}>
                Surveys
              </Skeleton>
            }
            mb={6}
          />
          <ScrollArea h={80} type="auto">
            <Stack px="md" mb="md" spacing="sm">
              {loading ? (
                <ProjectItemSurvey />
              ) : surveys.length > 0 ? (
                surveys.map((survey) => (
                  <ProjectItemSurvey key={survey.id} survey={survey} />
                ))
              ) : (
                <Text align="center" size="sm" color="dimmed" h={28.2}>
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
