import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const REMNAWAVE_API_BASE_URL = process.env.REMNAWAVE_API_BASE_URL;
const REMNAWAVE_API_TOKEN = process.env.REMNAWAVE_API_TOKEN;
const REMNAWAVE_CREATE_PATH = process.env.REMNAWAVE_CREATE_SUB_PATH || '/api/subscriptions';
const REMNAWAVE_TIMEOUT_MS = Number(process.env.REMNAWAVE_TIMEOUT_MS || 15000);
const AUTO_RENEW_PRICE_RUB = Number(process.env.AUTO_RENEW_PRICE_RUB || 69);
const AUTO_RENEW_DAYS = Number(process.env.AUTO_RENEW_DAYS || 30);
const CRON_SECRET = process.env.AUTO_RENEW_CRON_SECRET || '';

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
  const direct = [payload.link, payload.url, payload.subscription_url, payload.subscriptionUrl, payload.access_url, payload.accessUrl];
  for (const c of direct) if (typeof c === 'string' && c.trim()) return c;
  const nested = [
    payload.data?.link, payload.data?.url, payload.data?.subscription_url, payload.data?.subscriptionUrl,
    payload.result?.link, payload.result?.url, payload.user?.subscription_url, payload.user?.subscriptionUrl
  ];
  for (const c of nested) if (typeof c === 'string' && c.trim()) return c;
  return null;
}

async function createInRemnawave(userId: string, packageDays: number, taskId: string) {
  if (!REMNAWAVE_API_BASE_URL || !REMNAWAVE_API_TOKEN) {
    return { ok: false as const, error: 'missing_remnawave_env' };
  }
  const base = REMNAWAVE_API_BASE_URL.replace(/\/$/, '');
  const path = REMNAWAVE_CREATE_PATH.startsWith('/') ? REMNAWAVE_CREATE_PATH : `/${REMNAWAVE_CREATE_PATH}`;
  const endpoint = `${base}${path}`;
  const body = {
    user_id: userId,
    telegram_id: userId,
    package_days: packageDays,
    duration_days: packageDays,
    creator: 'auto_renew',
    task_id: taskId,
  };

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
    const link = parseSubscriptionLink(data);
    if (!link) {
      return { ok: false as const, error: 'remnawave_link_not_found', details: data };
    }
    return { ok: true as const, link };
  } catch (e: any) {
    return { ok: false as const, error: e?.message || 'remnawave_request_failed' };
  }
}

function randomId(prefix: string) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = prefix;
  for (let i = 0; i < 8; ++i) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

async function createOrderRecord(input: {
  orderId: string;
  userId: number;
  amount: number;
  status: 'completed' | 'failed';
  link?: string;
  error?: string;
}) {
  await supabase.from('orders').insert({
    order_id: input.orderId,
    user_id: input.userId,
    amount: input.amount,
    package_days: AUTO_RENEW_DAYS,
    method: 'balance_auto_renew',
    status: input.status,
    link: input.link || null,
    error_message: input.error || null,
    created_at: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    if (CRON_SECRET) {
      const auth = req.headers.get('authorization') || '';
      if (auth !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
    }

    const nowIso = new Date().toISOString();
    const { data: dueSubs, error: dueError } = await supabase
      .from('subscriptions')
      .select('id, user_id, expires_at, auto_renew, status, link, device_limit, traffic_total_gb, traffic_used_gb')
      .eq('status', 'active')
      .eq('auto_renew', true)
      .lte('expires_at', nowIso)
      .limit(200);

    if (dueError) {
      return NextResponse.json({ success: false, error: dueError.message }, { status: 500 });
    }

    const result = { processed: 0, renewed: 0, skipped_insufficient: 0, failed: 0 };
    for (const sub of dueSubs || []) {
      result.processed += 1;
      const userId = Number(sub.user_id);
      const orderId = `auto_renew_${userId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const { data: user, error: userError } = await supabase.from('users').select('id, balance').eq('id', userId).maybeSingle();
      if (userError || !user) {
        result.failed += 1;
        await createOrderRecord({ orderId, userId, amount: AUTO_RENEW_PRICE_RUB, status: 'failed', error: 'user_not_found' });
        continue;
      }
      if (Number(user.balance || 0) < AUTO_RENEW_PRICE_RUB) {
        result.skipped_insufficient += 1;
        await createOrderRecord({ orderId, userId, amount: AUTO_RENEW_PRICE_RUB, status: 'failed', error: 'insufficient_balance' });
        continue;
      }

      const created = await createInRemnawave(String(userId), AUTO_RENEW_DAYS, randomId('R'));
      if (!created.ok) {
        result.failed += 1;
        await createOrderRecord({ orderId, userId, amount: AUTO_RENEW_PRICE_RUB, status: 'failed', error: created.error || 'remnawave_error' });
        continue;
      }

      const newBalance = Number(user.balance) - AUTO_RENEW_PRICE_RUB;
      const base = sub.expires_at && new Date(sub.expires_at) > new Date() ? new Date(sub.expires_at) : new Date();
      const newExpiresAt = addDays(base, AUTO_RENEW_DAYS).toISOString();
      await supabase.from('users').update({ balance: newBalance }).eq('id', userId);
      await supabase.from('subscriptions').update({
        expires_at: newExpiresAt,
        link: created.link || sub.link,
        updated_at: new Date().toISOString(),
      }).eq('id', sub.id);
      await supabase.from('transactions').insert({
        user_id: userId,
        amount: AUTO_RENEW_PRICE_RUB,
        type: 'subscription_purchase',
        status: 'completed',
        meta: {
          auto_renew: true,
          package_days: AUTO_RENEW_DAYS,
          method: 'balance_auto_renew',
          order_id: orderId,
          subscription_id: sub.id,
          link: created.link || sub.link,
        },
        created_at: new Date().toISOString(),
      });
      await createOrderRecord({
        orderId,
        userId,
        amount: AUTO_RENEW_PRICE_RUB,
        status: 'completed',
        link: created.link || sub.link,
      });
      result.renewed += 1;
    }

    return NextResponse.json({ success: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
}

