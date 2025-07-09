import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';

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
    // 2. Генерируем trial-ссылку через питоновский скрипт (как в afterpay)
    const email = `telegram_${telegram_id}@trial.bazara`;
    const package_days = 3;
    const task_id = `trial_${telegram_id}_${Date.now()}`;
    const py = spawn('python', ['kluch2/kl2.py', task_id, package_days.toString()]);
    py.stdin.write(JSON.stringify({ email, package_days }) + '\n');
    py.stdin.end();
    let output = '';
    let errorOutput = '';
    const result = await new Promise((resolve, reject) => {
      py.stdout.on('data', (data) => { output += data.toString(); });
      py.stderr.on('data', (data) => { errorOutput += data.toString(); });
      py.on('close', (code) => {
        if (code === 0) {
          resolve({ status: 'ok', output });
        } else {
          reject({ status: 'error', code, output: errorOutput });
        }
      });
    });
    if (result.status === 'ok') {
      const link = `https://vpn.bazara.app/vless/${task_id}`;
      return NextResponse.json({ success: true, link });
    } else {
      return NextResponse.json({ success: false, error: 'Ошибка генерации trial-ссылки', details: result }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
} 