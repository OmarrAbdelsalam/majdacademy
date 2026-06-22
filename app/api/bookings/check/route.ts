import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getValidGoogleToken } from '../../../../lib/googleAuth';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { nextDay, addHours, isBefore, isAfter, format } from 'date-fns';
import { toDate } from 'date-fns-tz';

const TEACHER_EMAIL = 'abuhashemmajd@gmail.com';
const TIMEZONE = 'Asia/Dubai';

const dayNameToNumber: Record<string, 0|1|2|3|4|5|6> = {
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { selectedDay, blockStartHour, blockEndHour } = body;

    if (!selectedDay || blockStartHour == null || blockEndHour == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dayNumber = dayNameToNumber[selectedDay.toLowerCase()];
    if (dayNumber === undefined) {
      return NextResponse.json({ error: 'Invalid day selected' }, { status: 400 });
    }

    const now = new Date();
    let targetDate = nextDay(now, dayNumber);
    
    const targetDateStr = format(targetDate, 'yyyy-MM-dd');
    const boundsStart = toDate(`${targetDateStr}T${blockStartHour.toString().padStart(2, '0')}:00:00`, { timeZone: TIMEZONE });
    const boundsEnd = toDate(`${targetDateStr}T${blockEndHour.toString().padStart(2, '0')}:00:00`, { timeZone: TIMEZONE });

    let authClient = null;
    try {
      authClient = await getValidGoogleToken(TEACHER_EMAIL);
    } catch (e) {
      console.warn("Google Calendar not connected, skipping calendar event creation.");
    }

    let busyPeriods: { start: string, end: string }[] = [];

    // 1. Fetch busy periods from Google Calendar
    if (authClient) {
      const calendar = google.calendar({ version: 'v3', auth: authClient });
      const freeBusyResponse = await calendar.freebusy.query({
        requestBody: {
          timeMin: boundsStart.toISOString(),
          timeMax: boundsEnd.toISOString(),
          timeZone: TIMEZONE,
          items: [{ id: 'primary' }]
        }
      });
      const calBusy = freeBusyResponse.data.calendars?.primary?.busy || [];
      busyPeriods.push(...calBusy.map(b => ({ start: b.start as string, end: b.end as string })));
    }

    // 2. Fetch busy periods from Supabase Database
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: dbBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('start_time, end_time')
      .gte('start_time', boundsStart.toISOString())
      .lt('start_time', boundsEnd.toISOString())
      .in('status', ['confirmed']);

    if (dbBookings && !fetchError) {
      busyPeriods.push(...dbBookings.map(b => ({ start: b.start_time, end: b.end_time })));
    }

    // 3. Find the first available 1-hour slot in this block
    let foundSlotStart: Date | null = null;
    let foundSlotEnd: Date | null = null;
    
    let currentCheckStart = boundsStart;
    
    while (isBefore(currentCheckStart, boundsEnd)) {
      const currentCheckEnd = addHours(currentCheckStart, 1);
      if (isAfter(currentCheckEnd, boundsEnd)) break;

      const isOverlapping = busyPeriods.some(busy => {
        if (!busy.start || !busy.end) return false;
        const bStart = new Date(busy.start);
        const bEnd = new Date(busy.end);
        return isBefore(currentCheckStart, bEnd) && isAfter(currentCheckEnd, bStart);
      });

      if (!isOverlapping) {
        foundSlotStart = currentCheckStart;
        foundSlotEnd = currentCheckEnd;
        break;
      }

      currentCheckStart = addHours(currentCheckStart, 1);
    }

    if (!foundSlotStart || !foundSlotEnd) {
      return NextResponse.json({ 
        error: 'عذراً، هذا الوقت ممتلئ بالكامل في التقويم، يرجى اختيار فترة أو يوم آخر.' 
      }, { status: 409 });
    }

    return NextResponse.json({ success: true, availableSlotStart: foundSlotStart.toISOString() });

  } catch (error) {
    console.error('Check Availability Error:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}
