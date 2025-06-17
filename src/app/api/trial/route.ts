import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { telegram_id, name, username } = await request.json();
    if (!telegram_id) {
      return NextResponse.json({ success: false, error: 'No telegram_id' }, { status: 400 });
    }
    // Запрос к backend Flask (замени на свой реальный адрес, если не локалхост)
    const backendUrl = process.env.BAZARA_BACKEND_URL || 'https://kluch2.yourdomain.com/api/trial';
    const resp = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id, name, username })
    });
    const data = await resp.json();
    if (!data.success) {
      // Если trial уже был
      if (data.error && data.error.toLowerCase().includes('trial')) {
        return NextResponse.json({ success: false, error: 'already_used' }, { status: 400 });
      }
      return NextResponse.json({ success: false, error: data.error || 'Unknown error' }, { status: 500 });
    }
    return NextResponse.json({ success: true, link: data.link });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
} 