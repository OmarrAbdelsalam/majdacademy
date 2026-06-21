import { oauth2Client } from './google';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function getValidGoogleToken(adminEmail: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: teacher, error } = await supabase
    .from('teacher_settings')
    .select('*')
    .eq('email', adminEmail)
    .single();

  if (error || !teacher) {
    throw new Error('Teacher settings not found');
  }

  if (!teacher.google_access_token) {
    throw new Error('Google Calendar not connected');
  }

  oauth2Client.setCredentials({
    access_token: teacher.google_access_token,
    refresh_token: teacher.google_refresh_token,
  });

  // Check if token is expired or expires in less than 5 minutes
  const expiryDate = teacher.google_token_expiry ? new Date(teacher.google_token_expiry).getTime() : 0;
  const now = Date.now();

  if (expiryDate < now + 5 * 60 * 1000) {
    if (!teacher.google_refresh_token) {
      throw new Error('No refresh token available to renew access token');
    }

    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);

      // Save the new tokens
      await supabase
        .from('teacher_settings')
        .update({
          google_access_token: credentials.access_token,
          google_refresh_token: credentials.refresh_token || teacher.google_refresh_token, // Sometimes refresh token is not returned again
          google_token_expiry: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null,
        })
        .eq('email', adminEmail);
        
      return oauth2Client;
    } catch (refreshError) {
      console.error('Error refreshing token:', refreshError);
      throw new Error('Failed to refresh Google token');
    }
  }

  return oauth2Client;
}
