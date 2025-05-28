export default async function handler(req, res) {
  try {
    const response = await fetch('http://127.0.0.1:6969/generate');
    if (!response.ok) {
      return res.status(500).json({ error: 'Ошибка генерации ссылки', status: response.status });
    }
    const link = await response.text();
    res.status(200).json({ link });
  } catch (e) {
    res.status(500).json({ error: 'Server error', details: e.message });
  }
} 