export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQdWJsaWNJZCI6IjNhMTk3OTk3LTlmYzUtZmZkMS0wZGFjLTljYTM1NDZiNWE2ZSIsIlRva2VuVmVyc2lvbiI6IjIiLCJleHAiOjE3NzkzNjQ5ODEsImlzcyI6Imh0dHBzOi8vYXBpLndhdGEucHJvIiwiYXVkIjoiaHR0cHM6Ly9hcGkud2F0YS5wcm8vYXBpL2gyaCJ9.BWlLZN9ktkrccefuwU3KZoOlyHP3VJdFwPQRdxXmBuk";
  const TERMINAL_ID = "3a197997-9fc7-6a0e-0da2-768404f400d7";
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

    const { amount, order_id, description } = body;
    const wataBody = {
      amount: Number(amount),
      currency: "RUB",
      description: description,
      orderId: order_id,
      successRedirectUrl: "https://bazara-vpn-site.vercel.app/success",
      failRedirectUrl: "https://bazara-vpn-site.vercel.app/fail",
      expirationDateTime: "2025-05-24T12:00:00.000Z"
    };
    console.log('WATA BODY:', wataBody);

    const resp = await fetch('https://api.wata.pro/api/h2h/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
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

    res.status(resp.status).json(data);
  } catch (e) {
    console.error('PAY API ERROR:', e);
    res.status(500).json({ error: 'Server error', details: e.message, stack: e.stack });
  }
} 