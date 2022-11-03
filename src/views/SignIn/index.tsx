import { Button } from '@mantine/core';
import { useAuth } from 'react-oidc-context';

export default function SignIn() {
  const auth = useAuth();
  return <Button onClick={() => auth.signinRedirect()}>Sign In</Button>;
}
