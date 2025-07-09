import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BACKEND_URL = 'https://vpn.bazara.app/generate';

export async function POST(request: Request) {
  try {
    const { telegram_id } = await request.json();
    if (!telegram_id) {
      return NextResponse.json({ success: false, error: 'No telegram_id' }, { status: 400 });
    }
    // 1. Ставим trial=true
    const { error: updateError } = await supabase
      .from('users')
      .update({ trial: true })
      .eq('id', telegram_id);
    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }
    // 2. Генерируем trial task_id и делаем запрос на backend
    const task_id = `trial_${telegram_id}_${Date.now()}`;
    const package_days = 3;
    const creator = 'trial';
    const backendResp = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id, package_days, creator })
    });
    const backendData = await backendResp.json();
    if (backendData && backendData.status === 'ok') {
      const link = `https://vpn.bazara.app/vless/${task_id}`;
      return NextResponse.json({ success: true, link });
    } else {
      return NextResponse.json({ success: false, error: backendData.error || 'Ошибка генерации trial-ссылки', details: backendData }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
} 