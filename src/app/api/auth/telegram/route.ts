import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_FAKE_PASSWORD = process.env.SUPABASE_FAKE_PASSWORD || 'tg_secret_password';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegram_id, username, first_name, last_name, photo_url, language_code } = body;
    
    if (!telegram_id) {
      return NextResponse.json({ error: 'telegram_id required' }, { status: 400 });
    }
    
    const email = `${telegram_id}@t.me`;
    const password = SUPABASE_FAKE_PASSWORD;

    // Supabase admin client (service role)
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Пытаемся создать пользователя в Auth
    let user = null;
    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { telegram_id, username, first_name, last_name, photo_url, language_code }
    });
    
    if (
      signUpError &&
      !(
        signUpError.message.includes('User already registered') ||
        signUpError.code === 'email_exists' || 
        signUpError.message.includes('already been registered')
      )
    ) {
      return NextResponse.json({ error: signUpError.message }, { status: 500 });
    }
    user = signUpData?.user || null;

    // Получаем токены для клиента через публичный ключ
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: tokenData, error: tokenError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (tokenError) {
      return NextResponse.json({ error: tokenError.message }, { status: 500 });
    }

    // Upsert пользователя в таблицу users
    const upsertRes = await supabaseAdmin.from('users').upsert({
      id: telegram_id,
      telegram_id: telegram_id,
      auth_id: tokenData.user.id,
      username: username || '',
      name: first_name || username || '',
      avatar: photo_url || '',
      lang: language_code || 'ru',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
    
    if (upsertRes.error) {
      return NextResponse.json({ error: upsertRes.error.message, details: upsertRes.error }, { status: 500 });
    }

    return NextResponse.json({
      access_token: tokenData.session?.access_token,
      refresh_token: tokenData.session?.refresh_token,
      user: tokenData.user,
    });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}