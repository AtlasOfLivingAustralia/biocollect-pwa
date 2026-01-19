import {
  Box,
  Text,
  Group,
  Code,
  Title,
  Button,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useAuth } from 'react-oidc-context';
import { useContext, useState } from 'react';
import { APIContext } from 'helpers/api';
import { useLiveQuery } from 'dexie-react-hooks';

const getStoredState = () => {
  const [storeKey, storeState] = Object.entries(localStorage).find(([key]) =>
    key.startsWith('oidc.user')
  ) || [null, null];

  // If a user exists in the store, return the parsed JSON, otherwise return null
  return [storeKey, JSON.parse(storeState || '{}')];
};

const expireToken = () => {
  const [key, state] = getStoredState();
  localStorage.setItem(
    key,
    JSON.stringify({
      ...state,
      expires_at: Math.floor(Date.now() / 1000) + 2,
    })
  );
};

export function Debug() {
  const clipboard = useClipboard({ timeout: 1000 });
  const auth = useAuth();
  const api = useContext(APIContext);

  const projects = useLiveQuery(
    async () => await api.db.projects.limit(1).toArray()
  );

  return (
    <Box p="xl">
      <Title mb="sm">Authentication</Title>
      <Group mb="sm" gap="sm">
        <Button onClick={expireToken}>Expire Tokens</Button>
        <Button onClick={() => clipboard.copy(auth.user?.access_token)}>
          Copy Access Token
        </Button>
        {clipboard.copied && <Text>Copied</Text>}
      </Group>
      <Code block>{JSON.stringify(auth.user, null, 2)}</Code>
      <Title mb="sm" mt="xl">
        API Configuration
      </Title>
      <Code block>{JSON.stringify(import.meta.env, null, 2)}</Code>
      <Title mb="sm" mt="xl">
        IndexedDB
      </Title>
      <Code block>{JSON.stringify(projects, null, 2)}</Code>
    </Box>
  );
}
