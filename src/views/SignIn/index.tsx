import { Background } from '#/components';
import {
  Button,
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
      semiTransparent
      className={classes.background}
    >
      <div className={`${classes.blur} ${auth.isLoading ? classes.in : ''}`}></div>
      <Paper className={classes.card} radius='xl' p='xl' shadow='xl'>
        <Stack align='center' gap='xs' miw={275}>
          <Image w={64} h={64} src={isDark ? logoLight : logoDark} />
          <Stack gap={0} align='center'>
            <Title order={2}>BioCollect</Title>
            <Text size='sm' c='dimmed'>
              Citizen Science Projects
            </Text>
          </Stack>
          <Button
            loading={auth.isLoading}
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
    </Background>
  )
}
