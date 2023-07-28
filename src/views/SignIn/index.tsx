import { Button, Divider, Image, Paper, Stack, Title } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { Background } from 'components';
import { useAuth } from 'react-oidc-context';

import logoDark from '/assets/logo-dark-64x64.png';
import logoLight from '/assets/logo-light-64x64.png';
import logoAla from '/assets/logo-ala-white.png';

export function SignIn() {
  const colorScheme = useColorScheme();
  const auth = useAuth();

  return (
    <Background
      semiTransparent
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Paper p="xl" shadow="lg" radius="lg" withBorder>
        <Stack align="center" spacing="xs" miw={275}>
          <Image
            width={64}
            height={64}
            src={colorScheme === 'dark' ? logoLight : logoDark}
          />
          <Title order={2}>BioCollect</Title>
          <Divider my="sm" w="100%" opacity={0.6} />
          <Button
            leftIcon={<Image width={16} height={16} src={logoAla} />}
            onClick={() => auth.signinRedirect()}
            fullWidth
          >
            Sign in with ALA
          </Button>
        </Stack>
      </Paper>
    </Background>
  );
}
