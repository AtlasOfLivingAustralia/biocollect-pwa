import { Button, Center, Code, Stack, Text, Title } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import { useEffect } from 'react';
import { isRouteErrorResponse, Link, useRouteError, type ErrorResponse } from 'react-router';

export function ErrorView() {
  const error = useRouteError() as Error;

  // Log errors to the console
  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  if (isRouteErrorResponse(error) && (error as ErrorResponse).status === 404) {
    return (
      <Center w='100vw' h='100vh'>
        <Stack align='center'>
          <Title>404</Title>
          <Text>The requested page could not be found</Text>
          <Button mt='lg' leftSection={<IconArrowBack />} component={Link} to='/'>
            Go home
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <Center w='100vw' h='100vh'>
      <Stack align='center'>
        <Title>An error occurred</Title>
        {error.message && <Text>{error.message}</Text>}
        <Code mt='lg' block>
          {error.stack || JSON.stringify(error, null, 2)}
        </Code>
      </Stack>
    </Center>
  );
}
