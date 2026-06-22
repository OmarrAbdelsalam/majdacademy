import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Fetch subscriber
    const { data: subscriber, error: subError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('id', id)
      .single();

    if (subError) throw subError;
    if (!subscriber) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });

    // Fetch sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .eq('subscriber_id', id)
      .order('session_number', { ascending: true })
      .order('created_at', { ascending: true });

    if (sessionsError) throw sessionsError;

    return NextResponse.json({ data: { subscriber, sessions } });
  } catch (error: any) {
    console.error('Fetch subscriber details error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch subscriber details' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const updates = await request.json();

    const { data, error } = await supabase
      .from('subscribers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Update subscriber error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update subscriber' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete subscriber error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete subscriber' }, { status: 500 });
  }
}
