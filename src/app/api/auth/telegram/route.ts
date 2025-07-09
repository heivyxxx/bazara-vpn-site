import { NextResponse } from 'next/server';
import { TelegramAuthResponse } from '@/lib/types';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_FAKE_PASSWORD = process.env.SUPABASE_FAKE_PASSWORD || 'tg_secret_password';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function checkTelegramAuthorization(data: TelegramAuthResponse) {
  const { hash, ...userData } = data;
  const dataCheckString = Object.keys(userData)
    .sort()
    .map(key => `${key}=${userData[key as keyof typeof userData]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256')
    .update(BOT_TOKEN || '')
    .digest();

  const hmac = crypto.createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return hmac === hash;
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as TelegramAuthResponse;
    console.log('[TG AUTH API] входящие данные:', data);

    if (!BOT_TOKEN) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bot token not configured' 
      }, { status: 500 });
    }

    // Проверяем подпись
    const isValid = checkTelegramAuthorization(data);
    if (!isValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid authorization' 
      }, { status: 401 });
    }

    // Проверяем время авторизации (не старше 24 часов)
    const authDate = data.auth_date;
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authorization expired' 
      }, { status: 401 });
    }

    // --- Регистрация пользователя в Supabase ---
    const email = `telegram_${data.id}@tg.local`;
    const password = SUPABASE_FAKE_PASSWORD;
    // 1. Пробуем создать пользователя (если уже есть — игнорируем ошибку)
    let user = null;
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        telegram_id: data.id,
        username: data.username,
        first_name: data.first_name,
        last_name: '',
        photo_url: data.photo_url,
        language_code: data.language_code || 'ru'
      }
    });
    if (
      createError &&
      !(
        createError.message.includes('User already registered') ||
        createError.code === 'email_exists'
      )
    ) {
      console.error('[TG AUTH API] Ошибка createUser:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }
    user = createData?.user || null;

    // 2. Логинимся через Supabase Auth
    const { data: session, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (signInError) {
      console.error('[TG AUTH API] Ошибка signInWithPassword:', signInError);
      return NextResponse.json({ error: signInError.message }, { status: 500 });
    }

    // 3. Upsert в таблицу users
    const auth_id = session.user.id;
    const upsertRes = await supabaseAdmin.from('users').upsert({
      id: data.id,
      telegram_id: data.id,
      auth_id: auth_id,
      username: data.username,
      name: data.first_name || data.username,
      avatar: data.photo_url,
      lang: data.language_code || 'ru',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
    if (upsertRes.error) {
      console.error('[TG AUTH API] Ошибка upsert в users:', upsertRes.error);
      return NextResponse.json({ error: upsertRes.error.message, details: upsertRes.error }, { status: 500 });
    }
    console.log('[TG AUTH API] Upsert result:', upsertRes);

    // 4. Возвращаем токены и профиль
    let access_token = null;
    let refresh_token = null;
    if (session && typeof session === 'object') {
      if (session.session && typeof session.session === 'object') {
        access_token = session.session.access_token;
        refresh_token = session.session.refresh_token;
      }
    }
    if (!access_token || !refresh_token) {
      console.error('[TG AUTH API] Нет access_token или refresh_token:', session);
      return NextResponse.json({ error: 'No access_token or refresh_token in session', session }, { status: 500 });
    }

    return NextResponse.json({
      access_token,
      refresh_token,
      user: {
        id: data.id,
        auth_id,
        username: data.username,
        first_name: data.first_name,
        photo_url: data.photo_url || null
      }
    });
  } catch (error) {
    console.error('[TG AUTH API] Ошибка:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 