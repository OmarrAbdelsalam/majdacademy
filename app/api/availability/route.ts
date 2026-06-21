import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getValidGoogleToken } from '../../../lib/googleAuth';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { parseISO, addMinutes, isBefore, isAfter, startOfDay, endOfDay, getDay, format } from 'date-fns';
import { formatInTimeZone, toDate } from 'date-fns-tz';

const ADMIN_EMAIL = 'abuhashemmajd@gmail.com';
const DURATION_MINUTES = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date'); // Format: YYYY-MM-DD

  if (!dateStr) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  try {
    const authClient = await getValidGoogleToken(ADMIN_EMAIL);
    const calendar = google.calendar({ version: 'v3', auth: authClient });

    // 1. Get Teacher Settings (Working Hours & Timezone)
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data: teacher } = await supabase
      .from('teacher_settings')
      .select('working_hours, timezone')
      .eq('email', ADMIN_EMAIL)
      .single();

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher settings not found' }, { status: 404 });
    }

    const timezone = teacher.timezone || 'Asia/Qatar';
    
    // Convert the requested date string to a Date object in the teacher's timezone
    // e.g. "2023-10-15" -> start of that day in Qatar timezone
    const requestedDate = toDate(`${dateStr}T00:00:00`, { timeZone: timezone });
    const dayOfWeek = getDay(requestedDate); // 0 = Sunday, 1 = Monday...

    const workingHours = teacher.working_hours as any;
    const todayHours = workingHours?.[dayOfWeek.toString()];

    // If teacher doesn't work on this day, return empty array
    if (!todayHours || !todayHours.start || !todayHours.end) {
      return NextResponse.json({ availableSlots: [] });
    }

    // 2. Generate potential slots based on working hours
    const startStr = todayHours.start; // e.g. "09:00"
    const endStr = todayHours.end;     // e.g. "17:00"

    const dayStart = toDate(`${dateStr}T${startStr}:00`, { timeZone: timezone });
    const dayEnd = toDate(`${dateStr}T${endStr}:00`, { timeZone: timezone });

    const potentialSlots: { start: Date, end: Date }[] = [];
    let currentSlotStart = dayStart;

    while (isBefore(currentSlotStart, dayEnd) && !isAfter(addMinutes(currentSlotStart, DURATION_MINUTES), dayEnd)) {
      potentialSlots.push({
        start: currentSlotStart,
        end: addMinutes(currentSlotStart, DURATION_MINUTES)
      });
      currentSlotStart = addMinutes(currentSlotStart, DURATION_MINUTES);
    }

    // 3. Check Google Calendar for busy periods
    const timeMin = dayStart.toISOString();
    const timeMax = dayEnd.toISOString();

    const freeBusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: timezone,
        items: [{ id: 'primary' }]
      }
    });

    const busyPeriods = freeBusyResponse.data.calendars?.primary?.busy || [];

    // 4. Filter out slots that overlap with busy periods or are in the past
    const now = new Date();
    
    const availableSlots = potentialSlots.filter(slot => {
      // Must be in the future
      if (isBefore(slot.start, now)) return false;

      // Check for overlap with any busy period
      const isOverlapping = busyPeriods.some(busy => {
        if (!busy.start || !busy.end) return false;
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);

        // Overlap condition: slot.start < busyEnd AND slot.end > busyStart
        return isBefore(slot.start, busyEnd) && isAfter(slot.end, busyStart);
      });

      return !isOverlapping;
    });

    // Format output
    const formattedSlots = availableSlots.map(slot => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      formattedTime: formatInTimeZone(slot.start, timezone, 'HH:mm')
    }));

    return NextResponse.json({ availableSlots: formattedSlots, timezone });
  } catch (error: any) {
    console.error('Availability Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch availability' }, { status: 500 });
  }
}
