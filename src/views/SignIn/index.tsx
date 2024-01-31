import {
  Button,
  Divider,
  Group,
  Image,
  Paper,
  Space,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Background } from 'components';
import { useAuth } from 'react-oidc-context';

import logoDark from '/assets/logo-dark-64x64.png';
import logoLight from '/assets/logo-light-64x64.png';
import logoAla from '/assets/logo-ala-white.png';
import { Wave } from 'components/Wave';

export function SignIn() {
  const auth = useAuth();
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return mobile ? (
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
      <Paper p="xl" radius={0} w="100%" shadow="md">
        <Stack align="center" spacing="xs" miw={275}>
          <Image
            width={64}
            height={64}
            src={theme.colorScheme === 'dark' ? logoLight : logoDark}
          />
          <Stack spacing={0} align="center">
            <Title order={2}>BioCollect</Title>
            <Text size="sm" color="dimmed">
              Citizen Science Projects
            </Text>
          </Stack>
          <Divider my="sm" w="100%" opacity={0.6} />
          <Button
            leftIcon={<Image width={16} height={16} src={logoAla} />}
            onClick={() => auth.signinRedirect()}
          >
            Sign in with ALA
          </Button>
        </Stack>
      </Paper>
    </Background>
  ) : (
    <Background
      semiTransparent
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Paper h="100%" py="xl" pl="xl" pr="xs" radius={0}>
        <Stack spacing="xs" miw={250}>
          <Group>
            <Image
              width={64}
              height={64}
              src={theme.colorScheme === 'dark' ? logoLight : logoDark}
            />
            <Stack spacing={0}>
              <Title order={2}>BioCollect</Title>
              <Text size="sm" color="dimmed">
                Citizen Science Projects
              </Text>
            </Stack>
          </Group>
          <Space h={45} />
          <Button
            leftIcon={<Image width={16} height={16} src={logoAla} />}
            onClick={() => auth.signinRedirect()}
            fullWidth
          >
            Sign in with ALA
          </Button>
        </Stack>
      </Paper>
      <Wave
        preserveAspectRatio="none"
        vertical
        style={{
          height: '100%',
          width: 125,
          transform: 'scaleY(-100%)',
          marginLeft: -2,
        }}
        waveType="lessSimple"
      />
    </Background>
  );
}
