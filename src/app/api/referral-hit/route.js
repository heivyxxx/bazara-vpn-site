import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase env vars are not set');
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    let query = supabase.from('referrals').select('*');
    if (type) query = query.eq('type', type);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { ref, userId, type = 'user' } = body;

    if (!ref || (type === 'user' && !userId)) {

      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }
    // Ищем рефераfлываьную ссылку по name и type
    const { data: refs, error } = await supabase.from('referrals').select('*').eq('name', ref).eq('type', type);

    if (error || !refs || refs.length === 0) {

      return NextResponse.json({ error: 'Ref not found' }, { status: 404 });
    }
    const referral = refs[0];
    const users = referral.users || [];
    if (users.includes(userId)) {

      return NextResponse.json({ status: 'already counted' });
    }
    // Добавляем userId в users и увеличиваем count
    const newUsers = [...users, userId];
    const { error: updateError } = await supabase.from('referrals').update({ users: newUsers, count: referral.count + 1 }).eq('id', referral.id);
    if (updateError) {

      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (e) {

    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { userId, name, type = 'user' } = body;

    if (!name || (type === 'user' && !userId)) {

      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }
    // Проверяем, есть ли уже такая запись
    let query = supabase.from('referrals').select('*').eq('name', name).eq('type', type);
    if (type === 'user') query = query.eq('user_id', userId);
    const { data: refs, error } = await query;

    if (error) {

      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (refs && refs.length > 0) {

      return NextResponse.json({ status: 'already exists' });
    }
    // Создаём новую запись
    const insertData = {
      user_id: type === 'user' ? userId : null,
      name,
      type,
      count: 0,
      users: [],
      created_at: new Date().toISOString(),
      url: `https://t.me/BazaraVPN_bot?startapp=ref_${name}`
    };
    const { error: insertError } = await supabase.from('referrals').insert(insertData);
    if (insertError) {

      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'created' });
  } catch (e) {

    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const { error } = await supabase.from('referrals').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ status: 'deleted' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 