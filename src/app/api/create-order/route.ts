import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Invalid JSON', details: e }, { status: 400 });
  }
  try {

    const { user_id, package_days, order_id, method, amount, description } = body;
    const isDeposit = (description && description.includes('Пополнение баланса')) || (order_id && order_id.startsWith('deposit_'));
    if (!user_id || !order_id || !method || !amount || (!isDeposit && !package_days)) {
      return NextResponse.json({ success: false, error: 'Missing params', details: { user_id, package_days, order_id, method, amount } }, { status: 400 });
    }
    if (method !== 'sbp' && method !== 'card') {
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
      description: isDeposit ? 'BazaraVpn Deposit' : `BazaraVPN ${package_days} days for user ${user_id}`,
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



    const rawText = await resp.text();

    let data;
    const contentType = resp.headers.get('content-type') || '';
    if (!rawText || !contentType.includes('application/json')) {
      return NextResponse.json({ success: false, error: 'WATA returned empty or non-JSON response', details: rawText }, { status: 500 });
    }
    try {
      data = JSON.parse(rawText);
    } catch (jsonErr) {
      return NextResponse.json({ success: false, error: 'WATA returned invalid JSON', details: rawText }, { status: 500 });
    }
    if (isDeposit && data && (data.url || data.paymentUrl)) {
      const url = data.url || data.paymentUrl;

      return NextResponse.json({ success: true, paymentUrl: url });
    }
    if (data && (data.url || data.paymentUrl)) {
      const url = data.url || data.paymentUrl;

      return NextResponse.json({ success: true, paymentUrl: url });
    } else {
      return NextResponse.json({ success: false, error: data?.error || 'Ошибка создания ссылки на оплату', details: data }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error', details: e }, { status: 500 });
  }
} 