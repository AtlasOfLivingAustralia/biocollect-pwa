import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowRight, IconEye, IconHandFinger, IconPlus, IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { Background, DownloadChip } from '#/components';

import logoDark from '/assets/logo-dark-64x64.png';
import logoLight from '/assets/logo-light-64x64.png';

function WelcomeDetails() {
  const navigate = useNavigate();
  const isDark = useComputedColorScheme();

  return (
    <Stack align='center' miw={275} p='xl' style={{ textAlign: 'center' }}>
      <Image w={64} h={64} src={isDark ? logoLight : logoDark} />
      <Title order={2}>Welcome to BioCollect</Title>
      <Stack align='center'>
        <Text size='sm' c='dimmed'>
          This is an early beta version of the new web-based BioCollect mobile app.
        </Text>
      </Stack>
      <Card px='sm' pt='xs' pb='lg' my='xl' style={{ textAlign: 'left' }} withBorder>
        <Text size='xs' fw='bold' c='dimmed' tt='uppercase' mb='sm' style={{ textAlign: 'center' }}>
          How to use
        </Text>
        <List spacing='xs' size='sm' center>
          <List.Item
            icon={
              <ThemeIcon variant='light' size={24} radius='xl'>
                <IconSearch size='0.9rem' />
              </ThemeIcon>
            }
          >
            Search for projects of interest
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon variant='light' size={24} radius='xl'>
                <IconHandFinger size='0.9rem' />
              </ThemeIcon>
            }
          >
            Press
            <DownloadChip display='inline' mx={6} /> to save surveys for offline use
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon variant='light' size={24} radius='xl'>
                <IconHandFinger size='0.9rem' />
              </ThemeIcon>
            }
          >
            The
            <Group mx={6} gap={6} display='inline-flex'>
              <ActionIcon display='inline-flex' variant='light'>
                <IconEye size='1rem' />
              </ActionIcon>
              <ActionIcon display='inline-flex' variant='light'>
                <IconPlus size='1rem' />
              </ActionIcon>
            </Group>
            buttons let you view/add records
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon variant='light' size={24} radius='xl'>
                <IconEye size='0.8rem' />
              </ThemeIcon>
            }
          >
            <Group gap={6}>
              Press
              <b>View Project</b>
              to see more detailed project information
            </Group>
          </List.Item>
        </List>
      </Card>
      <Button
        id='getStarted'
        onClick={() => {
          localStorage.setItem('pwa-welcome', 'true');
          navigate('/');
        }}
        rightSection={<IconArrowRight />}
        mt='md'
      >
        Get started
      </Button>
    </Stack>
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
      <Paper radius='lg' p='md' shadow='lg'>
        <WelcomeDetails />
      </Paper>
    </Background>
  );
}
