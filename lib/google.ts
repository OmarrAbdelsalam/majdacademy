import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// Fallback to localhost for development if not provided
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/google/callback` 
  : 'http://localhost:3000/api/oauth/google/callback';

export const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Scopes required for the application
export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly', // Read events (free/busy)
  'https://www.googleapis.com/auth/calendar.events',   // Create/modify events
];
