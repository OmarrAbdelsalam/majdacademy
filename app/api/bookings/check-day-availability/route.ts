import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getValidGoogleToken } from '../../../../lib/googleAuth';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { nextDay, addHours, isBefore, isAfter, format, addDays, getDay } from 'date-fns';
import { toDate } from 'date-fns-tz';

const TEACHER_EMAIL = 'abuhashemmajd@gmail.com';
const TIMEZONE = 'Asia/Dubai';

// Map day number (0=Sunday) to day name info
const dayNumberToInfo: Record<number, { id: string; dayAr: string; dayEn: string }> = {
  0: { id: 'sunday', dayAr: 'الأحد', dayEn: 'Sunday' },
  1: { id: 'monday', dayAr: 'الاثنين', dayEn: 'Monday' },
  2: { id: 'tuesday', dayAr: 'الثلاثاء', dayEn: 'Tuesday' },
  3: { id: 'wednesday', dayAr: 'الأربعاء', dayEn: 'Wednesday' },
  4: { id: 'thursday', dayAr: 'الخميس', dayEn: 'Thursday' },
  5: { id: 'friday', dayAr: 'الجمعة', dayEn: 'Friday' },
  6: { id: 'saturday', dayAr: 'السبت', dayEn: 'Saturday' },
};

/**
 * Splits a working hours range (e.g. 09:00-21:00) into 4-hour blocks.
 * Returns array of { id, startDubai, endDubai }
 */
function splitIntoBlocks(dayId: string, startHour: number, endHour: number) {
  const BLOCK_SIZE = 4;
  const blocks: { id: string; startDubai: number; endDubai: number }[] = [];
  let blockIndex = 1;
  let current = startHour;

  while (current < endHour) {
    const blockEnd = Math.min(current + BLOCK_SIZE, endHour);
    blocks.push({
      id: `${dayId}_b${blockIndex}`,
      startDubai: current,
      endDubai: blockEnd,
    });
    blockIndex++;
    current = blockEnd;
  }

  return blocks;
}

export async function GET() {
  try {
    const now = new Date();

    // 1. Fetch teacher settings from DB to get working hours
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: teacher } = await supabase
      .from('teacher_settings')
      .select('working_hours, timezone')
      .eq('email', TEACHER_EMAIL)
      .single();

    if (!teacher || !teacher.working_hours) {
      return NextResponse.json({ daysList: [], message: 'لا توجد مواعيد متاحة حالياً' });
    }

    const workingHours = teacher.working_hours as Record<string, { start: string; end: string }>;

    // 2. Build daysList from DB settings
    const daysList: {
      id: string;
      dayAr: string;
      dayEn: string;
      blocks: { id: string; startDubai: number; endDubai: number }[];
    }[] = [];

    for (const [dayNumStr, hours] of Object.entries(workingHours)) {
      const dayNum = parseInt(dayNumStr);
      const info = dayNumberToInfo[dayNum];
      if (!info || !hours.start || !hours.end) continue;

      const startHour = parseInt(hours.start.split(':')[0]);
      const endHour = parseInt(hours.end.split(':')[0]);
      if (startHour >= endHour) continue;

      const blocks = splitIntoBlocks(info.id, startHour, endHour);
      daysList.push({
        id: info.id,
        dayAr: info.dayAr,
        dayEn: info.dayEn,
        blocks,
      });
    }

    if (daysList.length === 0) {
      return NextResponse.json({ daysList: [], message: 'لا توجد مواعيد متاحة حالياً' });
    }

    // 3. Fetch busy periods (Google Calendar + DB bookings)
    const weekStart = toDate(format(now, 'yyyy-MM-dd') + 'T00:00:00', { timeZone: TIMEZONE });
    const weekEnd = addDays(weekStart, 14);

    let authClient = null;
    try {
      authClient = await getValidGoogleToken(TEACHER_EMAIL);
    } catch (e) {
      console.warn('Google Calendar not connected, checking Supabase only.');
    }

    let busyPeriods: { start: string; end: string }[] = [];

    if (authClient) {
      const calendar = google.calendar({ version: 'v3', auth: authClient });
      const freeBusyResponse = await calendar.freebusy.query({
        requestBody: {
          timeMin: weekStart.toISOString(),
          timeMax: weekEnd.toISOString(),
          timeZone: TIMEZONE,
          items: [{ id: 'primary' }],
        },
      });
      const calBusy = freeBusyResponse.data.calendars?.primary?.busy || [];
      busyPeriods.push(...calBusy.map(b => ({ start: b.start as string, end: b.end as string })));
    }

    const { data: dbBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('start_time, end_time')
      .gte('start_time', weekStart.toISOString())
      .lt('start_time', weekEnd.toISOString())
      .in('status', ['confirmed']);

    if (dbBookings && !fetchError) {
      busyPeriods.push(...dbBookings.map(b => ({ start: b.start_time, end: b.end_time })));
    }

    // 4. Filter blocks — remove fully booked blocks
    const dayNameToNumber: Record<string, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
    };

    const filteredDaysList = daysList.map(day => {
      const dayNumber = dayNameToNumber[day.id];
      const targetDate = nextDay(now, dayNumber);
      const targetDateStr = format(targetDate, 'yyyy-MM-dd');

      const availableBlocks = day.blocks.filter(block => {
        const blockStart = toDate(
          `${targetDateStr}T${block.startDubai.toString().padStart(2, '0')}:00:00`,
          { timeZone: TIMEZONE }
        );
        const blockEnd = toDate(
          `${targetDateStr}T${block.endDubai.toString().padStart(2, '0')}:00:00`,
          { timeZone: TIMEZONE }
        );

        // Check if at least one 1-hour slot is free in this block
        let currentCheckStart = blockStart;
        while (isBefore(currentCheckStart, blockEnd)) {
          const currentCheckEnd = addHours(currentCheckStart, 1);
          if (isAfter(currentCheckEnd, blockEnd)) break;

          const isOverlapping = busyPeriods.some(busy => {
            if (!busy.start || !busy.end) return false;
            const bStart = new Date(busy.start);
            const bEnd = new Date(busy.end);
            return isBefore(currentCheckStart, bEnd) && isAfter(currentCheckEnd, bStart);
          });

          if (!isOverlapping) return true; // at least one free slot

          currentCheckStart = addHours(currentCheckStart, 1);
        }
        return false; // all slots in this block are busy
      });

      return {
        ...day,
        blocks: availableBlocks,
      };
    });

    // Keep days even if they have 0 blocks so the frontend can show "no appointments today"
    return NextResponse.json({ daysList: filteredDaysList });
  } catch (error) {
    console.error('Check Week Availability Error:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}
