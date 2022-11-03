import { Box, Text, Group, Code, Title, Button } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useAuth } from 'react-oidc-context';
import config from 'helpers/config';

export default function Debug() {
  const clipboard = useClipboard({ timeout: 1000 });
  const auth = useAuth();
  return (
    <Box p="xl">
      <Title mb="sm">Authentication</Title>
      <Group mb="sm" spacing="sm">
        <Button onClick={() => clipboard.copy(auth.user?.access_token)}>
          Copy Access Token
        </Button>
        {clipboard.copied && <Text>Copied</Text>}
      </Group>
      <Code block>{JSON.stringify(auth.user, null, 2)}</Code>
      <Title mb="sm" mt="xl">
        API Configuration
      </Title>
      <Code block>{JSON.stringify(config, null, 2)}</Code>
    </Box>
  );
}
