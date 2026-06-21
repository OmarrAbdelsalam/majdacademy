import { NextResponse } from 'next/server';
import { oauth2Client, SCOPES } from '../../../../lib/google';

export async function GET() {
  // Generate a url that asks permissions for Google Calendar scopes
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'offline' gets us a refresh token
    access_type: 'offline',
    // Always prompt for consent so we definitely get a refresh token
    prompt: 'consent',
    scope: SCOPES,
  });

  // Redirect the user to Google's consent screen
  return NextResponse.redirect(authorizationUrl);
}
