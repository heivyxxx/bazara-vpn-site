export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { taskId } = req.query;
  if (!taskId) {
    return res.status(400).json({ status: 'error', message: 'Не передан taskId' });
  }

  try {
    // Используем основной домен VPS с HTTPS
    const url = `https://vpn.bazara.app/get-latest-token?task_id=${encodeURIComponent(taskId)}`;
    const vpsResp = await fetch(url);
    if (!vpsResp.ok) {
      return res.status(502).json({ status: 'error', message: 'Ошибка запроса к VPS', code: vpsResp.status });
    }
    const data = await vpsResp.json();
    if (data && data.token) {
      return res.status(200).json({
        status: 'ok',
        link: `https://bazara-vpn-site.vercel.app/vless/${data.token}`
      });
    } else {
      return res.status(200).json({ status: 'waiting' });
    }
  } catch (e) {
    return res.status(500).json({ status: 'error', message: e.message });
  }
} 