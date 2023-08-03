import { Center, Code, Stack, Text, Title } from '@mantine/core';
import { useRouteError } from 'react-router-dom';

export function Error() {
  const error = useRouteError() as Error;

  console.error(error);

  return (
    <Center w="100vw" h="100vh">
      <Stack align="center">
        <Title>An error occurred</Title>
        {error.message && <Text>{error.message}</Text>}
        <Code mt="lg" block>
          {error.stack || JSON.stringify(error, null, 2)}
        </Code>
      </Stack>
    </Center>
  );
}
