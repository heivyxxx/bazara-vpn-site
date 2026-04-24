import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function asNumericId(value: string): number | null {
  const trimmed = String(value || '').trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const enabled = Boolean(body?.enabled);
    const rawUserId = String(body?.user_id || '').trim();
    const numericUserId = asNumericId(rawUserId);
    if (numericUserId === null) {
      return NextResponse.json({ success: false, error: 'Invalid user id' }, { status: 400 });
    }

    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('id, user_id, auto_renew, status')
      .eq('user_id', numericUserId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError) {
      return NextResponse.json({ success: false, error: subError.message }, { status: 500 });
    }
    if (!sub) {
      return NextResponse.json({ success: false, error: 'No active subscription' }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ auto_renew: enabled, updated_at: new Date().toISOString() })
      .eq('id', sub.id);

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, auto_renew: enabled, subscription_id: sub.id });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
}

