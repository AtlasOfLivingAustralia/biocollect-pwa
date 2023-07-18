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
  Tooltip,
  Badge,
  Stack,
} from '@mantine/core';
import {
  IconBabyCarriage,
  IconBooks,
  IconCurrencyDollarOff,
  IconExternalLink,
  IconHammer,
  IconHome,
  IconRobot,
  TablerIcon,
} from '@tabler/icons';
import { Link } from 'react-router-dom';
import { BioCollectProject } from 'types';

import { Background, TimeSpan } from 'components';
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

interface ProjectTagItem {
  icon: TablerIcon;
  name: string;
}

const ProjectTagData: { [key: string]: ProjectTagItem } = {
  isSciStarter: {
    icon: IconRobot,
    name: 'From SciStarter',
  },
  noCost: {
    icon: IconCurrencyDollarOff,
    name: 'Free',
  },
  hasTeachingMaterials: {
    icon: IconBooks,
    name: 'Teaching Materials',
  },
  isSuitableForChildren: {
    icon: IconBabyCarriage,
    name: 'For Children',
  },
  isHome: {
    icon: IconHome,
    name: 'Home',
  },
  isDIY: {
    icon: IconHammer,
    name: 'DIY',
  },
};

interface ProjectTagProps {
  tag: string;
}

const ProjectTag = ({ tag }: ProjectTagProps) => {
  const data = ProjectTagData[tag];
  if (!data) return null;

  const { icon: Icon, name } = data;

  return (
    <Badge
      color="gray"
      leftSection={<Icon style={{ marginTop: 4 }} size="0.8rem" />}
    >
      {name}
    </Badge>
  );
};

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
        <Wave style={{ position: 'absolute', bottom: -2 }} />
      </Box>
      <Stack mt={-60} align="center">
        <Card
          shadow="md"
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
          {project.tags.length > 0 && (
            <Group mt="xs" spacing="xs" position="center">
              {project.tags.map((tag) => (
                <ProjectTag key={tag} tag={tag} />
              ))}
            </Group>
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
        <TimeSpan
          start={project.startDate}
          end={project.endDate}
          style={{ flexGrow: 1 }}
        />
      </Stack>
      <Box px={36} pt="xl" pb="sm">
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
        {project.aim && (
          <Spoiler
            mt="md"
            maxHeight={200}
            styles={{ control: { width: '100%' } }}
            showLabel={<SpoilerControl />}
            hideLabel={<SpoilerControl hide />}
          >
            <TypographyStylesProvider>
              <Text
                dangerouslySetInnerHTML={{
                  __html: `<b>Project Aim - </b>${project.aim}`,
                }}
              />
            </TypographyStylesProvider>
          </Spoiler>
        )}
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
            <Tooltip label="Visit Website" position="right">
              <ActionIcon
                component="a"
                href={project.urlWeb}
                target="_blank"
                radius="xl"
                variant="transparent"
              >
                <IconExternalLink />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
        {(!project.isExternal || project.tags.length > 0) && (
          <Group mt="md" mb="xl" spacing="xs">
            {!project.isExternal && <ALABadge />}
            {project.tags.map((tag) => (
              <ProjectTag key={tag} tag={tag} />
            ))}
          </Group>
        )}
        {project.aim && (
          <ScrollArea.Autosize type="hover" offsetScrollbars mah={125}>
            <TypographyStylesProvider>
              <Text
                dangerouslySetInnerHTML={{
                  __html: `<b>Project Aim - </b>${project.aim}`,
                }}
              />
            </TypographyStylesProvider>
          </ScrollArea.Autosize>
        )}
        <Group mt="sm">
          <TimeSpan start={project.startDate} end={project.endDate} />
        </Group>
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
        <Corner style={{ position: 'absolute', bottom: 0 }} />
      </Box>
    </Group>
  );
}
