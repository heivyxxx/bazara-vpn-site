import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BACKEND_URL = 'https://vpn.bazara.app/generate';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

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
      const { data: user, error } = await supabase.from('users').select('trial').eq('id', id).single();
      if (error || !user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 400 });
      if (user.trial) return NextResponse.json({ success: false, error: 'already_used' }, { status: 400 });
      await supabase.from('users').update({ trial: true }).eq('id', id);
      const task_id = randomId('T');
      const backendResp = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id, package_days: 3, creator: 'trial' })
      });
      let backendData;
      try { backendData = await backendResp.json(); } catch (e) { backendData = {}; }
      if (backendData && backendData.status === 'ok') {
        const link = `https://vpn.bazara.app/vless/${task_id}`;
        await sendTelegramLink(id, link, 3);
        // --- Запись в таблицу links ---
        await supabase.from('links').insert({
          user_id: id,
          link,
          type: 'trial',
          package_days: 3,
          created_at: new Date().toISOString()
        });
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
      let backendData;
      try { backendData = await backendResp.json(); } catch (e) { backendData = {}; }
      if (backendData && backendData.status === 'ok') {
        const link = `https://vpn.bazara.app/vless/${task_id}`;
        await sendTelegramLink('980466532', link, package_days);
        // --- Запись в таблицу links ---
        await supabase.from('links').insert({
          user_id,
          link,
          type: 'admin',
          package_days,
          created_at: new Date().toISOString()
        });
        return NextResponse.json({ success: true, link });
      } else {
        return NextResponse.json({ success: false, error: backendData.error || 'Ошибка генерации admin-ссылки', details: backendData }, { status: 500 });
      }
    }
    // 3. Обычная покупка (balance, sbp, card, crypto): 30 или 365 дней
    if (!user_id || !package_days || !method) {
      return NextResponse.json({ success: false, error: 'Missing params', details: { user_id, package_days, method } }, { status: 400 });
    }
    if (method === 'balance') {
      if (typeof amount !== 'number') return NextResponse.json({ success: false, error: 'No amount' }, { status: 400 });
      const { data: user, error } = await supabase.from('users').select('balance').eq('id', user_id).single();
      if (error || !user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 400 });
      if (user.balance < amount) return NextResponse.json({ success: false, error: 'Недостаточно средств на балансе' }, { status: 400 });
      await supabase.from('users').update({ balance: user.balance - amount }).eq('id', user_id);
    }
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
    let backendData;
    try { backendData = await backendResp.json(); } catch (e) { backendData = {}; }
    if (backendData && backendData.status === 'ok') {
      const link = `https://vpn.bazara.app/vless/${task_id}`;
      await sendTelegramLink(telegram_id || user_id, link, package_days);
      return NextResponse.json({ success: true, link });
    } else {
      return NextResponse.json({ success: false, error: backendData.error || 'Ошибка генерации ссылки', details: backendData }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error', details: e }, { status: 500 });
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