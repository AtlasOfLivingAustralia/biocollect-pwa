/** biome-ignore-all lint/style/noNonNullAssertion: We need this to create new User objects easily  */
import { jwtDecode } from 'jwt-decode';
import { User, type IdTokenClaims } from 'oidc-client-ts';
import { isOnline } from '../funcs';
import { authConfig, userManager } from './config';

interface TokenResponse {
  id_token: string;
  access_token: string;
  expires_in: number;
  token_type: string;
}

const REFRESH_BUFFER = 1000 * 60 * 5; // 5 minutes
const EXPIRY_BUFFER = 60 * 60 * 24 * 360; // 360 days

export async function handleRefresh(): Promise<boolean> {
  const online = isOnline();
  const user = await userManager.getUser();

  // Ensure the user is logged in & has a refresh token
  if (!user || !user?.refresh_token || !user?.expires_at) {
    console.log("[Auth] Not refreshing,  user is not logged in / doesn't have a refresh token.");
    return false;
  }

  // If the user is offline, prevent token expiry
  if (!online) {
    const newUser = new User({
      ...user,
      access_token: user?.access_token!,
      token_type: user?.token_type!,
      profile: user?.profile!,
      expires_at: Math.round(Date.now() / 1000) + EXPIRY_BUFFER,
    });

    // Persist the new user in the store & re-raise the UserLoaded event
    await userManager.storeUser(newUser);
    await userManager.getUser(true);

    console.log('[Auth] Token expiry extended!');

    return true;
  }

  const url = await userManager.metadataService.getTokenEndpoint();

  // Ensure a URL was returned
  if (!url) {
    throw new Error('[Auth] Failed to fetch token endpoint!');
  }

  // Token is not expiring within the next 5 minutes, don't refresh
  if (user.expires_at * 1000 > Date.now() + REFRESH_BUFFER) {
    console.log('[Auth] Not refreshing, token not expiring in the next 5 minutes.');
    return false;
  }

  // Make the request using 'fetch' rather than axios, as axios appends the JWT to the headers automatically which we don't want
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: authConfig.client_id,
      refresh_token: user?.refresh_token,
    }).toString(),
    redirect: 'follow',
  });

  // If the request was successful, update the token in the userManager
  if (resp.ok) {
    const data = (await resp.json()) as TokenResponse;
    const profile = jwtDecode(data.id_token) as IdTokenClaims;

    // Calculate new expiry time
    const now = Math.floor(Date.now() / 1000);
    const expires_at = data.expires_in ? now + data.expires_in : undefined;

    const newUser = new User({
      access_token: data.access_token,
      token_type: data.token_type ?? 'Bearer',
      refresh_token: user.refresh_token,
      id_token: data.id_token,
      scope: user.scope,
      session_state: user.session_state ?? null,
      expires_at,
      profile,
    });

    // Persist the new user in the store & re-raise the UserLoaded event
    await userManager.storeUser(newUser);
    await userManager.getUser(true);

    return true;
  } else {
    throw new Error('[Auth] Failed to fetch new token!');
  }
}
