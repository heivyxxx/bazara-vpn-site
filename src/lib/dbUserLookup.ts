import type { SupabaseClient } from '@supabase/supabase-js';

const ALL_DIGITS = /^\d+$/;

/** Не терять точность для длинных Telegram id при Number() */
export function safeNumberFromDigits(raw: string): number | null {
  const s = String(raw || '').trim();
  if (!ALL_DIGITS.test(s)) return null;
  if (s.length > 15) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * Найти строку public.users по тому, что пришло с клиента (часто telegram id).
 * Порядок: telegram_id как строка → id как строка → числовые варианты (без uuid-id с числом).
 */
export async function findUserRow(
  supabase: SupabaseClient,
  userIdRaw: string,
  columns: string
) {
  const raw = String(userIdRaw || '').trim();
  if (!raw) return { data: null as any, error: null as any };

  const q = () => supabase.from('users').select(columns);

  let r = await q().eq('telegram_id', raw).maybeSingle();
  if (r.data) return r;

  r = await q().eq('id', raw).maybeSingle();
  if (r.data) return r;

  const n = safeNumberFromDigits(raw);
  if (n !== null) {
    r = await q().eq('telegram_id', n).maybeSingle();
    if (r.data) return r;
    r = await q().eq('id', n).maybeSingle();
    if (r.data) return r;
  }

  return { data: null, error: null };
}
