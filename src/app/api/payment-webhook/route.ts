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

    const { transactionStatus, orderId, amount, paymentTime } = body;
    // TODO: Проверка подписи X-Signature
    if (transactionStatus !== 'Paid') {

      return NextResponse.json({ success: true }); // Не оплачено — ничего не делаем
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
        return NextResponse.json({ success: false, error: 'user_id not found in orderId' }, { status: 400 });
      }
      // Получаем текущий баланс
      const { data: user, error: userError } = await supabase.from('users').select('balance').eq('id', user_id).single();
      if (userError || !user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 400 });
      }
      const newBalance = (user.balance || 0) + Number(amount);
      const { error: updateError } = await supabase.from('users').update({ balance: newBalance }).eq('id', user_id);
      if (updateError) {
        return NextResponse.json({ success: false, error: 'Balance update error' }, { status: 500 });
      }
      // Записываем транзакцию (если есть таблица transactions)
      try {
        await supabase.from('transactions').insert({
          user_id,
          amount: Number(amount),
          type: 'deposit',
          status: 'completed',
          meta: { orderId, paymentTime, method: 'deposit' },
        });
      } catch (e) {
      }

      return NextResponse.json({ success: true, balance: newBalance });
    }
    // Для текущего режима (оплата балансом) внешние paid-webhook для подписок не используются.
    return NextResponse.json({ success: true, message: 'ignored for non-deposit flow' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error', details: e }, { status: 500 });
  }
} 