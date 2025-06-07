import { spawn } from 'child_process';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    let body = req.body;
    if (!body || typeof body === 'string') {
      body = JSON.parse(body || '{}');
    }
    const { email, package_days, task_id } = body;
    if (!email || !package_days || !task_id) {
      return res.status(400).json({ error: 'Не хватает параметров' });
    }
    // Запускаем kl2.py с нужными параметрами через stdin (json)
    const py = spawn('python', ['kluch2/kl2.py', task_id, package_days]);
    py.stdin.write(JSON.stringify({ email, package_days }) + '\n');
    py.stdin.end();

    let output = '';
    py.stdout.on('data', (data) => { output += data.toString(); });
    py.stderr.on('data', (data) => { output += data.toString(); });

    py.on('close', (code) => {
      if (code === 0) {
        res.status(200).json({ status: 'ok', output });
      } else {
        res.status(500).json({ status: 'error', code, output });
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error', details: e.message });
  }
} 