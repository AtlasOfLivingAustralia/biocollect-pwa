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
  TypographyStylesProvider,
  ActionIcon,
  Button,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { BioCollectProject } from 'types';

import { Background } from 'components';
import { ALABadge } from 'components/ALABadge';
import { Wave, Corner } from 'components/Wave';

interface HeaderProps {
  project: BioCollectProject;
  mobile: boolean;
}

interface SpoilerControlProps {
  hide?: boolean;
}

const SpoilerControl = ({ hide }: SpoilerControlProps) => (
  <Center pt="lg">{hide ? 'Hide' : 'Show more'}</Center>
);

export function Header({ project, mobile }: HeaderProps) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return mobile ? (
    <Box>
      <Box style={{ position: 'relative' }}>
        {project.fullSizeImageUrl ? (
          <Skeleton visible={!imageLoaded} radius={0}>
            <Image
              src={project.fullSizeImageUrl}
              height="23vh"
              withPlaceholder
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          </Skeleton>
        ) : (
          <Background h="23vh" />
        )}
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
          withBorder
        >
          <Title order={2} lineClamp={3}>
            {project.name || 'The title / name of the project'}
          </Title>
          <Title order={3} color="dimmed" px="sm">
            {project.organisationName}
          </Title>
          {!project.isExternal && (
            <Center mt="md">
              <ALABadge />
            </Center>
          )}
          {project.urlWeb && navigator.onLine && (
            <Button
              component="a"
              href={project.urlWeb}
              target="_blank"
              leftIcon={<IconExternalLink size={18} />}
              variant="light"
              color="gray"
              size="sm"
              mt="xl"
            >
              VIEW WEBSITE
            </Button>
          )}
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
        <Spoiler
          mt="md"
          maxHeight={200}
          styles={{ control: { width: '100%' } }}
          showLabel={<SpoilerControl />}
          hideLabel={<SpoilerControl hide />}
        >
          <TypographyStylesProvider>
            <Text dangerouslySetInnerHTML={{ __html: project.description }} />
          </TypographyStylesProvider>
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
        <Group align="start" spacing="sm" mt="xs" noWrap>
          <Title order={3} color="dimmed">
            {project.organisationName}
          </Title>
          {project.urlWeb && navigator.onLine && (
            <ActionIcon
              component="a"
              href={project.urlWeb}
              target="_blank"
              radius="xl"
              variant="transparent"
            >
              <IconExternalLink />
            </ActionIcon>
          )}
        </Group>
        {!project.isExternal && <ALABadge mt="md" />}
        <ScrollArea.Autosize mt="xs" type="hover" offsetScrollbars mah={125}>
          <TypographyStylesProvider>
            <Text dangerouslySetInnerHTML={{ __html: project.description }} />
          </TypographyStylesProvider>
        </ScrollArea.Autosize>
      </Box>
      <Box style={{ position: 'relative', width: 514, height: 320 }}>
        {project.fullSizeImageUrl ? (
          <Skeleton visible={!imageLoaded} radius={0}>
            <Image
              src={project.fullSizeImageUrl}
              height={320}
              withPlaceholder
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          </Skeleton>
        ) : (
          <Background h={320} />
        )}
        <Corner style={{ position: 'absolute', zIndex: 100, bottom: 0 }} />
      </Box>
    </Group>
  );
}
