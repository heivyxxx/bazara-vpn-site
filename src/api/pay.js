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
    const wataBody = {
      amount: Number(amount),
      currency: "RUB",
      description: description,
      orderId: order_id,
      terminalId: terminalId,
      successRedirectUrl: "https://bazara-vpn-site.vercel.app/success",
      failRedirectUrl: "https://bazara-vpn-site.vercel.app/fail",
      expirationDateTime: new Date(Date.now() + 24*60*60*1000).toISOString()
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

    res.status(resp.status).json(data);
  } catch (e) {
    console.error('PAY API ERROR:', e);
    res.status(500).json({ error: 'Server error', details: e.message, stack: e.stack });
  }
} 