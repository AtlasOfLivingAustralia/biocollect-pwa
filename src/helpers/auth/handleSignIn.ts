import type { User } from 'oidc-client-ts';
import { hasAuthParams } from 'react-oidc-context';

export function handleSignIn(user?: User) {
  const params = new URLSearchParams(window.location.search);

  console.log('[Main] onSignInCallback', user);

  if (hasAuthParams(window.location)) {
    params.delete('code');
    params.delete('state');

    // Remove the auth code & state variables from the history.
    // Any remaining params still need a leading '?'.
    const search = params.toString();
    const nextUrl = `${window.location.origin}${window.location.pathname}${
      search ? `?${search}` : ''
    }${window.location.hash}`;
    window.history.replaceState(window.history.state, document.title, nextUrl);
  } else {
    console.log('[Main] onSigninCallback', 'No auth params in location!');
  }
}
