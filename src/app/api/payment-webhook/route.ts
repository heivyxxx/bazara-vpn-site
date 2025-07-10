import { NextResponse } from 'next/server';

// Импортируй нужные зависимости для работы с Supabase, если нужно
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Импортируй функцию генерации ссылки, если нужно

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionStatus, orderId, amount, transactionType, paymentTime, email } = body;
    // TODO: Проверка подписи X-Signature
    if (transactionStatus !== 'Paid') {
      return NextResponse.json({ success: true }); // Не оплачено — ничего не делаем
    }
    // Проверяем, есть ли уже ссылка для этого orderId
    const { data: existing, error: getError } = await supabase.from('links').select('link').eq('order_id', orderId).single();
    if (existing && existing.link) {
      return NextResponse.json({ success: true, link: existing.link });
    }
    // Генерируем ссылку (вызываем /api/pay или напрямую)
    const parts = orderId.split('_');
    const method = parts[0];
    const user_id = parts[1];
    const type = method === 'sbp' ? 'sbp' : (method === 'card' ? 'card' : 'other');
    const package_days = 30; // или 365, если нужно (можно хранить в orderId или в БД)
    // Генерируем ссылку через /api/pay
    const payResp = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        package_days,
        order_id: orderId,
        method,
        amount
      })
    });
    const payData = await payResp.json();
    if (payData && payData.success && payData.link) {
      // Сохраняем ссылку по orderId в links
      await supabase.from('links').insert({ order_id: orderId, user_id, link: payData.link, type, package_days, amount, telegram_id: email });
      return NextResponse.json({ success: true, link: payData.link });
    } else {
      return NextResponse.json({ success: false, error: payData.error || 'Ошибка генерации ссылки' }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
} 