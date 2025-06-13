export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQdWJsaWNJZCI6IjNhMTk3OTk3LTlmYzUtZmZkMS0wZGFjLTljYTM1NDZiNWE2ZSIsIlRva2VuVmVyc2lvbiI6IjIiLCJleHAiOjE3NzkzNjQ5ODEsImlzcyI6Imh0dHBzOi8vYXBpLndhdGEucHJvIiwiYXVkIjoiaHR0cHM6Ly9hcGkud2F0YS5wcm8vYXBpL2gyaCJ9.BWlLZN9ktkrccefuwU3KZoOlyHP3VJdFwPQRdxXmBuk";
  const TERMINAL_ID = "3a197997-9fc7-6a0e-0da2-768404f400d7";
  const API_KEY_CARD = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQdWJsaWNJZCI6IjNhMTk0YTQ4LWM4NGItZGY1Ny04MzE5LTcwYTk0ZGRlNDMyOCIsIlRva2VuVmVyc2lvbiI6IjIiLCJleHAiOjE3Nzk0NDI4MzcsImlzcyI6Imh0dHBzOi8vYXBpLndhdGEucHJvIiwiYXVkIjoiaHR0cHM6Ly9hcGkud2F0YS5wcm8vYXBpL2gyaCJ9.55DqWnd0aJmkQB7953hpEDbKOXwQYTqg61MgAHJ5toU";
  const TERMINAL_ID_CARD = "3a194a48-c84f-49ea-ec2c-ea1ecadccc33";
  try {
    let body = req.body;
    if (!body || typeof body === 'string') {
      body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(e); }
        });
      });
    }
    console.log('PAY API BODY:', body);

    const { amount, order_id, description, method } = body;
    let apiKey = API_KEY;
    let terminalId = TERMINAL_ID;
    if (method === 'card') {
      apiKey = API_KEY_CARD;
      terminalId = TERMINAL_ID_CARD;
    }
    // Делаю expirationDateTime: +3 часа и +2 минуты, как на старой html-странице
    const now = new Date(Date.now() + (3 * 60 + 2) * 60 * 1000);
    now.setMilliseconds(0);
    const wataBody = {
      amount: Number(amount),
      currency: "RUB",
      description: description,
      orderId: order_id,
      terminalId: terminalId,
      successRedirectUrl: "https://bazara-vpn-site.vercel.app/tariffs.html?afterpay=1",
      failRedirectUrl: "https://bazara-vpn-site.vercel.app/fail",
      expirationDateTime: now.toISOString()
    };
    console.log('WATA BODY:', wataBody);

    const resp = await fetch('https://api.wata.pro/api/h2h/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(wataBody)
    });

    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: 'Wata.pro returned non-JSON',
        wataResponse: text
      });
    }

    console.log('WATA RESPONSE:', data);

    if (method === 'crypto') {
      try {
        const npResp = await fetch('https://api.nowpayments.io/v1/invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'DR8ERAS-3S84CGC-QANNK8Q-GH71ZCQ'
          },
          body: JSON.stringify({
            price_amount: Number(amount),
            price_currency: 'rub',
            pay_currency: 'btc',
            order_id: order_id,
            order_description: description,
            success_url: 'https://bazara-vpn-site.vercel.app/tariffs.html?afterpay=1',
            cancel_url: 'https://bazara-vpn-site.vercel.app/fail'
          })
        });
        const npData = await npResp.json();
        if (npData && npData.invoice_url) {
          return res.status(200).json({ url: npData.invoice_url });
        } else {
          console.log('NOWPayments error:', npData);
          return res.status(500).json({ error: 'NOWPayments error', details: npData });
        }
      } catch (e) {
        console.log('NOWPayments fetch error:', e);
        return res.status(500).json({ error: 'NOWPayments fetch error', details: e.message });
      }
    }

    res.status(resp.status).json(data);
  } catch (e) {
    console.error('PAY API ERROR:', e);
    res.status(500).json({ error: 'Server error', details: e.message, stack: e.stack });
  }
} 