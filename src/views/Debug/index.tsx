import {
  Box,
  Text,
  Group,
  Code,
  Title,
  Button,
  ColorSwatch,
  ColorInput,
  useMantineTheme,
  Divider,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useAuth } from 'react-oidc-context';
import { useContext, useState } from 'react';
import { APIContext } from 'helpers/api';
import { useLiveQuery } from 'dexie-react-hooks';
import { generateShades } from 'theme';

export function Debug() {
  const clipboard = useClipboard({ timeout: 1000 });
  const auth = useAuth();
  const api = useContext(APIContext);
  const [color, setColor] = useState<string>('#e8590c');
  const theme = useMantineTheme();

  const projects = useLiveQuery(
    async () => await api.db.projects.limit(1).toArray()
  );

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
      <Code block>{JSON.stringify(projects, null, 2)}</Code>
      <Title>Colour</Title>
      <ColorInput value={color} onChange={setColor} />
      <Group>
        {generateShades(color).map((shadeColour, index) => (
          <ColorSwatch
            key={shadeColour}
            color={shadeColour}
            size={index === 7 ? 40 : undefined}
          />
        ))}
      </Group>
      <Divider my="xs" />
      <Group>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
          <ColorSwatch
            key={index}
            color={theme.colors.orange[index]}
            size={index === 7 ? 40 : undefined}
          />
        ))}
      </Group>
    </Box>
  );
}
