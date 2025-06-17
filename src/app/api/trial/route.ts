import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TRIALS_PATH = path.resolve(process.cwd(), 'src/api/trials.json');

function readTrials() {
  try {
    return JSON.parse(fs.readFileSync(TRIALS_PATH, 'utf-8'));
  } catch {
    return {};
  }
}
function writeTrials(data: any) {
  fs.writeFileSync(TRIALS_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request: Request) {
  try {
    const { telegram_id, name, username } = await request.json();
    if (!telegram_id) {
      return NextResponse.json({ success: false, error: 'No telegram_id' }, { status: 400 });
    }
    const trials = readTrials();
    if (trials[telegram_id]) {
      return NextResponse.json({ success: false, error: 'already_used' }, { status: 400 });
    }
    // Генерируем trial-ссылку через тот же API, что и оплата, но package_days: 3
    const order_id = 'trial_' + telegram_id + '_' + Date.now();
    const requestBody = {
      amount: 0,
      order_id,
      description: 'Пробный период BazaraVPN',
      method: 'trial',
      email: username ? username + '@trial.bazara' : 'trial@bazara',
      package_days: 3
    };
    const payApiUrl = process.env.PAY_API_URL || 'http://localhost:3000/api/pay';
    const resp = await fetch(payApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    const data = await resp.json();
    if (data && data.url) {
      trials[telegram_id] = { date: Date.now(), link: data.url };
      writeTrials(trials);
      return NextResponse.json({ success: true, link: data.url });
    } else {
      return NextResponse.json({ success: false, error: data.error || 'Ошибка генерации trial-ссылки' }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
} 