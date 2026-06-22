import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { addDays, parseISO, format, isAfter } from 'date-fns';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body = await request.json();
    
    const { sessions_count, start_date } = body;

    if (!sessions_count || !start_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch subscriber to get session rules
    const { data: subscriber, error: subError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('id', id)
      .single();

    if (subError) throw subError;
    if (!subscriber) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });

    // 2. Determine last session number
    const { data: lastSessionData, error: lastSessionError } = await supabase
      .from('sessions')
      .select('session_number')
      .eq('subscriber_id', id)
      .order('session_number', { ascending: false })
      .limit(1);

    if (lastSessionError) throw lastSessionError;
    
    let nextSessionNumber = 1;
    if (lastSessionData && lastSessionData.length > 0) {
      nextSessionNumber = lastSessionData[0].session_number + 1;
    }

    // 3. Generate new sessions
    const generatedSessions = [];
    const sessionDays = subscriber.session_days || [];
    const preferredTime = subscriber.preferred_time || '16:00';
    const sessionDuration = subscriber.session_duration || 60;

    let currentDate = parseISO(start_date);
    let sessionsCreated = 0;
    
    // Sort days just to be safe
    const sortedDays = [...sessionDays].sort((a, b) => a - b);
    let maxLoops = 365; 
    let loops = 0;

    // If session_days is empty, we just add them consecutively? 
    // Usually they have session_days. If not, default to consecutive days
    const useDays = sortedDays.length > 0 ? sortedDays : [0,1,2,3,4,5,6];

    while (sessionsCreated < sessions_count && loops < maxLoops) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
      
      if (useDays.includes(dayOfWeek)) {
        generatedSessions.push({
          subscriber_id: subscriber.id,
          session_number: nextSessionNumber,
          scheduled_date: format(currentDate, 'yyyy-MM-dd'),
          scheduled_time: preferredTime,
          duration_minutes: sessionDuration,
          status: 'scheduled'
        });
        sessionsCreated++;
        nextSessionNumber++;
      }
      
      currentDate = addDays(currentDate, 1);
      loops++;
    }

    // 4. Update end_date of subscriber
    let lastSessionDate = start_date;
    if (generatedSessions.length > 0) {
      lastSessionDate = generatedSessions[generatedSessions.length - 1].scheduled_date;
      await supabase
        .from('subscribers')
        .update({ end_date: lastSessionDate })
        .eq('id', subscriber.id);
    }

    // 5. Insert all generated sessions
    if (generatedSessions.length > 0) {
      const { error: sessionsError } = await supabase
        .from('sessions')
        .insert(generatedSessions);
        
      if (sessionsError) {
        throw sessionsError;
      }
    }

    return NextResponse.json({ success: true, generated_count: generatedSessions.length });
  } catch (error: any) {
    console.error('Renew subscriber error:', error);
    return NextResponse.json({ error: error.message || 'Failed to renew subscriber' }, { status: 500 });
  }
}
