import { Background } from '#/components';
import {
  Button,
  Card,
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

export function SignIn() {
  const auth = useAuth();
  const isDark = useComputedColorScheme() === 'dark';

  return (
    <Background
      semiTransparent
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        padding: 32,
        zIndex: -1,
        position: 'relative'
      }}
    >
      <Paper className={`${classes.card} ${auth.isLoading ? classes.in : ''}`} radius='xl' p='xl' shadow='xl'>
        <Stack style={{ zIndex: 10 }} align='center' gap='xs' miw={275}>
          <Image w={64} h={64} src={isDark ? logoLight : logoDark} />
          <Stack gap={0} align='center'>
            <Title order={2}>BioCollect</Title>
            <Text size='sm' c='dimmed'>
              Citizen Science Projects
            </Text>
          </Stack>
          <Button
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
