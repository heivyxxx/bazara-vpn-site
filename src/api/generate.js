import { spawn } from 'child_process';

export default async function handler(req, res) {
  try {
    const python = spawn('python', ['../kluch2/kl2.py']);
    let output = '';
    let error = '';
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    python.stderr.on('data', (data) => {
      error += data.toString();
    });
    python.on('close', (code) => {
      const match = output.match(/Ссылка для пользователя: (https?:\/\/\S+)/);
      if (match && match[1]) {
        const link = encodeURIComponent(match[1]);
        res.writeHead(302, { Location: `/success?link=${link}` });
        res.end();
      } else {
        res.status(500).json({ error: 'Не удалось получить ссылку', output, error });
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error', details: e.message });
  }
} 