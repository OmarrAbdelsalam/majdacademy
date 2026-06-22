import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type') || 'all'; // all | subscribers | bookings
    const range = searchParams.get('range') || 'all'; // today | week | all

    const today = format(new Date(), 'yyyy-MM-dd');
    const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 6 }), 'yyyy-MM-dd');
    const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 6 }), 'yyyy-MM-dd');

    const results: any[] = [];

    // Fetch subscriber sessions
    if (type === 'all' || type === 'subscribers') {
      let sessionsQuery = supabase
        .from('sessions')
        .select(`
          id,
          session_number,
          scheduled_date,
          scheduled_time,
          duration_minutes,
          status,
          meet_link,
          subscriber:subscribers (
            id,
            student_name,
            student_phone,
            subject,
            curriculum,
            grade,
            package_sessions
          )
        `)
        .in('status', ['scheduled'])
        .order('scheduled_date', { ascending: true });

      if (range === 'today') {
        sessionsQuery = sessionsQuery.eq('scheduled_date', today);
      } else if (range === 'week') {
        sessionsQuery = sessionsQuery.gte('scheduled_date', weekStart).lte('scheduled_date', weekEnd);
      } else {
        sessionsQuery = sessionsQuery.gte('scheduled_date', today);
      }

      const { data: sessions } = await sessionsQuery;

      if (sessions) {
        for (const s of sessions) {
          const sub = s.subscriber as any;
          if (!sub) continue;
          results.push({
            id: s.id,
            type: 'subscriber',
            student_name: sub.student_name,
            student_phone: sub.student_phone,
            date: s.scheduled_date,
            time: s.scheduled_time || '16:00',
            duration_minutes: s.duration_minutes || 60,
            subject: sub.subject,
            curriculum: sub.curriculum,
            grade: sub.grade,
            status: s.status,
            subscriber_id: sub.id,
            session_number: s.session_number,
            package_sessions: sub.package_sessions,
            meet_link: s.meet_link,
          });
        }
      }
    }

    // Fetch free trial bookings
    if (type === 'all' || type === 'bookings') {
      let bookingsQuery = supabase
        .from('bookings')
        .select('*')
        .in('status', ['confirmed'])
        .order('start_time', { ascending: true });

      if (range === 'today') {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        bookingsQuery = bookingsQuery
          .gte('start_time', todayStart.toISOString())
          .lte('start_time', todayEnd.toISOString());
      } else if (range === 'week') {
        const ws = new Date(weekStart + 'T00:00:00');
        const we = new Date(weekEnd + 'T23:59:59');
        bookingsQuery = bookingsQuery
          .gte('start_time', ws.toISOString())
          .lte('start_time', we.toISOString());
      } else {
        bookingsQuery = bookingsQuery.gte('start_time', new Date().toISOString());
      }

      const { data: bookings } = await bookingsQuery;

      if (bookings) {
        for (const b of bookings) {
          const startDate = new Date(b.start_time);
          results.push({
            id: b.id,
            type: 'booking',
            student_name: b.student_name,
            student_phone: b.student_phone,
            date: format(startDate, 'yyyy-MM-dd'),
            time: format(startDate, 'HH:mm'),
            duration_minutes: 60,
            subject: b.subject,
            curriculum: b.curriculum,
            grade: b.grade || b.child_age,
            status: 'confirmed',
          });
        }
      }
    }

    // Sort by date and time
    results.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Schedule fetch error:', error);
    return NextResponse.json(
      { error: (error as any).message || 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}
