import { Box, Button, Code, Group, Text, Title } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from 'react-oidc-context';


import { dexie } from '#/helpers/api/dexie';
import { handleRefresh } from '#/helpers/auth/handleRefresh';

export function Debug() {
  const clipboard = useClipboard({ timeout: 1000 });
  const auth = useAuth();

  const projects = useLiveQuery(async () => await dexie.projects.limit(1).toArray());

  return (
    <Box p='xl'>
      <Title mb='sm'>Authentication</Title>
      <Group mb='sm' gap='sm'>
        <Button onClick={handleRefresh}>Refresh tokens</Button>
        <Button onClick={() => clipboard.copy(auth.user?.access_token)}>Copy Access Token</Button>
        <Text>Expires at {new Date((auth.user?.expires_at || 0) * 1000).toLocaleString()}</Text>
        {clipboard.copied && <Text>Copied</Text>}
      </Group>
      <Code block>{JSON.stringify(auth.user, null, 2)}</Code>
      <Title mb='sm' mt='xl'>
        API Configuration
      </Title>
      <Code block>{JSON.stringify(import.meta.env, null, 2)}</Code>
      <Title mb='sm' mt='xl'>
        IndexedDB
      </Title>
      <Code block>{JSON.stringify(projects, null, 2)}</Code>
    </Box>
  );
}
