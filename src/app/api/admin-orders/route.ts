import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req: NextRequest) {
  try {
    const q = (req.nextUrl.searchParams.get('q') || '').trim();
    let query = supabase
      .from('orders')
      .select('id, order_id, user_id, amount, package_days, method, status, link, created_at, error_message')
      .order('created_at', { ascending: false })
      .limit(50);

    if (q) {
      const like = `%${q}%`;
      query = query.or(`order_id.ilike.${like},method.ilike.${like},status.ilike.${like}`);
      if (/^\d+$/.test(q)) {
        query = query.eq('user_id', Number(q));
      }
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, orders: data || [] });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
}

