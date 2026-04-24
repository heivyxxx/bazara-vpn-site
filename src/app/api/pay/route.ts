import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const REMNAWAVE_API_BASE_URL = process.env.REMNAWAVE_API_BASE_URL;
const REMNAWAVE_API_TOKEN = process.env.REMNAWAVE_API_TOKEN;
const REMNAWAVE_CREATE_PATH = process.env.REMNAWAVE_CREATE_SUB_PATH || '/api/subscriptions';
const REMNAWAVE_USER_UPSERT_PATH = process.env.REMNAWAVE_UPSERT_USER_PATH || '';
const REMNAWAVE_TIMEOUT_MS = Number(process.env.REMNAWAVE_TIMEOUT_MS || 15000);

async function sendTelegramLink(telegramId: string, link: string, package_days?: number) {
  if (!BOT_TOKEN || !telegramId) return;
  let duration = '...';
  if (package_days === 3) duration = '3 дня';
  else if (package_days === 30) duration = '30 дней';
  else if (package_days === 365) duration = '1 год';
  const text = `Ваша VPN-ссылка готова\n\nПодключайте до 5 устройств.\nБезлимитный трафик.\nСрок действия: ${duration}\n\nПриватный ключ-ссылка:\n${link}\n\nИнструкция по установке находится в разделе «Скачать»\n\nBazaraVPN — Быстро. Безопасно. Анонимно🧡`;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramId,
        text
      })
    });
  } catch (e) {
  }
}

function randomId(prefix: string) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = prefix;
  for (let i = 0; i < 8; ++i) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    promise
      .then((res) => {
        clearTimeout(id);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });
}

function parseSubscriptionLink(payload: any): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const directCandidates = [
    payload.link,
    payload.url,
    payload.subscription_url,
    payload.subscriptionUrl,
    payload.access_url,
    payload.accessUrl,
  ];
  for (const candidate of directCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }
  const nestedCandidates = [
    payload.data?.link,
    payload.data?.url,
    payload.data?.subscription_url,
    payload.data?.subscriptionUrl,
    payload.result?.link,
    payload.result?.url,
    payload.user?.subscription_url,
    payload.user?.subscriptionUrl,
  ];
  for (const candidate of nestedCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }
  return null;
}

function isUserNotFoundError(err: any) {
  const text = String(err || '').toLowerCase();
  return text.includes('user not found') || text.includes('пользователь не найден') || text.includes('not found');
}

