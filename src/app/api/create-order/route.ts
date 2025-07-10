import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    console.error('Ошибка парсинга JSON в create-order:', e);
    return NextResponse.json({ success: false, error: 'Invalid JSON', details: e }, { status: 400 });
  }
  try {
    console.log('CREATE-ORDER BODY:', body);
    const { user_id, package_days, order_id, method, amount, description } = body;
    const isDeposit = (description && description.includes('Пополнение баланса')) || (order_id && order_id.startsWith('deposit_'));
    if (!user_id || !order_id || !method || !amount || (!isDeposit && !package_days)) {
      console.error('Missing params:', { user_id, package_days, order_id, method, amount });
      return NextResponse.json({ success: false, error: 'Missing params', details: { user_id, package_days, order_id, method, amount } }, { status: 400 });
    }
    if (method !== 'sbp' && method !== 'card') {
      console.error('Unsupported method:', method);
      return NextResponse.json({ success: false, error: 'Unsupported method' }, { status: 400 });
    }
    // Выбор токена и терминала по методу оплаты
    let apiKey = process.env.WATA_API_TOKEN;
    let terminalId = process.env.WATA_TERMINAL_ID;
    if (method === 'card' && process.env.WATA_API_TOKEN_CARD && process.env.WATA_TERMINAL_ID_CARD) {
      apiKey = process.env.WATA_API_TOKEN_CARD;
      terminalId = process.env.WATA_TERMINAL_ID_CARD;
    }
    // expirationDateTime: +2 дня
    const now = new Date();
    now.setDate(now.getDate() + 2);
    now.setMilliseconds(0);
    const paymentApiUrl = 'https://api.wata.pro/api/h2h/links';
    const paymentBody = {
      amount: Number(amount),
      currency: 'RUB',
      description: `BazaraVPN ${package_days} days for user ${user_id}`,
      orderId: order_id,
      terminalId: terminalId,
      successRedirectUrl: 'https://bazara.app/success',
      failRedirectUrl: 'https://bazara.app/fail',
      expirationDateTime: now.toISOString()
    };
    const resp = await fetch(paymentApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(paymentBody)
    });
    // Расширенное логирование
    console.log('WATA request body:', paymentBody);
    console.log('WATA status:', resp.status, resp.statusText);
    console.log('WATA headers:', JSON.stringify(Array.from(resp.headers.entries())));
    const rawText = await resp.text();
    console.log('WATA rawText:', rawText);
    let data;
    const contentType = resp.headers.get('content-type') || '';
    if (!rawText || !contentType.includes('application/json')) {
      console.error('WATA вернула пустой или не-JSON ответ:', rawText);
      return NextResponse.json({ success: false, error: 'WATA returned empty or non-JSON response', details: rawText }, { status: 500 });
    }
    try {
      data = JSON.parse(rawText);
    } catch (jsonErr) {
      console.error('Ошибка парсинга JSON от WATA:', jsonErr, 'Ответ:', rawText);
      return NextResponse.json({ success: false, error: 'WATA returned invalid JSON', details: rawText }, { status: 500 });
    }
    if (isDeposit && data && (data.url || data.paymentUrl)) {
      const url = data.url || data.paymentUrl;
      console.log('DEPOSIT paymentUrl:', url);
      return NextResponse.json({ success: true, paymentUrl: url });
    }
    if (data && (data.url || data.paymentUrl)) {
      const url = data.url || data.paymentUrl;
      console.log('WATA url:', url);
      return NextResponse.json({ success: true, paymentUrl: url });
    } else {
      console.error('Ошибка WATA:', data);
      return NextResponse.json({ success: false, error: data?.error || 'Ошибка создания ссылки на оплату', details: data }, { status: 500 });
    }
  } catch (e: any) {
    console.error('FATAL ERROR /api/create-order:', e);
    return NextResponse.json({ success: false, error: e.message || 'Server error', details: e }, { status: 500 });
  }
} 