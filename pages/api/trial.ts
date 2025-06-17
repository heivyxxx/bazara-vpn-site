import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Логируем переменные окружения для диагностики
  console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
  console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
  console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'OK' : 'MISSING');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  try {
    const { telegram_id, name, username } = req.body;
    if (!telegram_id) {
      return res.status(400).json({ success: false, error: 'No telegram_id' });
    }
    // Проверяем, был ли уже trial
    const trialRef = adminDb.collection('trials').doc(String(telegram_id));
    const trialSnap = await trialRef.get();
    if (trialSnap.exists) {
      return res.status(400).json({ success: false, error: 'already_used' });
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
      await trialRef.set({ date: Date.now(), link: data.url, telegram_id, name, username });
      return res.status(200).json({ success: true, link: data.url });
    } else {
      return res.status(500).json({ success: false, error: data.error || 'Ошибка генерации trial-ссылки' });
    }
  } catch (e: any) {
    console.error('TRIAL ERROR:', e, e?.message);
    return res.status(500).json({ success: false, error: e.message || 'Server error' });
  }
} 