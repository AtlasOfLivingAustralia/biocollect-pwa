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
} from '@mantine/core';
import { useAuth } from 'react-oidc-context';
import classes from './index.module.css';

// Logos
import logoAla from '/assets/logo-ala-white.png';
import splash from '/assets/splash.jpg';


import { Logo } from '#/components/Logo';
import { AssistButtons } from '#/layout/AssistButtons';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function SignIn() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Automatically navigate to the home once signed in
  useEffect(() => {
    if (auth.isAuthenticated) navigate('/', { viewTransition: true })
  }, [auth.isAuthenticated]);

  return (
    <Background
      className={classes.background}
    >
      <Flex pos='relative'>
        <Paper className={classes.details} shadow='xl' radius='xl'>
          <Stack p='xl' justify='space-between' h="100%">
            <Stack gap={0}>
              <Logo mb='lg' size={60} />
              <Text fz={28} ff='heading'>Welcome back</Text>
              <Text c='dimmed'>A world of data collection awaits</Text>
            </Stack>
            <Group mt='xl' pb='lg' justify='space-between' align='center'>
              <Button
                loading={auth.isLoading || auth.isAuthenticated}
                id='signIn'
                color='rust'
                leftSection={<Image width={16} height={16} src={logoAla} />}
                onClick={() => auth.signinRedirect()}
              >
                Sign in with ALA
              </Button>
              <AssistButtons />
            </Group>
          </Stack>
        </Paper>
        <div className={classes.wrapper}>
          <div className={`${classes.blur} ${auth.isLoading ? classes.in : ''}`}></div>
          <Image pos='relative' className={classes.feature} radius='xl' h="100%" src={splash} />
          <Paper className={classes.card} radius='xl' p='xl' shadow='xl'>
            <Stack h="100%" align='center' justify='center' gap='xs' pb='sm' miw={240}>
              <Logo size={75} />
              <Stack gap={0} align='center' mb='sm'>
                <Title order={2}>BioCollect</Title>
                <Text size='sm' c='dimmed'>
                  Citizen Science Projects
                </Text>
              </Stack>
              <Stack gap='lg'>
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
                <AssistButtons />
              </Stack>
            </Stack>
          </Paper>
        </div>
      </Flex>
    </Background >
  )
}
