import { supabase } from './supabaseClient';

// Получить Telegram-данные из WebApp
export function getTelegramUser() {
  if (typeof window === 'undefined' || !window.Telegram || !window.Telegram.WebApp) return null;
  return window.Telegram.WebApp.initDataUnsafe?.user || null;
}

// Зарегистрировать или залогинить пользователя через Supabase Auth (по Telegram ID)
export async function signInOrUpWithTelegram(telegramUser: any) {
  if (!telegramUser) return null;
  // Используем Telegram ID как email (например, 123456@telegram.bazara)
  const email = telegramUser.id + '@telegram.bazara';
  const password = telegramUser.id + '_tg_secret';
  // Пробуем войти
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (data?.user) return data.user;
  // Если не получилось — регистрируем
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) throw signUpError;
  return signUpData.user;
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