import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = String(body?.user_id || '').trim();
    const action = String(body?.action || '').trim(); // credit | debit
    const amount = Number(body?.amount || 0);

    if (!userId || !['credit', 'debit'].includes(action) || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid params' }, { status: 400 });
    }

    const roundedAmount = Math.round(amount * 100) / 100;
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, balance')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const currentBalance = Number(user.balance || 0);
    const nextBalance = action === 'credit' ? currentBalance + roundedAmount : currentBalance - roundedAmount;
    if (nextBalance < 0) {
      return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: nextBalance })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    await supabase.from('transactions').insert({
      user_id: userId,
      amount: roundedAmount,
      type: 'manual_adjustment',
      status: 'completed',
      meta: {
        direction: action,
        source: 'admin_balances',
      },
    });

    return NextResponse.json({
      success: true,
      user_id: userId,
      balance: nextBalance,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
}

