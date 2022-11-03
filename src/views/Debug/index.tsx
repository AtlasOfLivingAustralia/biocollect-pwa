import { Container, Code, Title } from '@mantine/core';
import { useAuth } from 'react-oidc-context';

export default function Debug() {
  const auth = useAuth();
  return (
    <Container py="xl">
      <Title mb="sm">Authentication</Title>
      <Code block>{JSON.stringify(auth.user, null, 2)}</Code>
    </Container>
  );
}
