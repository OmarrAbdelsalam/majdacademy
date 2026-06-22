import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { addDays, parseISO, format } from 'date-fns';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body = await request.json();
    
    const { action } = body;

    // 1. Fetch current session to get subscriber ID and details
    const { data: session, error: fetchError } = await supabase
      .from('sessions')
      .select('*, subscriber:subscribers(id, session_days, package_sessions)')
      .eq('id', id)
      .single();

    if (fetchError || !session) {
      throw new Error('Session not found');
    }

    let result;

    if (action === 'postpone') {
      const { new_date, reason, new_time } = body;
      if (!new_date) throw new Error('New date is required for postponement');

      const updates: any = {
        status: 'postponed',
        original_date: session.original_date || session.scheduled_date,
        scheduled_date: new_date,
        postpone_reason: reason || null,
        notes: session.notes ? session.notes.replace('[CALENDAR_SYNCED]', '').trim() : null
      };

      if (new_time) {
        updates.scheduled_time = new_time;
      }

      const { data, error } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      result = data;

    } else if (action === 'carry_forward') {
      // 1. Mark current session as carried forward
      const { data: updatedSession, error: updateError } = await supabase
        .from('sessions')
        .update({ status: 'carried_forward' })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      result = updatedSession;

      // 2. Find the last session for this subscriber to determine next date
      const { data: lastSession, error: lastSessionError } = await supabase
        .from('sessions')
        .select('scheduled_date, session_number, scheduled_time, duration_minutes')
        .eq('subscriber_id', session.subscriber_id)
        .order('session_number', { ascending: false })
        .limit(1)
        .single();

      if (!lastSessionError && lastSession && session.subscriber?.session_days) {
        // Calculate next date based on session days
        let nextDate = addDays(parseISO(lastSession.scheduled_date), 1);
        const sortedDays = [...(session.subscriber.session_days as number[])].sort();
        
        let loops = 0;
        while (loops < 14) { // Max 2 weeks forward
          if (sortedDays.includes(nextDate.getDay())) {
            break;
          }
          nextDate = addDays(nextDate, 1);
          loops++;
        }

        // Create new session at the end
        await supabase
          .from('sessions')
          .insert({
            subscriber_id: session.subscriber_id,
            session_number: lastSession.session_number + 1,
            scheduled_date: format(nextDate, 'yyyy-MM-dd'),
            scheduled_time: lastSession.scheduled_time,
            duration_minutes: lastSession.duration_minutes,
            status: 'scheduled',
            carried_from_session: session.session_number
          });
      }

    } else if (action === 'complete') {
      const { data, error } = await supabase
        .from('sessions')
        .update({ status: 'completed' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      result = data;

      // Check if all sessions are completed
      const { data: allSessions } = await supabase
        .from('sessions')
        .select('status')
        .eq('subscriber_id', session.subscriber_id);
        
      if (allSessions) {
        const allCompletedOrCancelled = allSessions.every(
          s => s.status === 'completed' || s.status === 'carried_forward'
        );
        
        if (allCompletedOrCancelled) {
          await supabase
            .from('subscribers')
            .update({ status: 'completed' })
            .eq('id', session.subscriber_id);
        }
      }
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    return NextResponse.json({ data: result });
  } catch (error: any) {
    console.error(`Session action error:`, error);
    return NextResponse.json({ error: error.message || 'Failed to update session' }, { status: 500 });
  }
}
