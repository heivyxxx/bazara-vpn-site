import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req: NextRequest) {
  try {
    const query = (req.nextUrl.searchParams.get('q') || '').trim();
    if (!query) {
      return NextResponse.json({ success: true, users: [] });
    }

    const like = `%${query}%`;
    const { data, error } = await supabase
      .from('users')
      .select('id, telegram_id, name, username, balance')
      .or(`id.ilike.${like},telegram_id.ilike.${like},name.ilike.${like},username.ilike.${like}`)
      .limit(10);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, users: data || [] });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
}

