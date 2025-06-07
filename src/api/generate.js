export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    let body = req.body;
    if (!body || typeof body === 'string') {
      body = JSON.parse(body || '{}');
    }
    const { task_id } = body;
    if (!task_id) {
      return res.status(400).json({ error: 'Не передан task_id' });
    }
    // Отправляем task_id на VPS для старта генерации
    const vpsResp = await fetch('https://vpn.bazara.app/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id })
    });
    if (!vpsResp.ok) {
      return res.status(500).json({ error: 'Ошибка запроса к VPS', status: vpsResp.status });
    }
    res.status(200).json({ task_id });
  } catch (e) {
    res.status(500).json({ error: 'Server error', details: e.message });
  }
} 