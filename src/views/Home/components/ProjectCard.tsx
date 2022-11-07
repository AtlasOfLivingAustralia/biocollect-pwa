import { Group, Title, Grid, Card, Text, Image, Skeleton } from '@mantine/core';
import { Link } from 'react-router-dom';
import { BioCollectProject } from 'types';

interface ProjectCardProps {
  project: BioCollectProject | null;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const loading = !Boolean(project);
  return (
    <Grid.Col xl={2} lg={3} md={4} sm={6} xs={12}>
      <Card
        p="lg"
        radius="md"
        shadow="md"
        sx={{ height: '100%' }}
        component={Link}
        to={loading ? '#' : `/project/${project?.projectId}`}
        state={{ project }}
      >
        <Card.Section>
          <Skeleton visible={loading}>
            <Image
              src={project?.urlImage || ''}
              withPlaceholder
              height={160}
              alt="Project Image"
            />
          </Skeleton>
        </Card.Section>
        <Group mt="md">
          <Skeleton visible={loading}>
            <Title size={20}>{project?.name || 'Project Name'}</Title>
          </Skeleton>
          <Skeleton visible={loading}>
            <Text lineClamp={2}>
              {project?.description || 'Project Description'}
            </Text>
          </Skeleton>
        </Group>
      </Card>
    </Grid.Col>
  );
}