async function remnawaveRequest(path: string, body: any): Promise<any> {
  if (!REMNAWAVE_API_BASE_URL || !REMNAWAVE_API_TOKEN) {
    return { ok: false as const, error: 'missing_remnawave_env' };
  }
  const base = REMNAWAVE_API_BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const endpoint = `${base}${normalizedPath}`;
  try {
    const res = await withTimeout(
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${REMNAWAVE_API_TOKEN}`,
        },
        body: JSON.stringify(body),
      }),
      REMNAWAVE_TIMEOUT_MS
    );
    const raw = await res.text();
    let data: any = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = { raw };
    }
    if (!res.ok) {
      return { ok: false as const, error: data?.error || `remnawave_http_${res.status}`, details: data };
    }
    return { ok: true as const, data };
  } catch (e: any) {
    return { ok: false as const, error: e?.message || 'remnawave_request_failed' };
  }
}

async function upsertRemnawaveUser(input: { userId: string; username?: string | null; name?: string | null }): Promise<any> {
  if (!REMNAWAVE_USER_UPSERT_PATH) {
    return { ok: false as const, error: 'upsert_path_not_set' };
  }
  const numericId = asNumericId(input.userId);
  const payload = {
    id: numericId ?? input.userId,
    user_id: numericId ?? input.userId,
    telegram_id: numericId ?? input.userId,
    external_id: input.userId,
    username: input.username || undefined,
    name: input.name || undefined,
  };
  return remnawaveRequest(REMNAWAVE_USER_UPSERT_PATH, payload);
}

async function createInRemnawave(input: { userId: string; packageDays: number; creator: string; taskId: string; username?: string | null; name?: string | null }): Promise<any> {
  if (!REMNAWAVE_API_BASE_URL || !REMNAWAVE_API_TOKEN) {
    return { ok: false as const, error: 'missing_remnawave_env' };
  }
  const numericId = asNumericId(input.userId);
  const body = {
    user_id: numericId ?? input.userId,
    telegram_id: numericId ?? input.userId,
    external_user_id: input.userId,
    package_days: input.packageDays,
    duration_days: input.packageDays,
    creator: input.creator,
    task_id: input.taskId,
    create_if_not_exists: true,
    upsert_user: true,
    username: input.username || undefined,
    name: input.name || undefined,
  };
  const firstTry = await remnawaveRequest(REMNAWAVE_CREATE_PATH, body);
  if (firstTry.ok) {
    const link = parseSubscriptionLink(firstTry.data);
    if (!link) return { ok: false as const, error: 'remnawave_link_not_found', details: firstTry.data };
    return { ok: true as const, link, details: firstTry.data };
  }
  if (isUserNotFoundError(firstTry.error)) {
    await upsertRemnawaveUser({ userId: input.userId, username: input.username, name: input.name });
    const secondTry = await remnawaveRequest(REMNAWAVE_CREATE_PATH, body);
    if (secondTry.ok) {
      const link = parseSubscriptionLink(secondTry.data);
      if (!link) return { ok: false as const, error: 'remnawave_link_not_found', details: secondTry.data };
      return { ok: true as const, link, details: secondTry.data };
    }
    return { ok: false as const, error: secondTry.error, details: secondTry };
  }
  return firstTry;
}

async function createSubscription(input: { userId: string; packageDays: number; creator: string; taskId: string; username?: string | null; name?: string | null }): Promise<any> {
  const remnawaveRes = await createInRemnawave(input);
  if (remnawaveRes.ok) return remnawaveRes;
  return { ok: false as const, error: remnawaveRes.error, remnawave: remnawaveRes };
}

function asNumericId(value: string): number | null {
  const trimmed = String(value || '').trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

async function resolveUserByAnyId(userIdRaw: string) {
  const numericId = asNumericId(userIdRaw);
  if (numericId !== null) {
    const byId = await supabase
      .from('users')
      .select('id, telegram_id, balance')
      .eq('id', numericId)
      .maybeSingle();
    if (byId.data) return byId;
    const byTelegramId = await supabase
      .from('users')
      .select('id, telegram_id, balance')
      .eq('telegram_id', numericId)
      .maybeSingle();
    if (byTelegramId.data) return byTelegramId;
  }
  // Фолбэк для старых схем, где id/telegram_id могли быть text.
  const byTextTelegram = await supabase
    .from('users')
    .select('id, telegram_id, balance')
    .eq('telegram_id', userIdRaw)
    .maybeSingle();
  return byTextTelegram;
}

async function getUserProfileByAnyId(userIdRaw: string) {
  const numericId = asNumericId(userIdRaw);
  if (numericId !== null) {
    const byId = await supabase.from('users').select('id, telegram_id, username, name, balance, trial').eq('id', numericId).maybeSingle();
    if (byId.data) return byId;
    const byTelegramId = await supabase.from('users').select('id, telegram_id, username, name, balance, trial').eq('telegram_id', numericId).maybeSingle();
    if (byTelegramId.data) return byTelegramId;
  }
  const byTextTelegram = await supabase.from('users').select('id, telegram_id, username, name, balance, trial').eq('telegram_id', userIdRaw).maybeSingle();
  return byTextTelegram;
}

async function insertOrderRecord(input: {
  orderId: string;
  userId: string;
  amount: number;
  packageDays: number;
  method: string;
  status: 'completed' | 'failed';
  link?: string;
  error?: string;
}) {
  const payload: any = {
    order_id: input.orderId,
    user_id: input.userId,
    amount: Number(input.amount || 0),
    package_days: Number(input.packageDays || 0),
    method: input.method,
    status: input.status,
    link: input.link || null,
    error_message: input.error || null,
    created_at: new Date().toISOString(),
  };
  try {
    await supabase.from('orders').insert(payload);
  } catch {
    // Не блокируем выдачу подписки, если таблица orders ещё не создана.
  }
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Invalid JSON', details: e }, { status: 400 });
  }
  try {

    // --- Депозит (только amount, order_id, description, method) ---
    if (body.description === 'Пополнение баланса' && body.amount && body.order_id && body.method) {
      // Здесь можно добавить интеграцию с платёжкой для депозита, если нужно
      // Для MVP — просто возвращаем тестовую ссылку
      const url = `https://pay.bazara.app/deposit?order_id=${body.order_id}&amount=${body.amount}`;

      return NextResponse.json({ url });
    }
    const { user_id, telegram_id, package_days, order_id, method, is_trial, is_admin, amount } = body;
    // 1. TRIAL: только 3 дня, только 1 раз на пользователя
    if (method === 'trial' || is_trial) {
      const id = telegram_id || user_id;
      if (!id) return NextResponse.json({ success: false, error: 'No user id' }, { status: 400 });
      const userLookup = await getUserProfileByAnyId(String(id));
      const { data: user, error } = userLookup;
      if (error || !user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 400 });
      if (user.trial) return NextResponse.json({ success: false, error: 'already_used' }, { status: 400 });
      await supabase.from('users').update({ trial: true }).eq('id', user.id);
      const task_id = randomId('T');
      const created = await createSubscription({
        userId: String(user.id),
        packageDays: 3,
        creator: 'trial',
        taskId: task_id,
        username: user.username,
        name: user.name,
      });
      if (created.ok) {
        const link = created.link;
        await sendTelegramLink(id, link, 3);
        await supabase.from('subscriptions').insert({
          user_id: id,
          link,
          status: 'active',
          expires_at: addDays(new Date(), 3).toISOString(),
          device_limit: 2,
          source: 'trial',
          created_at: new Date().toISOString()
        });
        return NextResponse.json({ success: true, link });
      } else {
        await insertOrderRecord({
          orderId: order_id || `trial_${id}_${Date.now()}`,
          userId: String(id),
          amount: 0,
          packageDays: 3,
          method: 'trial',
          status: 'failed',
          error: created.error || 'trial_failed',
        });
        return NextResponse.json({ success: false, error: created.error || 'Ошибка генерации trial-ссылки', details: created }, { status: 500 });
      }
    }
    // 2. ADMIN: любое число дней, без оплаты
    if (is_admin) {
      if (!user_id || !package_days) return NextResponse.json({ success: false, error: 'Missing params' }, { status: 400 });
      const task_id = randomId('A');
      const profile = await getUserProfileByAnyId(String(user_id));
      const resolvedId = String(profile.data?.id || user_id);
      const created = await createSubscription({
        userId: resolvedId,
        packageDays: Number(package_days),
        creator: 'admin',
        taskId: task_id,
        username: profile.data?.username,
        name: profile.data?.name,
      });
      if (created.ok) {
        const link = created.link;
        await sendTelegramLink('980466532', link, package_days);
        await supabase.from('subscriptions').insert({
          user_id,
          link,
          status: 'active',
          expires_at: addDays(new Date(), Number(package_days)).toISOString(),
          device_limit: 2,
          source: 'admin',
          created_at: new Date().toISOString()
        });
        await insertOrderRecord({
          orderId: order_id || `admin_${user_id}_${Date.now()}`,
          userId: String(user_id),
          amount: 0,
          packageDays: Number(package_days),
          method: 'admin',
          status: 'completed',
          link,
        });
        return NextResponse.json({ success: true, link });
      } else {
        await insertOrderRecord({
          orderId: order_id || `admin_${user_id}_${Date.now()}`,
          userId: String(user_id),
          amount: 0,
          packageDays: Number(package_days),
          method: 'admin',
          status: 'failed',
          error: created.error || 'admin_failed',
        });
        return NextResponse.json({ success: false, error: created.error || 'Ошибка генерации admin-ссылки', details: created }, { status: 500 });
      }
    }
    // 3. Обычная покупка (balance, sbp, card, crypto)
    if (!user_id || !package_days || !method) {
      return NextResponse.json({ success: false, error: 'Missing params', details: { user_id, package_days, method } }, { status: 400 });
    }
    const nowIso = new Date().toISOString();
    let balanceBefore: number | null = null;
    if (method === 'balance') {
      if (typeof amount !== 'number') return NextResponse.json({ success: false, error: 'No amount' }, { status: 400 });
      const { data: user, error } = await resolveUserByAnyId(String(user_id));
      if (error || !user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 400 });
      if (user.balance < amount) return NextResponse.json({ success: false, error: 'Недостаточно средств на балансе' }, { status: 400 });
      balanceBefore = Number(user.balance);
    }
    let prefix = 'B';
    if (method === 'sbp') prefix = 'S';
    else if (method === 'card') prefix = 'K';
    else if (method === 'crypto') prefix = 'C';
    const task_id = randomId(prefix);
    const profile = await getUserProfileByAnyId(String(user_id));
    if (!profile.data) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 400 });
    }
    const created = await createSubscription({
      userId: String(profile.data.id),
      packageDays: Number(package_days),
      creator: String(profile.data.id),
      taskId: task_id,
      username: profile.data.username,
      name: profile.data.name,
    });
    if (created.ok) {
      const link = created.link;
      // Снимаем старую активную подписку и создаём новую актуальную запись.
      await supabase.from('subscriptions').update({ status: 'archived' }).eq('user_id', user_id).eq('status', 'active');
      const { data: latestSub } = await supabase
        .from('subscriptions')
        .select('expires_at, device_limit, traffic_total_gb, traffic_used_gb')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      const nowDate = new Date();
      const baseDate = latestSub?.expires_at && new Date(latestSub.expires_at) > nowDate
        ? new Date(latestSub.expires_at)
        : nowDate;
      const expiresAt = addDays(baseDate, Number(package_days));
      await supabase.from('subscriptions').insert({
        user_id,
        link,
        status: 'active',
        expires_at: expiresAt.toISOString(),
        device_limit: latestSub?.device_limit ?? 2,
        traffic_total_gb: latestSub?.traffic_total_gb ?? null,
        traffic_used_gb: latestSub?.traffic_used_gb ?? 0,
        source: method,
        created_at: nowIso
      });
      if (method === 'balance' && balanceBefore !== null) {
        const newBalance = balanceBefore - Number(amount);
        const resolved = await resolveUserByAnyId(String(user_id));
        if (!resolved.data) {
          return NextResponse.json({ success: false, error: 'User not found while updating balance' }, { status: 400 });
        }
        await supabase.from('users').update({ balance: newBalance }).eq('id', resolved.data.id);
        await supabase.from('transactions').insert({
          user_id: resolved.data.id,
          amount: Number(amount),
          type: 'subscription_purchase',
          status: 'completed',
          created_at: nowIso,
          meta: { package_days, method, order_id: order_id || null, link }
        });
      }
      await insertOrderRecord({
        orderId: order_id || `order_${user_id}_${Date.now()}`,
        userId: String(user_id),
        amount: Number(amount || 0),
        packageDays: Number(package_days),
        method: String(method),
        status: 'completed',
        link,
      });
      await sendTelegramLink(telegram_id || user_id, link, package_days);
      if (method === 'balance') {
        const resolved = await resolveUserByAnyId(String(user_id));
        const userAfter = resolved.data;
        return NextResponse.json({
          success: true,
          link,
          balance: Number(userAfter?.balance || 0),
          subscription: {
            expires_at: expiresAt.toISOString(),
            device_limit: latestSub?.device_limit ?? 2,
            traffic_total_gb: latestSub?.traffic_total_gb ?? null,
            traffic_used_gb: latestSub?.traffic_used_gb ?? 0
          }
        });
      }
      return NextResponse.json({ success: true, link });
    } else {
      await insertOrderRecord({
        orderId: order_id || `order_${user_id}_${Date.now()}`,
        userId: String(user_id),
        amount: Number(amount || 0),
        packageDays: Number(package_days),
        method: String(method),
        status: 'failed',
        error: created.error || 'create_failed',
      });
      return NextResponse.json({ success: false, error: created.error || 'Ошибка генерации ссылки', details: created }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error', details: e }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  if (!orderId) return NextResponse.json({ success: false, error: 'No orderId' }, { status: 400 });
  const { data, error } = await supabase
    .from('transactions')
    .select('meta')
    .contains('meta', { order_id: orderId })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (data?.meta?.link) {
    return NextResponse.json({ success: true, link: data.meta.link });
  } else {
    return NextResponse.json({ success: false, error: 'Not ready' }, { status: 404 });
  }
} 