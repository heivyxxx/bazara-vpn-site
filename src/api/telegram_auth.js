const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const TELEGRAM_BOT_TOKEN = '7153524021:AAFzY5nkHCOT4SPhQkChgi5QCKuzsGSarAA';

const TRIALS_FILE = path.resolve(__dirname, 'trials.json');
const USERS_FILE = path.resolve(__dirname, 'users.json');

function checkTelegramAuth(data, token) {
  const authData = { ...data };
  delete authData.hash;

  const sortedKeys = Object.keys(authData).sort();
  const dataCheckString = sortedKeys.map(key => `${key}=${authData[key]}`).join('\n');

  const secret = crypto.createHash('sha256').update(token).digest();
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  return hmac === data.hash;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Метод не поддерживается' });

  const data = req.body;

  if (!checkTelegramAuth(data, TELEGRAM_BOT_TOKEN)) {
    return res.status(403).json({ message: 'Ошибка подписи Telegram' });
  }

  const telegram_id = String(data.id);
  const username = data.username || '';
  const first_name = data.first_name || '';

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    if (users.find(u => u.telegram_id === telegram_id)) {
      const existing = users.find(u => u.telegram_id === telegram_id);
      return res.status(200).json({ message: 'Ты уже брал пробную ссылку', link: existing.link });
    }
  }

  if (!fs.existsSync(TRIALS_FILE)) {
    return res.status(500).json({ message: 'Нет доступных пробных ссылок' });
  }

  const trials = JSON.parse(fs.readFileSync(TRIALS_FILE, 'utf8'));
  const available = trials.find(t => !t.used);

  if (!available) {
    return res.status(400).json({ message: 'Пробные ссылки закончились' });
  }

  available.used = true;
  fs.writeFileSync(TRIALS_FILE, JSON.stringify(trials, null, 2), 'utf8');

  const userEntry = {
    telegram_id,
    username,
    first_name,
    link: available.link,
    date: new Date().toISOString().slice(0, 10)
  };

  users.push(userEntry);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');

  return res.status(200).json({ message: 'Ваша пробная ссылка', link: available.link });
}