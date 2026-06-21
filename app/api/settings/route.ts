import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'abuhashemmajd@gmail.com';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data, error } = await supabase
    .from('teacher_settings')
    .select('*')
    .eq('email', ADMIN_EMAIL)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data || null });
}

export async function POST(request: Request) {
  try {
    const { workingHours, timezone } = await request.json();

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('teacher_settings')
      .upsert({
        email: ADMIN_EMAIL,
        working_hours: workingHours,
        timezone: timezone || 'Asia/Qatar',
      }, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, settings: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
