import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Build the OAuth callback redirect URI. Prefer the actual request origin so the
// flow works on any domain (localhost, Vercel, custom domain) without relying on
// an env var. Falls back to NEXT_PUBLIC_APP_URL, then localhost for dev.
export function getRedirectUri(origin?: string) {
  const base =
    origin ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/api/oauth/google/callback`;
}

// Create a fresh OAuth2 client bound to a specific redirect URI. Use this for the
// authorization + token-exchange flow so the redirect URI matches the live domain.
export function createOAuthClient(origin?: string) {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, getRedirectUri(origin));
}

// Shared singleton — used for token refresh where the redirect URI is irrelevant.
export const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  getRedirectUri()
);

// Scopes required for the application
export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly', // Read events (free/busy)
  'https://www.googleapis.com/auth/calendar.events',   // Create/modify events
];
