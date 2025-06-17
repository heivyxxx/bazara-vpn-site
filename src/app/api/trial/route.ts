import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { telegram_id, name, username } = await request.json();
    if (!telegram_id) {
      return NextResponse.json({ success: false, error: 'No telegram_id' }, { status: 400 });
    }
    // Проверяем, был ли уже trial
    const trialRef = doc(collection(db, 'trials'), String(telegram_id));
    const trialSnap = await getDoc(trialRef);
    if (trialSnap.exists()) {
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
      await setDoc(trialRef, { date: Date.now(), link: data.url, telegram_id, name, username });
      return NextResponse.json({ success: true, link: data.url });
    } else {
      return NextResponse.json({ success: false, error: data.error || 'Ошибка генерации trial-ссылки' }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
} 