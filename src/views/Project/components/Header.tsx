/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: Needed for custom HTML in project aim */
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Image,
  ScrollArea,
  Skeleton,
  Spoiler,
  Stack,
  Text,
  Title,
  Tooltip,
  Typography,
} from '@mantine/core';
import { IconArrowBack, IconExternalLink } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Background, TimeSpan } from '#/components';
import { ALABadge } from '#/components/ALABadge';
import { Corner, Wave } from '#/components/Wave';
import { useOnLine } from '#/helpers/funcs';
import type { BioCollectProject } from '#/types';
import { ProjectTag } from './ProjectTag';
// Local components
import { SocialLinks } from './SocialLinks';

interface HeaderProps {
  project: BioCollectProject;
  mobile: boolean;
}

interface SpoilerControlProps {
  hide?: boolean;
}

const SpoilerControl = ({ hide }: SpoilerControlProps) => (
  <Center pt='lg'>{hide ? 'Hide' : 'Show more'}</Center>
);

const MOBILE_HEADER_IMAGE_HEIGHT = '24vh';
const DESKTOP_HEADER_IMAGE_HEIGHT = 320;
const DESKTOP_HEADER_IMAGE_WIDTH = 514;

export function Header({ project, mobile }: HeaderProps) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const onLine = useOnLine();
  const imageTransitionName = `project-image-${project.projectId}`;
  const titleTransitionName = `project-title-${project.projectId}`;

  return mobile ? (
    <Box>
      <Box
        style={{
          position: 'relative',
          height: MOBILE_HEADER_IMAGE_HEIGHT,
          overflow: 'clip',
          contain: 'layout',
          viewTransitionName: imageTransitionName,
        }}
      >
        {(project.fullSizeImageUrl && !imageError) ? (
          <Skeleton visible={!imageLoaded} radius={0} h='100%'>
            <Image
              src={project.fullSizeImageUrl}
              h='100%'
              w='100%'
              fit='cover'
              onLoad={() => { setImageLoaded(true) }}
              onError={() => { setImageError(true) }}
            />
          </Skeleton>
        ) : (
          <Background h='100%' />
        )}
        <Wave style={{ position: 'absolute', bottom: -2 }} />
      </Box>
      <Stack mt={-120} align='center' gap='xl'>
        <Card
          shadow='xl'
          radius='xl'
          pt='lg'
          px='lg'
          pb='sm'
          style={{
            width: 'calc(75vw)',
            maxWidth: 400,
            textAlign: 'center',
            backgroundColor: 'light-dark(rgba(255,255,255,0.6), rgba(45,45,45,0.6))',
            backdropFilter: 'blur(12px)',
          }}
          ta='center'
          withBorder
        >
          <Center>
            <Title order={2} lineClamp={3} style={{ viewTransitionName: titleTransitionName, width: 'fit-content' }}>
              {project.name || 'The title / name of the project'}
            </Title>
          </Center>
          <Title order={4} c='dimmed' px='sm'>
            {project.organisationName}
          </Title>
          {(!project.isExternal || project.tags.length > 0) && (
            <Group mt='lg' gap='xs' justify='center'>
              {!project.isExternal && <ALABadge />}
              {project.difficulty && <Badge>{project.difficulty} difficulty</Badge>}
              {project.tags.map((tag) => (
                <ProjectTag key={tag} tag={tag} />
              ))}
            </Group>
          )}
          {project.urlWeb && onLine && (
            <Button
              component='a'
              href={project.urlWeb}
              target='_blank'
              leftSection={<IconExternalLink size={18} />}
              variant='subtle'
              color='gray'
              size='xs'
              mt='xl'
            >
              VIEW WEBSITE
            </Button>
          )}
          {project.links.length > 0 && (
            <>
              <Divider mt='xl' mb='lg' variant='dashed' />
              <SocialLinks links={project.links} justify='center' />
            </>
          )}
          <Center mt='lg'>
            <Button component={Link} to='..' leftSection={<IconArrowBack size="1rem" />} viewTransition variant='subtle' color='dimmed' size='sm'>
              Back to home
            </Button>
          </Center>
        </Card>
        <TimeSpan start={project.startDate} end={project.endDate} style={{ flexGrow: 1 }} />
      </Stack>
      <Box px={36} pt='xl' pb='sm'>
        {project.aim && (
          <Spoiler
            mt='md'
            maxHeight={200}
            styles={{ control: { width: '100%' } }}
            showLabel={<SpoilerControl />}
            hideLabel={<SpoilerControl hide />}
          >
            <Typography>
              <Text
                dangerouslySetInnerHTML={{
                  __html: `<b>Project Aim - </b>${project.aim}`,
                }}
              />
            </Typography>
          </Spoiler>
        )}
      </Box>
    </Box>
  ) : (
    <Group justify='space-between' align='start' gap={0}>
      <Box
        py={36}
        pl={36}
        style={{
          overflowWrap: 'break-word',
          width: 'calc(100vw - 530px)',
          maxWidth: 800,
        }}
      >
        <Breadcrumbs mb='md'>
          <Anchor component={Link} to='..' viewTransition size='sm'>
            Search
          </Anchor>
          <Text c='dimmed' size='sm'>
            {project.name}
          </Text>
        </Breadcrumbs>
        <Title style={{ viewTransitionName: titleTransitionName, width: 'fit-content' }}>{project.name}</Title>
        <Flex align='flex-start' gap='sm' mt='xs'>
          <Title order={3} c='dimmed'>
            {project.organisationName}
          </Title>
          {project.urlWeb && onLine && (
            <Tooltip label='Visit Website' position='right'>
              <ActionIcon
                component='a'
                href={project.urlWeb}
                target='_blank'
                radius='xl'
                variant='transparent'
              >
                <IconExternalLink size='1rem' />
              </ActionIcon>
            </Tooltip>
          )}
        </Flex>
        {(!project.isExternal || project.tags.length > 0) && (
          <Group mt='md' mb='xl' gap='xs'>
            {!project.isExternal && <ALABadge />}
            {project.difficulty && <Badge>{project.difficulty} difficulty</Badge>}
            {project.tags.map((tag) => (
              <ProjectTag key={tag} tag={tag} />
            ))}
          </Group>
        )}
        {project.aim && (
          <ScrollArea.Autosize type='hover' offsetScrollbars mah={125}>
            <Typography>
              <Text
                dangerouslySetInnerHTML={{
                  __html: `<b>Project Aim - </b>${project.aim}`,
                }}
              />
            </Typography>
          </ScrollArea.Autosize>
        )}
        <Group mt='xl' justify='space-between' align='flex-start'>
          <TimeSpan start={project.startDate} end={project.endDate} />
          {project.links.length > 0 && <SocialLinks links={project.links} align='flex-start' />}
        </Group>
      </Box>
      <Box
        style={{
          position: 'relative',
          width: DESKTOP_HEADER_IMAGE_WIDTH,
          height: DESKTOP_HEADER_IMAGE_HEIGHT,
          overflow: 'clip',
          contain: 'layout',
          viewTransitionName: imageTransitionName,
        }}
      >
        {(project.fullSizeImageUrl && !imageError) ? (
          <Skeleton visible={!imageLoaded} radius={0} h='100%'>
            <Image
              src={project.fullSizeImageUrl}
              h='100%'
              w='100%'
              fit='cover'
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </Skeleton>
        ) : (
          <Background h='100%' />
        )}
        <Corner style={{ position: 'absolute', bottom: 0 }} />
      </Box>
    </Group>
  );
}
