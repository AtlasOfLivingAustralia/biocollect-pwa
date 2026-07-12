import {
  Button,
  Card,
  Group,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowRight, IconArrowUpRight, IconDownload, IconEye, IconHandFinger, IconPlus, IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

import { Background } from '#/components';
import { Logo } from '#/components/Logo';

const LINE_HEIGHT = 1.65;
const ICON_MARGIN = 4;

function WelcomeDetails() {
  const navigate = useNavigate();

  return (
    <Stack align='center' miw={275} p='xl' style={{ textAlign: 'center' }}>
      <Logo size={72} />
      <Title order={2}>Welcome to BioCollect</Title>
      <Stack align='center'>
        <Text size='sm' c='dimmed'>
          Welcome to the web-based BioCollect mobile app
        </Text>
      </Stack>
      <Card px='md' pt='xs' pb='lg' my='xl' style={{ textAlign: 'left' }} radius='xl' withBorder>
        <Text size='xs' fw='bold' c='dimmed' tt='uppercase' mb='sm' style={{ textAlign: 'center' }}>
          How to use
        </Text>
        <List pl={0} spacing='sm' size='sm' center>
          <List.Item
            lh={LINE_HEIGHT}
            icon={
              <ThemeIcon variant='light' size={24} radius='xl' mr={ICON_MARGIN}>
                <IconSearch size='0.9rem' />
              </ThemeIcon>
            }
          >
            Search for projects of interest
          </List.Item>
          <List.Item
            lh={LINE_HEIGHT}
            icon={
              <ThemeIcon variant='light' size={24} radius='xl' mr={ICON_MARGIN}>
                <IconHandFinger size='0.9rem' />
              </ThemeIcon>
            }
          >
            Press
            <Button size='xs' mx={6} display='inline-flex' variant='light' leftSection={<IconDownload size='1rem' />}>
              Download
            </Button>
            to save surveys for offline use
          </List.Item>
          <List.Item
            lh={LINE_HEIGHT}
            icon={
              <ThemeIcon variant='light' size={24} radius='xl' mr={ICON_MARGIN}>
                <IconHandFinger size='0.9rem' />
              </ThemeIcon>
            }
          >
            The
            <Button ml={6} mr={3} size='xs' display='inline-flex' variant='light' leftSection={<IconEye size='1rem' />}>
              Records
            </Button>
            <Button ml={3} mr={6} size='xs' display='inline-flex' variant='light' leftSection={<IconPlus size='1rem' />}>
              Add
            </Button>
            buttons let you view/add records
          </List.Item>
          <List.Item
            lh={LINE_HEIGHT}
            icon={
              <ThemeIcon variant='light' size={24} radius='xl' mr={ICON_MARGIN}>
                <IconEye size='0.8rem' />
              </ThemeIcon>
            }
          >

            Press
            <Button size='xs' variant='outline' mx={6} rightSection={<IconArrowUpRight size="1rem" />}>
              View project
            </Button>
            to see more detailed project information
          </List.Item>
        </List>
      </Card>
      <Button
        id='getStarted'
        radius='xl'
        onClick={() => {
          localStorage.setItem('pwa-welcome', 'true');
          navigate('/', { viewTransition: true });
        }}
        rightSection={<IconArrowRight size='1rem' />}
      >
        Get started
      </Button>
    </Stack >
  );
}

export function Welcome() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return mobile ? (
    <WelcomeDetails />
  ) : (
    <Background
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Paper radius='xl' p='md' shadow='xl'>
        <WelcomeDetails />
      </Paper>
    </Background>
  );
}
