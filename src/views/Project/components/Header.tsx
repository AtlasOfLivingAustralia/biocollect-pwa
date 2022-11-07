import {
  Group,
  Box,
  Image,
  Skeleton,
  Title,
  Text,
  ScrollArea,
  Tabs,
  Breadcrumbs,
  Anchor,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import Wave from 'components/Wave/Corner';
import { BioCollectProject } from 'types';

interface HeaderProps {
  project: BioCollectProject | null;
}

export default function Header({ project }: HeaderProps) {
  const loading = !Boolean(project);
  return (
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
            Project Search
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
        <Skeleton visible={loading}>
          <Image src={project?.fullSizeImageUrl} height={320} withPlaceholder />
        </Skeleton>
        <Wave style={{ position: 'absolute', zIndex: 100, bottom: 0 }} />
      </Box>
    </Group>
  );
}
