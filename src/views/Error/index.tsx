import { Center, Code, Stack, Text, Title } from '@mantine/core';
import { useRouteError } from 'react-router-dom';
import Logger from 'helpers/logger';

export function Error() {
  const error = useRouteError() as Error;
  Logger.error(error);
  return (
    <Center w="100vw" h="100vh">
      <Stack align="center">
        <Title>An error occurred</Title>
        <Text>{error.message}</Text>
        <Code mt="lg" block>
          {error.stack}
        </Code>
      </Stack>
    </Center>
  );
}
