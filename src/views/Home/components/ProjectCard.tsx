import {
  Group,
  Title,
  Grid,
  Card,
  Text,
  Image,
  Skeleton,
  createStyles,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { BioCollectProject } from 'types';

interface ProjectCardProps {
  project: BioCollectProject | null;
}

const useStyles = createStyles({
  card: {
    transition: 'opacity 100ms ease-out',
    ':hover': {
      opacity: 0.2,
    },
  },
});

export function ProjectCard({ project }: ProjectCardProps) {
  const styles = useStyles();
  const loading = !Boolean(project);
  return (
    <Grid.Col xl={2} lg={3} md={4} sm={6} xs={12}>
      <Card
        className={styles.classes.card}
        p="lg"
        radius="md"
        shadow="md"
        sx={{ height: '100%' }}
        component={Link}
        to={loading ? '#' : `/project/${project?.projectId}`}
        state={{ project }}
        styles={{
          '&:hover': {
            opacity: 0.6,
          },
        }}
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
