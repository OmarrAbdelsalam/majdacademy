import { NextResponse } from 'next/server';
import { createOAuthClient } from '../../../../../lib/google';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Google OAuth Error:', error);
    return NextResponse.redirect(new URL('/ar/dashboard/settings?error=oauth_rejected', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/ar/dashboard/settings?error=no_code', request.url));
  }

  try {
    // Use the same redirect URI (derived from this request's origin) that was
    // used to start the flow, otherwise Google rejects the token exchange.
    const oauthClient = createOAuthClient(origin);

    // Exchange the authorization code for an access token and a refresh token
    const { tokens } = await oauthClient.getToken(code);
    
    // We need to associate this token with the admin/teacher.
    // Since this is for a single teacher, we can hardcode an email or use a placeholder
    // In a real app with Supabase Auth, you would get the logged-in user's email.
    const adminEmail = 'abuhashemmajd@gmail.com';

    // Save tokens to Supabase
    // If the teacher already exists, update their tokens. Otherwise, insert.
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { error: dbError } = await supabase
      .from('teacher_settings')
      .upsert({ 
        email: adminEmail, 
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
        google_token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      }, { onConflict: 'email' });

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      return NextResponse.redirect(new URL('/ar/dashboard/settings?error=db_save_failed', request.url));
    }

    // Success! Redirect back to dashboard settings
    return NextResponse.redirect(new URL('/ar/dashboard/settings?success=google_connected', request.url));

  } catch (err) {
    console.error('Error exchanging Google token:', err);
    return NextResponse.redirect(new URL('/ar/dashboard/settings?error=token_exchange_failed', request.url));
  }
}
