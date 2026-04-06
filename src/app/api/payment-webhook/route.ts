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
    if (getError) {
      console.error('SUPABASE getError:', getError);
    }
    // --- Депозит ---
    if (orderId.startsWith('deposit_') || (body.orderDescription && body.orderDescription.includes('Пополнение баланса'))) {
      // Найти пользователя по email или другим данным (если есть)
      // В твоём случае user_id можно попробовать достать из orderId или email
      // Пример: deposit_{user_id}_{timestamp} или просто deposit_{timestamp}
      // Если user_id не в orderId, потребуется хранить соответствие orderId <-> user_id при создании заказа
      // Здесь предполагаем, что user_id в orderId: deposit_{user_id}_{timestamp}
      const parts = orderId.split('_');
      let user_id = parts.length >= 3 ? parts[1] : null;
      if (!user_id) {
        console.error('DEPOSIT: user_id not found in orderId', orderId);
        return NextResponse.json({ success: false, error: 'user_id not found in orderId' }, { status: 400 });
      }
      // Получаем текущий баланс
      const { data: user, error: userError } = await supabase.from('users').select('balance').eq('id', user_id).single();
      if (userError || !user) {
        console.error('DEPOSIT: user not found', userError);
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 400 });
      }
      const newBalance = (user.balance || 0) + Number(amount);
      const { error: updateError } = await supabase.from('users').update({ balance: newBalance }).eq('id', user_id);
      if (updateError) {
        console.error('DEPOSIT: balance update error', updateError);
        return NextResponse.json({ success: false, error: 'Balance update error' }, { status: 500 });
      }
      // Записываем транзакцию (если есть таблица transactions)
      try {
        await supabase.from('transactions').insert({
          user_id,
          amount: Number(amount),
          type: 'deposit',
          meta: { orderId, paymentTime, method: 'deposit' },
        });
      } catch (e) {
        console.error('DEPOSIT: transaction insert error', e);
      }

      return NextResponse.json({ success: true, balance: newBalance });
    }
    // --- Конец блока депозита ---
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
    let payResp, payData;
    try {
      payResp = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/pay`, {
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
      payData = await payResp.json();

    } catch (e) {
      console.error('WATA WEBHOOK: fetch /api/pay error:', e);
      return NextResponse.json({ success: false, error: 'fetch /api/pay error', details: e }, { status: 500 });
    }
    if (payData && payData.success && payData.link) {
      try {
        const insertRes = await supabase.from('links').insert({ order_id: orderId, user_id, link: payData.link, type, package_days, amount, telegram_id: email });
        if (insertRes.error) {
          console.error('SUPABASE insert error:', insertRes.error);
        }

      } catch (e) {
        console.error('SUPABASE insert exception:', e);
      }
      return NextResponse.json({ success: true, link: payData.link });
    } else {
      console.error('WATA WEBHOOK: payData error', payData);
      return NextResponse.json({ success: false, error: payData?.error || 'Ошибка генерации ссылки', details: payData }, { status: 500 });
    }
  } catch (e: any) {
    console.error('WEBHOOK FATAL ERROR:', e);
    return NextResponse.json({ success: false, error: e.message || 'Server error', details: e }, { status: 500 });
  }
} 