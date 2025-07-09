import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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
    // 2. Генерируем ссылку (как при оплате), но package_days: 3
    // Здесь должен быть ваш механизм генерации ссылки, например:
    // const link = await generateVpnLink(telegram_id, 3);
    // Для примера — просто фейковая ссылка:
    const link = `https://vpn.bazara.app/vless/trial_${telegram_id}_${Date.now()}`;
    return NextResponse.json({ success: true, link });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
} 