import { supabase } from './supabaseClient';

// Получить Telegram-данные из WebApp
export function getTelegramUser() {
  if (typeof window === 'undefined' || !window.Telegram || !window.Telegram.WebApp) return null;
  return window.Telegram.WebApp.initDataUnsafe?.user || null;
}

// Авторизация/регистрация пользователя через Telegram + Supabase (копипаста с Eclipse)
export async function signInOrUpWithTelegram(telegramUser: any) {
  if (!telegramUser) return null;
  // 1. Пробуем найти пользователя по telegram_id
  const res = await fetch('/api/get-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegram_id: String(telegramUser.id) }),
  });
  let user = null;
  if (res.ok) {
    const data = await res.json();
    user = data.user;
    // Проверяем сессию
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user || authData.user.id !== user.auth_id) {
      // Получаем токены через /api/auth/telegram
      user = await loginViaTelegram(telegramUser);
    }
  } else {
    // Нет пользователя — регистрируем
    user = await loginViaTelegram(telegramUser);
  }
  return user;
}

// Вызов /api/auth/telegram, установка сессии Supabase
export async function loginViaTelegram(telegramUser: any, initDataRaw?: string) {
  const initData = initDataRaw || (typeof window !== 'undefined' && window.Telegram?.WebApp ? window.Telegram.WebApp.initData : '');
  
  const res = await fetch('/api/auth/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      telegram_id: telegramUser.id,
      first_name: telegramUser.first_name,
      username: telegramUser.username,
      last_name: telegramUser.last_name,
      photo_url: telegramUser.photo_url,
      language_code: telegramUser.language_code,
      initData: initData,
    }),
  });
  
  const data = await res.json();
  if (data.access_token && data.refresh_token) {
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
  }
  return data.user || null;
}

// Сохранить/обновить профиль в таблице users
export async function upsertUserProfile(telegramUser: any, auth_id: string) {
  if (!telegramUser || !auth_id) return;
  const { id, username, first_name, last_name, photo_url, language_code } = telegramUser;
  const name = [first_name, last_name].filter(Boolean).join(' ');
  const avatar = photo_url || '';
  await supabase.from('users').upsert({
    telegram_id: id,
    username,
    name,
    avatar,
    lang: language_code || 'ru',
    auth_id,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'telegram_id' });
}

// Получить профиль из таблицы users
export async function getProfileFromUsersTable(auth_id: string) {
  const { data, error } = await supabase.from('users').select('*').eq('auth_id', auth_id).single();
  if (error) return null;
  return data;
} 