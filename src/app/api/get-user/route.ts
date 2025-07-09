import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const telegram_id = body.telegram_id;
    if (!telegram_id) {
      return NextResponse.json({ error: 'No telegram_id' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', telegram_id)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user: { ...data, auth_id: data.auth_id } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 