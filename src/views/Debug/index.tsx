import { Box, Text, Group, Code, Title, Button } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useAuth } from 'react-oidc-context';
import { Frame } from 'components';
import { useContext } from 'react';
import { APIContext } from 'helpers/api';
import { useLiveQuery } from 'dexie-react-hooks';

export function Debug() {
  const clipboard = useClipboard({ timeout: 1000 });
  const auth = useAuth();
  const api = useContext(APIContext);

  const projects = useLiveQuery(async () => await api.db.projects.toArray());

  const addTestRecord = async () => {
    const project = await api.biocollect.getProject(
      'd8865842-c231-4cc8-aab9-2fbc05c19905'
    );
    if (project) {
      await api.db.projects.add(project);
    }
  };

  const clearTestRecords = async () => {
    await api.db.projects.clear();
  };

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
      <Code block>{JSON.stringify(import.meta.env, null, 2)}</Code>
      {/* <Title mb="sm" mt="xl">
        Frame Test
      </Title>
      <Frame
        baseUrl="https://biocollect-test.ala.org.au"
        src="https://biocollect-test.ala.org.au/ala/bioActivity/mobileCreate/52b87cdc-3524-412a-a5a6-3a1438f02bfa"
      /> */}
      <Title mb="sm" mt="xl">
        IndexedDB
      </Title>
      <Group mb="sm">
        <Button onClick={addTestRecord}>Add test record</Button>
        <Button onClick={clearTestRecords}>Clear test records</Button>
      </Group>
      <Code block>{JSON.stringify(projects, null, 2)}</Code>
    </Box>
  );
}
