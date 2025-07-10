import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase env vars are not set');
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { ref, userId } = body;
    if (!ref || !userId) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    // Ищем реферальную ссылку по name
    const { data: refs, error } = await supabase.from('referrals').select('*').eq('name', ref);
    if (error || !refs || refs.length === 0) return NextResponse.json({ error: 'Ref not found' }, { status: 404 });
    const referral = refs[0];
    const users = referral.users || [];
    if (users.includes(userId)) {
      return NextResponse.json({ status: 'already counted' });
    }
    // Добавляем userId в users и увеличиваем count
    const newUsers = [...users, userId];
    await supabase.from('referrals').update({ users: newUsers, count: referral.count + 1 }).eq('id', referral.id);
    return NextResponse.json({ status: 'ok' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { userId, name } = body;
    if (!userId || !name) return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    // Проверяем, есть ли уже такая запись
    const { data: refs, error } = await supabase.from('referrals').select('*').eq('user_id', userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (refs && refs.length > 0) return NextResponse.json({ status: 'already exists' });
    // Создаём новую запись
    const { error: insertError } = await supabase.from('referrals').insert({
      user_id: userId,
      name,
      count: 0,
      users: [],
      created_at: new Date().toISOString(),
    });
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    return NextResponse.json({ status: 'created' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 