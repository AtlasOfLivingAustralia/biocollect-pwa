import {
  Stack,
  Grid,
  Card,
  Text,
  Image,
  Skeleton,
  createStyles,
  Divider,
} from '@mantine/core';
import { Background } from 'components';
import { Link } from 'react-router-dom';
import { BioCollectProject } from 'types';

interface ProjectCardProps {
  project: BioCollectProject | null;
}

const useStyles = createStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
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
        radius="lg"
        shadow="md"
        withBorder
        sx={{ height: '100%' }}
        component={Link}
        to={loading ? '#' : `/project/${project?.projectId}`}
        state={{ project }}
      >
        <Card.Section>
          {loading || project?.urlImage ? (
            <Skeleton visible={loading}>
              <Image
                src={project?.urlImage || ''}
                withPlaceholder
                height={160}
                alt="Project Image"
              />
            </Skeleton>
          ) : (
            <Background parallax={false} h={160} />
          )}
        </Card.Section>
        <Card.Section>
          <Divider opacity={0.8} />
        </Card.Section>
        <Stack mt="md" style={{ flexGrow: 1 }} spacing="xs">
          <Skeleton visible={loading}>
            <Text
              sx={(theme) => ({ fontFamily: theme.headings.fontFamily })}
              size="xl"
              lineClamp={2}
            >
              {project?.name || 'Project Name'}
            </Text>
          </Skeleton>
          <Skeleton visible={loading}>
            <Text lineClamp={2}>
              {project?.description ||
                'Project description that will typically span two lines'}
            </Text>
          </Skeleton>
        </Stack>
      </Card>
    </Grid.Col>
  );
}
