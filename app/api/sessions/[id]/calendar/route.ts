import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getValidGoogleToken } from '../../../../../lib/googleAuth';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { toDate } from 'date-fns-tz';

const TEACHER_EMAIL = 'abuhashemmajd@gmail.com';
const TIMEZONE = 'Asia/Dubai';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Fetch Session and Subscriber
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*, subscribers(*)')
      .eq('id', id)
      .single();

    if (sessionError) throw sessionError;
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    if (session.google_event_id) {
      return NextResponse.json({ success: true, message: 'Event already exists', meetLink: session.meet_link });
    }

    const subscriber = session.subscribers;

    // 2. Setup Google Calendar Client
    let authClient = null;
    try {
      authClient = await getValidGoogleToken(TEACHER_EMAIL);
    } catch (e) {
      return NextResponse.json({ error: 'Google Calendar not connected' }, { status: 400 });
    }

    if (!authClient) {
      return NextResponse.json({ error: 'Google Calendar authentication failed' }, { status: 401 });
    }

    // 3. Create Event Data
    const startDateStr = `${session.scheduled_date}T${session.scheduled_time}:00`;
    const startDateTime = toDate(startDateStr, { timeZone: TIMEZONE });
    const endDateTime = new Date(startDateTime.getTime() + session.duration_minutes * 60000);

    const calendar = google.calendar({ version: 'v3', auth: authClient });
    
    const event = {
      summary: `حصة أكاديمية مجد - ${subscriber.student_name} (حصة ${session.session_number})`,
      description: `
اسم الطالب: ${subscriber.student_name}
رقم الهاتف: ${subscriber.student_phone || 'غير محدد'}
باقة المشترك: ${subscriber.package_sessions} حصص
نوع الحصة: ${subscriber.course_type || 'غير محدد'}
المادة: ${subscriber.subject || 'غير محدد'}

رقم الحصة: ${session.session_number}
      `,
      start: { dateTime: startDateTime.toISOString(), timeZone: TIMEZONE },
      end: { dateTime: endDateTime.toISOString(), timeZone: TIMEZONE },
      attendees: subscriber.student_email && !subscriber.student_email.includes('@placeholder.com') ? [{ email: subscriber.student_email }] : [],
      conferenceData: {
        createRequest: {
          requestId: `majd-session-${session.id}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    // 4. Insert into Google Calendar
    const createdEvent = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendUpdates: subscriber.student_email ? 'all' : 'none',
      requestBody: event,
    });

    const meetLink = createdEvent.data.hangoutLink || '';
    const eventId = createdEvent.data.id || '';

    // 5. Update Session in DB
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        google_event_id: eventId,
        meet_link: meetLink
      })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, meetLink, eventId });

  } catch (error: any) {
    console.error('Calendar sync error:', error);
    return NextResponse.json({ error: error.message || 'Failed to sync to calendar' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Fetch Session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*, subscribers(*)')
      .eq('id', id)
      .single();

    if (sessionError) throw sessionError;
    if (!session || !session.google_event_id) {
      return NextResponse.json({ error: 'Session not found or not synced to calendar' }, { status: 404 });
    }

    const subscriber = session.subscribers;

    // 2. Setup Google Calendar Client
    let authClient = null;
    try {
      authClient = await getValidGoogleToken(TEACHER_EMAIL);
    } catch (e) {
      return NextResponse.json({ error: 'Google Calendar not connected' }, { status: 400 });
    }

    if (!authClient) {
      return NextResponse.json({ error: 'Google Calendar authentication failed' }, { status: 401 });
    }

    const calendar = google.calendar({ version: 'v3', auth: authClient });

    // 3. Update or Cancel Event
    if (session.status === 'carried_forward' || session.status === 'cancelled') {
      try {
        await calendar.events.delete({
          calendarId: 'primary',
          eventId: session.google_event_id,
          sendUpdates: subscriber.student_email ? 'all' : 'none',
        });
      } catch (e) {
        console.warn('Event might already be deleted', e);
      }
      
      // Clear google_event_id and meet_link from db
      await supabase
        .from('sessions')
        .update({ google_event_id: null, meet_link: null })
        .eq('id', id);

    } else if (session.status === 'postponed' || session.status === 'scheduled') {
      const startDateStr = `${session.scheduled_date}T${session.scheduled_time}:00`;
      const startDateTime = toDate(startDateStr, { timeZone: TIMEZONE });
      const endDateTime = new Date(startDateTime.getTime() + session.duration_minutes * 60000);

      await calendar.events.patch({
        calendarId: 'primary',
        eventId: session.google_event_id,
        sendUpdates: subscriber.student_email ? 'all' : 'none',
        requestBody: {
          start: { dateTime: startDateTime.toISOString(), timeZone: TIMEZONE },
          end: { dateTime: endDateTime.toISOString(), timeZone: TIMEZONE },
          summary: session.status === 'postponed' 
            ? `[مؤجلة] حصة أكاديمية مجد - ${subscriber.student_name} (حصة ${session.session_number})`
            : `حصة أكاديمية مجد - ${subscriber.student_name} (حصة ${session.session_number})`,
        }
      });

      // Mark as synced in DB notes
      if (!session.notes || !session.notes.includes('[CALENDAR_SYNCED]')) {
        const newNotes = session.notes ? `${session.notes} [CALENDAR_SYNCED]` : '[CALENDAR_SYNCED]';
        await supabase
          .from('sessions')
          .update({ notes: newNotes })
          .eq('id', id);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Calendar update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update calendar' }, { status: 500 });
  }
}
