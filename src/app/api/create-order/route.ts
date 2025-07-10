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
    const { user_id, package_days, order_id, method, amount } = body;
    if (!user_id || !package_days || !order_id || !method || !amount) {
      console.error('Missing params:', { user_id, package_days, order_id, method, amount });
      return NextResponse.json({ success: false, error: 'Missing params', details: { user_id, package_days, order_id, method, amount } }, { status: 400 });
    }
    if (method !== 'sbp' && method !== 'card') {
      console.error('Unsupported method:', method);
      return NextResponse.json({ success: false, error: 'Unsupported method' }, { status: 400 });
    }
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
    let data;
    try {
      data = await resp.json();
    } catch (jsonErr) {
      console.error('Ошибка парсинга JSON от WATA:', jsonErr);
      return NextResponse.json({ success: false, error: 'WATA returned invalid JSON', details: jsonErr }, { status: 500 });
    }
    if (data && data.paymentUrl) {
      console.log('WATA paymentUrl:', data.paymentUrl);
      return NextResponse.json({ success: true, url: data.paymentUrl });
    } else {
      console.error('Ошибка WATA:', data);
      return NextResponse.json({ success: false, error: data?.error || 'Ошибка создания ссылки на оплату', details: data }, { status: 500 });
    }
  } catch (e: any) {
    console.error('FATAL ERROR /api/create-order:', e);
    return NextResponse.json({ success: false, error: e.message || 'Server error', details: e }, { status: 500 });
  }
} 