import type { User } from 'oidc-client-ts';
import { hasAuthParams } from 'react-oidc-context';

export function handleSignIn(user?: User) {
  const params = new URLSearchParams(window.location.search);

  console.log('[Main] onSignInCallback', user);

  if (hasAuthParams(window.location)) {
    params.delete('code');
    params.delete('state');

    // Remove the auth code & state variables from the history
    window.history.replaceState(
      {},
      document.title,
      window.location.origin + window.location.pathname + params.toString(),
    );
  } else {
    console.log('[Main] onSigninCallback', 'No auth params in location!');
  }
}
