import { Button, Center, Code, Stack, Text, Title } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export function Error() {
  const error = useRouteError() as Error;

  if (isRouteErrorResponse(error) && (error as any).status === 404) {
    return (
      <Center w="100vw" h="100vh">
        <Stack align="center">
          <Title>404</Title>
          <Text>The requested page could not be found</Text>
          <Button mt="lg" leftIcon={<IconArrowBack />} component={Link} to="/">
            Go home
          </Button>
        </Stack>
      </Center>
    );
  }

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
