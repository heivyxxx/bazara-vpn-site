import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_FAKE_PASSWORD = process.env.SUPABASE_FAKE_PASSWORD || 'tg_secret_password';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function validateTelegramInitData(initData: string, botToken: string) {
  const urlSearchParams = new URLSearchParams(initData);
  const hash = urlSearchParams.get('hash');
  urlSearchParams.delete('hash');
  const dataCheckString = Array.from(urlSearchParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  return computedHash === hash;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { initData } = body;
    if (!initData) {
      return NextResponse.json({ success: false, error: 'No initData provided' }, { status: 400 });
    }
    if (!BOT_TOKEN) {
      return NextResponse.json({ success: false, error: 'Bot token not configured' }, { status: 500 });
    }
    // Парсим initData
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const auth_date = params.get('auth_date');
    const userRaw = params.get('user');
    if (!hash || !auth_date || !userRaw) {
      return NextResponse.json({ success: false, error: 'Missing hash, auth_date or user in initData' }, { status: 400 });
    }
    // Валидируем подпись
    const isValid = validateTelegramInitData(initData, BOT_TOKEN);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid Telegram signature' }, { status: 401 });
    }
    // Проверяем время авторизации (не старше 24 часов)
    const now = Math.floor(Date.now() / 1000);
    if (now - Number(auth_date) > 86400) {
      return NextResponse.json({ success: false, error: 'Authorization expired' }, { status: 401 });
    }
    // Парсим user
    let userObj;
    try {
      userObj = JSON.parse(userRaw);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid user JSON in initData' }, { status: 400 });
    }
    const telegram_id = userObj.id;
    const username = userObj.username || '';
    const first_name = userObj.first_name || '';
    const last_name = userObj.last_name || '';
    const photo_url = userObj.photo_url || '';
    const language_code = userObj.language_code || 'ru';
    // --- Регистрация пользователя в Supabase ---
    const email = `telegram_${telegram_id}@tg.local`;
    const password = SUPABASE_FAKE_PASSWORD;
    // 1. Пробуем создать пользователя (если уже есть — игнорируем ошибку)
    let user = null;
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        telegram_id,
        username,
        first_name,
        last_name,
        photo_url,
        language_code
      }
    });
    if (
      createError &&
      !(
        createError.message.includes('User already registered') ||
        createError.code === 'email_exists'
      )
    ) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }
    user = createData?.user || null;
    // 2. Логинимся через Supabase Auth
    const { data: session, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 500 });
    }
    // 3. Upsert в таблицу users
    const auth_id = session.user.id;
    const upsertRes = await supabaseAdmin.from('users').upsert({
      id: telegram_id,
      telegram_id: telegram_id,
      auth_id: auth_id,
      username: username,
      name: first_name || username,
      avatar: photo_url,
      lang: language_code,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
    if (upsertRes.error) {
      return NextResponse.json({ error: upsertRes.error.message, details: upsertRes.error }, { status: 500 });
    }
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
      return NextResponse.json({ error: 'No access_token or refresh_token in session', session }, { status: 500 });
    }
    return NextResponse.json({
      access_token,
      refresh_token,
      user: {
        id: telegram_id,
        auth_id,
        username,
        first_name,
        last_name,
        photo_url,
        language_code
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 