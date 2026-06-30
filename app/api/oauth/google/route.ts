import { NextResponse } from 'next/server';
import { createOAuthClient, SCOPES } from '../../../../lib/google';

export async function GET(request: Request) {
  // Derive the redirect URI from the live request origin so the OAuth flow
  // returns to the same domain the user is browsing (not localhost).
  const origin = new URL(request.url).origin;
  const client = createOAuthClient(origin);

  // Generate a url that asks permissions for Google Calendar scopes
  const authorizationUrl = client.generateAuthUrl({
    // 'offline' gets us a refresh token
    access_type: 'offline',
    // Always prompt for consent so we definitely get a refresh token
    prompt: 'consent',
    scope: SCOPES,
  });

  // Redirect the user to Google's consent screen
  return NextResponse.redirect(authorizationUrl);
}
