import { useState } from 'react';
import {
  Group,
  Box,
  Image,
  Skeleton,
  Title,
  Text,
  ScrollArea,
  Breadcrumbs,
  Anchor,
  useMantineTheme,
  Card,
  Center,
  Spoiler,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import { Wave, Corner } from 'components/Wave';
import { BioCollectProject } from 'types';

interface HeaderProps {
  project: BioCollectProject | null;
}

export default function Header({ project }: HeaderProps) {
  const loading = !Boolean(project);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  return mobile ? (
    <Box>
      <Box style={{ position: 'relative' }}>
        <Skeleton visible={loading || !imageLoaded} radius={0}>
          <Image
            src={project?.fullSizeImageUrl}
            height="23vh"
            withPlaceholder
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        </Skeleton>
        <Wave style={{ position: 'absolute', zIndex: 100, bottom: -2 }} />
      </Box>
      <Center mt={-60}>
        <Card
          shadow="md"
          radius="lg"
          style={{
            width: 'calc(75vw)',
            maxWidth: 400,
            textAlign: 'center',
            zIndex: 200,
          }}
        >
          <Skeleton visible={loading}>
            <Title order={2} lineClamp={3}>
              {project?.name || 'The title / name of the project'}
            </Title>
          </Skeleton>
          <Skeleton visible={loading} mt="sm">
            <Title order={4} color="dimmed">
              {project?.organisationName}
            </Title>
          </Skeleton>
        </Card>
      </Center>
      <Box p="xl">
        <Center>
          <Breadcrumbs mb="md">
            <Anchor component={Link} to=".." size="sm">
              Search
            </Anchor>
            <Text color="dimmed" size="sm">
              {project?.name.substring(0, 38)}
            </Text>
          </Breadcrumbs>
        </Center>
        <Spoiler mt="md" maxHeight={200} showLabel="Show more" hideLabel="Hide">
          <Text>{project?.description}</Text>
        </Spoiler>
      </Box>
    </Box>
  ) : (
    <Group position="apart" align="start">
      <Box
        p={36}
        pr={0}
        style={{
          overflowWrap: 'break-word',
          width: 'calc(100vw - 530px)',
          maxWidth: 800,
        }}
      >
        <Breadcrumbs mb="md">
          <Anchor component={Link} to=".." size="sm">
            Search
          </Anchor>
          <Text color="dimmed" size="sm">
            {project?.name}
          </Text>
        </Breadcrumbs>
        <Skeleton visible={loading}>
          <Title>{project?.name}</Title>
        </Skeleton>
        <Skeleton visible={loading}>
          <Title order={3} color="dimmed">
            {project?.organisationName}
          </Title>
        </Skeleton>
        <Skeleton visible={loading} mt="lg">
          <ScrollArea type="hover" offsetScrollbars style={{ height: 150 }}>
            <Text>{project?.description}</Text>
          </ScrollArea>
        </Skeleton>
        {/* <Tabs variant="pills" mt="auto">
          <Tabs.List>
            <Tabs.Tab value="test">Testing</Tabs.Tab>
          </Tabs.List>
        </Tabs> */}
      </Box>
      <Box style={{ position: 'relative', width: 514, height: 320 }}>
        <Skeleton visible={loading || !imageLoaded} radius={0}>
          <Image
            src={project?.fullSizeImageUrl}
            height={320}
            withPlaceholder
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        </Skeleton>
        <Corner style={{ position: 'absolute', zIndex: 100, bottom: 0 }} />
      </Box>
    </Group>
  );
}
