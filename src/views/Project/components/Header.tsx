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
  Card,
  Center,
  Spoiler,
  Badge,
  Tooltip,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { Wave, Corner } from 'components/Wave';
import { BioCollectProject } from 'types';

import logoAla from 'assets/logo-ala.png';

interface HeaderProps {
  project: BioCollectProject;
  mobile: boolean;
}

const ALADataBadge = () => (
  <Tooltip
    position="bottom-start"
    label="This project is contributing data to the Atlas of Living Australia"
  >
    <Badge
      color="orange"
      leftSection={<Image height={20} width="auto" src={logoAla} />}
      mt="md"
    >
      Contributing to the ALA
    </Badge>
  </Tooltip>
);

export default function Header({ project, mobile }: HeaderProps) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return mobile ? (
    <Box>
      <Box style={{ position: 'relative' }}>
        <Skeleton visible={!imageLoaded} radius={0}>
          <Image
            src={project.fullSizeImageUrl}
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
          <Title order={2} lineClamp={3}>
            {project.name || 'The title / name of the project'}
          </Title>
          <Title order={4} color="dimmed">
            {project.organisationName}
          </Title>
          {!project.isExternal && <ALADataBadge />}
        </Card>
      </Center>
      <Box p={36}>
        <Center>
          <Breadcrumbs mb="md">
            <Anchor component={Link} to=".." size="sm">
              Search
            </Anchor>
            <Text color="dimmed" size="sm">
              {project.name.substring(0, 38)}
            </Text>
          </Breadcrumbs>
        </Center>
        <Spoiler mt="md" maxHeight={200} showLabel="Show more" hideLabel="Hide">
          <Text>{project.description}</Text>
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
            {project.name}
          </Text>
        </Breadcrumbs>
        <Title>{project.name}</Title>
        <Title order={3} color="dimmed">
          {project.organisationName}
        </Title>
        {!project.isExternal && <ALADataBadge />}
        <ScrollArea.Autosize
          mt="xs"
          type="hover"
          offsetScrollbars
          maxHeight={125}
        >
          <Text>{project.description}</Text>
        </ScrollArea.Autosize>
      </Box>
      <Box style={{ position: 'relative', width: 514, height: 320 }}>
        <Skeleton visible={!imageLoaded} radius={0}>
          <Image
            src={project.fullSizeImageUrl}
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
