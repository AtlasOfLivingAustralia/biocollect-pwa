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
  ActionIcon,
  useMantineTheme,
  Chip,
  Button,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconArrowUpRight,
  IconArrowsUpRight,
  IconDownload,
  IconPlus,
} from '@tabler/icons';
import { Background } from 'components';
import { Corner } from 'components/Wave';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BioCollectProject } from 'types';

interface ProjectCardProps {
  project: BioCollectProject | null;
}

export function ProjectListItem({ project }: ProjectCardProps) {
  const theme = useMantineTheme();
  const loading = !Boolean(project);
  const surveys = project?.surveys.map((survey) => survey.name) || [];
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
                sx={{ fontFamily: theme.headings.fontFamily }}
                size="xl"
                lineClamp={2}
              >
                {project?.name || 'Project Name'}
              </Text>
            </Skeleton>
            <Skeleton mt="sm" visible={loading} radius="md">
              <Button
                component={Link}
                to={`/project/${project?.projectId}`}
                rightIcon={<IconArrowUpRight size="0.8rem" />}
                size="xs"
                radius="md"
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
        {(project?.surveys?.length || 0) > 0 && (
          <Stack spacing={0} mt="auto">
            <Divider mb="md" labelPosition="center" label="Surveys" />
            <Stack px="md" mb="md" spacing="xs">
              {[...surveys, ...surveys].map((survey, index) => (
                <Group spacing="xs" position="apart">
                  <Chip checked={false}>Test survey {index + 1}</Chip>
                  <Group spacing="xs">
                    <ActionIcon
                      size="lg"
                      radius="md"
                      variant="light"
                      color="blue"
                    >
                      <IconPlus size="1rem" />
                    </ActionIcon>
                    <ActionIcon
                      size="lg"
                      radius="md"
                      variant="light"
                      color="blue"
                    >
                      <IconDownload size="1rem" />
                    </ActionIcon>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Stack>
        )}
      </Paper>
    </Grid.Col>
  );
}
