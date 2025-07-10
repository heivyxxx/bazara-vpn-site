import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BACKEND_URL = 'https://vpn.bazara.app/generate';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

async function sendTelegramLink(telegramId: string, link: string) {
  if (!BOT_TOKEN || !telegramId) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramId,
        text: `Ваша ссылка на VPN: ${link}`
      })
    });
  } catch (e) {
    // Не мешаем основному процессу
  }
}

function randomId(prefix: string) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = prefix;
  for (let i = 0; i < 8; ++i) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, telegram_id, package_days, order_id, method, is_trial, is_admin, amount } = body;
    // 1. TRIAL: только 3 дня, только 1 раз на пользователя
    if (method === 'trial' || is_trial) {
      const id = telegram_id || user_id;
      if (!id) return NextResponse.json({ success: false, error: 'No user id' }, { status: 400 });
      // Проверка, был ли trial
      const { data: user, error } = await supabase.from('users').select('trial').eq('id', id).single();
      if (error || !user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 400 });
      if (user.trial) return NextResponse.json({ success: false, error: 'already_used' }, { status: 400 });
      // Ставим trial=true
      await supabase.from('users').update({ trial: true }).eq('id', id);
      // Генерируем ссылку на 3 дня
      const task_id = randomId('T');
      const backendResp = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id, package_days: 3, creator: 'trial' })
      });
      const backendData = await backendResp.json();
      if (backendData && backendData.status === 'ok') {
        const link = `https://vpn.bazara.app/vless/${task_id}`;
        // Отправляем ссылку пользователю
        await sendTelegramLink(id, link);
        return NextResponse.json({ success: true, link });
      } else {
        return NextResponse.json({ success: false, error: backendData.error || 'Ошибка генерации trial-ссылки', details: backendData }, { status: 500 });
      }
    }
    // 2. ADMIN: любое число дней, без оплаты
    if (is_admin) {
      if (!user_id || !package_days) return NextResponse.json({ success: false, error: 'Missing params' }, { status: 400 });
      const task_id = randomId('A');
      const backendResp = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id, package_days, creator: 'admin' })
      });
      const backendData = await backendResp.json();
      if (backendData && backendData.status === 'ok') {
        const link = `https://vpn.bazara.app/vless/${task_id}`;
        // Отправляем ссылку только тебе (980466532)
        await sendTelegramLink('980466532', link);
        return NextResponse.json({ success: true, link });
      } else {
        return NextResponse.json({ success: false, error: backendData.error || 'Ошибка генерации admin-ссылки', details: backendData }, { status: 500 });
      }
    }
    // 3. Обычная покупка (balance, sbp, card, crypto): 30 или 365 дней
    if (!user_id || !package_days || !method) {
      return NextResponse.json({ success: false, error: 'Missing params' }, { status: 400 });
    }
    // Если оплата с баланса — сначала списываем баланс
    if (method === 'balance') {
      if (typeof amount !== 'number') return NextResponse.json({ success: false, error: 'No amount' }, { status: 400 });
      // Получаем пользователя
      const { data: user, error } = await supabase.from('users').select('balance').eq('id', user_id).single();
      if (error || !user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 400 });
      if (user.balance < amount) return NextResponse.json({ success: false, error: 'Недостаточно средств на балансе' }, { status: 400 });
      // Списываем баланс
      await supabase.from('users').update({ balance: user.balance - amount }).eq('id', user_id);
    }
    // Префиксы: B - balance, S - sbp, K - card, C - crypto
    let prefix = 'B';
    if (method === 'sbp') prefix = 'S';
    else if (method === 'card') prefix = 'K';
    else if (method === 'crypto') prefix = 'C';
    const task_id = randomId(prefix);
    const backendResp = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id, package_days, creator: user_id })
    });
    const backendData = await backendResp.json();
    if (backendData && backendData.status === 'ok') {
      const link = `https://vpn.bazara.app/vless/${task_id}`;
      // Отправляем ссылку пользователю
      await sendTelegramLink(telegram_id || user_id, link);
      return NextResponse.json({ success: true, link });
    } else {
      return NextResponse.json({ success: false, error: backendData.error || 'Ошибка генерации ссылки', details: backendData }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  if (!orderId) return NextResponse.json({ success: false, error: 'No orderId' }, { status: 400 });
  const { data, error } = await supabase.from('links').select('link').eq('order_id', orderId).single();
  if (data && data.link) {
    return NextResponse.json({ success: true, link: data.link });
  } else {
    return NextResponse.json({ success: false, error: 'Not ready' }, { status: 404 });
  }
} 