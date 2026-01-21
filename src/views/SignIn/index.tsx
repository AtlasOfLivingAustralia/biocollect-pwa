import { Background } from '#/components';
import {
  Button,
  Flex,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
} from '@mantine/core';
import { useAuth } from 'react-oidc-context';
import classes from './index.module.css';

// Logos
import logoAla from '/assets/logo-ala-white.png';
import logoDark from '/assets/logo-dark-64x64.png';
import logoLight from '/assets/logo-light-64x64.png';
import splash from '/assets/splash.jpg';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  const auth = useAuth();
  const isDark = useComputedColorScheme() === 'dark';
  const navigate = useNavigate();

  // Automatically navigate to the home once signed in
  useEffect(() => {
    if (auth.isAuthenticated) navigate('/')
  }, [auth.isAuthenticated]);

  return (
    <Background
      className={classes.background}
    >
      <Flex pos='relative'>
        <Paper className={classes.details} shadow='xl' radius='xl'>
          <Stack p='xl' justify='space-between' h="100%">
            <Stack gap={0}>
              <Image mb='lg' w={50} h={50} src={isDark ? logoLight : logoDark} />
              <Text fz={28} ff='heading'>Welcome back</Text>
              <Text c='dimmed'>A world of citizen science projects await</Text>
            </Stack>
            <Group pb='lg'>
              <Button
                loading={auth.isLoading || auth.isAuthenticated}
                mt='xl'
                id='signIn'
                color='rust'
                leftSection={<Image width={16} height={16} src={logoAla} />}
                onClick={() => auth.signinRedirect()}
              >
                Sign in with ALA
              </Button>
            </Group>
          </Stack>
        </Paper>
        <div className={classes.wrapper}>
          <div className={`${classes.blur} ${auth.isLoading ? classes.in : ''}`}></div>
          <Image pos='relative' className={classes.feature} radius='xl' h="100%" src={splash} />
          <Paper className={classes.card} radius='xl' p='xl' shadow='xl'>
            <Stack h="100%" align='center' justify='center' gap='xs' pb='sm' miw={240}>
              <Image w={64} h={64} src={isDark ? logoLight : logoDark} />
              <Stack gap={0} align='center' mb='sm'>
                <Title order={2}>BioCollect</Title>
                <Text size='sm' c='dimmed'>
                  Citizen Science Projects
                </Text>
              </Stack>
              <Button
                loading={auth.isLoading || auth.isAuthenticated}
                mt='xl'
                id='signIn'
                color='rust'
                leftSection={<Image width={16} height={16} src={logoAla} />}
                onClick={() => auth.signinRedirect()}
              >
                Sign in with ALA
              </Button>
            </Stack>
          </Paper>
        </div>
      </Flex>
    </Background >
  )
}
