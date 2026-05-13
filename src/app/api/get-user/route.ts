import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { findUserRow } from '@/lib/dbUserLookup';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const telegram_id = body.telegram_id;
    // Если есть telegram_id — ищем по id ИЛИ telegram_id (не только id === tg)
    if (telegram_id) {
      const { data } = await findUserRow(supabase, String(telegram_id), '*');
      if (!data) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ user: { ...data, auth_id: data.auth_id } });
    }
    // Если нет telegram_id — ищем по Supabase-токену (auth_id)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No telegram_id or authorization' }, { status: 400 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: 'User not found by auth_id' }, { status: 404 });
    }
    return NextResponse.json({ user: { ...data, auth_id: user.id } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 