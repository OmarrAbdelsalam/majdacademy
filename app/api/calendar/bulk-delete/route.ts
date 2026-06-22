import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getValidGoogleToken } from '../../../../lib/googleAuth';

const TEACHER_EMAIL = 'abuhashemmajd@gmail.com';

export async function POST(request: Request) {
  try {
    const { eventIds } = await request.json();
    
    if (!eventIds || !Array.isArray(eventIds)) {
      return NextResponse.json({ error: 'Invalid eventIds' }, { status: 400 });
    }

    let authClient = null;
    try {
      authClient = await getValidGoogleToken(TEACHER_EMAIL);
    } catch (e) {
      return NextResponse.json({ error: 'Google Calendar not connected' }, { status: 400 });
    }

    if (!authClient) {
      return NextResponse.json({ error: 'Google Auth failed' }, { status: 401 });
    }

    const calendar = google.calendar({ version: 'v3', auth: authClient });

    let successCount = 0;
    for (const eventId of eventIds) {
      try {
        await calendar.events.delete({
          calendarId: 'primary',
          eventId: eventId,
          sendUpdates: 'none',
        });
        successCount++;
      } catch (e) {
        console.warn(`Failed to delete event ${eventId}`, e);
      }
    }

    return NextResponse.json({ success: true, deletedCount: successCount });
  } catch (error: any) {
    console.error('Bulk delete calendar error:', error);
    return NextResponse.json({ error: error.message || 'Failed to bulk delete' }, { status: 500 });
  }
}
