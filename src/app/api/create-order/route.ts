import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, package_days, order_id, method, amount } = body;
    if (!user_id || !package_days || !order_id || !method || !amount) {
      return NextResponse.json({ success: false, error: 'Missing params' }, { status: 400 });
    }
    // Только для sbp и card
    if (method !== 'sbp' && method !== 'card') {
      return NextResponse.json({ success: false, error: 'Unsupported method' }, { status: 400 });
    }
    // Пример запроса к платёжке (замени на реальный API)
    const paymentApiUrl = 'https://api.wata.pro/api/h2h/payment-link';
    const resp = await fetch(paymentApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WATA_API_TOKEN}`
      },
      body: JSON.stringify({
        orderId: order_id,
        amount,
        currency: 'RUB',
        type: method === 'sbp' ? 'SBP' : 'CardCrypto',
        description: `BazaraVPN ${package_days} days for user ${user_id}`
      })
    });
    const data = await resp.json();
    if (data && data.paymentUrl) {
      return NextResponse.json({ success: true, paymentUrl: data.paymentUrl });
    } else {
      return NextResponse.json({ success: false, error: data.error || 'Ошибка создания ссылки на оплату', details: data }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
} 