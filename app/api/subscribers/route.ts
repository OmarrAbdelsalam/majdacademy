import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { addDays, parseISO, format, isAfter } from 'date-fns';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = supabase
      .from('subscribers')
      .select(`
        *,
        sessions (
          id,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`student_name.ilike.%${search}%,student_phone.ilike.%${search}%`);
    }

    const { data: subscribers, error } = await query;

    if (error) throw error;

    const formattedData = subscribers.map((sub: any) => {
      const sessions = sub.sessions || [];
      const completedSessions = sessions.filter((s: any) => s.status === 'completed').length;
      
      const { sessions: _, ...subData } = sub;
      
      return {
        ...subData,
        completed_sessions: completedSessions,
        total_sessions: sub.package_sessions,
      };
    });

    return NextResponse.json({ data: formattedData });
  } catch (error: any) {
    console.error('Fetch subscribers error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body = await request.json();

    const {
      student_name, student_email, student_phone, parent_phone,
      child_age, grade, curriculum, subject, course_type,
      package_sessions, package_price, session_days, preferred_time, session_duration,
      start_date, source, booking_id, notes
    } = body;

    // 1. Insert subscriber
    const { data: subscriber, error: subError } = await supabase
      .from('subscribers')
      .insert({
        student_name, student_email, student_phone, parent_phone,
        child_age, grade, curriculum, subject, course_type,
        package_sessions, package_price, session_days, preferred_time, session_duration: session_duration || 60,
        start_date, source: source || 'manual', booking_id, notes,
        status: 'active'
      })
      .select()
      .single();

    if (subError) throw subError;

    // 1b. Mark the originating booking as converted so it no longer
    //     appears in the quick-add list or the trial schedule.
    if (booking_id) {
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'converted' })
        .eq('id', booking_id);

      if (bookingError) {
        console.error('Error marking booking as converted:', bookingError);
        // Don't throw — the subscriber was created successfully.
      }
    }

    // 2. Generate sessions
    const generatedSessions = [];
    if (session_days && session_days.length > 0 && package_sessions > 0) {
      let currentDate = parseISO(start_date);
      let sessionsCreated = 0;
      let sessionNumber = 1;
      
      // Sort days just to be safe
      const sortedDays = [...session_days].sort((a, b) => a - b);

      // Failsafe to prevent infinite loops (e.g. if looking for 100 sessions)
      let maxLoops = 365; 
      let loops = 0;

      while (sessionsCreated < package_sessions && loops < maxLoops) {
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
        
        if (sortedDays.includes(dayOfWeek)) {
          generatedSessions.push({
            subscriber_id: subscriber.id,
            session_number: sessionNumber,
            scheduled_date: format(currentDate, 'yyyy-MM-dd'),
            scheduled_time: preferred_time || '16:00',
            duration_minutes: session_duration || 60,
            status: 'scheduled'
          });
          sessionsCreated++;
          sessionNumber++;
        }
        
        currentDate = addDays(currentDate, 1);
        loops++;
      }

      // Calculate end_date based on last generated session
      if (generatedSessions.length > 0) {
        const lastSessionDate = generatedSessions[generatedSessions.length - 1].scheduled_date;
        await supabase
          .from('subscribers')
          .update({ end_date: lastSessionDate })
          .eq('id', subscriber.id);
          
        subscriber.end_date = lastSessionDate;
      }

      // Insert all generated sessions
      if (generatedSessions.length > 0) {
        const { error: sessionsError } = await supabase
          .from('sessions')
          .insert(generatedSessions);
          
        if (sessionsError) {
          console.error('Error creating sessions:', sessionsError);
          // Don't throw, we created the subscriber at least
        }
      }
    }

    return NextResponse.json({ data: { ...subscriber, sessions_generated: generatedSessions.length } });
  } catch (error: any) {
    console.error('Create subscriber error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create subscriber' }, { status: 500 });
  }
}
