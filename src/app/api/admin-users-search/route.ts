import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req: NextRequest) {
  try {
    const rawQuery = (req.nextUrl.searchParams.get('q') || '').trim();
    if (!rawQuery) {
      return NextResponse.json({ success: true, users: [] });
    }
    const query = rawQuery.startsWith('@') ? rawQuery.slice(1) : rawQuery;
    const usersMap = new Map<string, any>();

    // Поиск по текстовым полям (username/name)
    const like = `%${query}%`;
    const { data: textData, error: textError } = await supabase
      .from('users')
      .select('id, telegram_id, name, username, balance')
      .or(`name.ilike.${like},username.ilike.${like}`)
      .limit(10);

    if (textError) {
      return NextResponse.json({ success: false, error: textError.message }, { status: 500 });
    }
    for (const u of textData || []) {
      usersMap.set(String(u.id), u);
    }

    // Поиск по числовым id / telegram_id
    if (/^\d+$/.test(query)) {
      const numeric = Number(query);
      const [byId, byTelegramId] = await Promise.all([
        supabase
          .from('users')
          .select('id, telegram_id, name, username, balance')
          .eq('id', numeric)
          .limit(1),
        supabase
          .from('users')
          .select('id, telegram_id, name, username, balance')
          .eq('telegram_id', query)
          .limit(1),
      ]);
      if (byId.error) {
        return NextResponse.json({ success: false, error: byId.error.message }, { status: 500 });
      }
      if (byTelegramId.error) {
        return NextResponse.json({ success: false, error: byTelegramId.error.message }, { status: 500 });
      }
      for (const u of byId.data || []) {
        usersMap.set(String(u.id), u);
      }
      for (const u of byTelegramId.data || []) {
        usersMap.set(String(u.id), u);
      }
    }

    return NextResponse.json({ success: true, users: Array.from(usersMap.values()).slice(0, 10) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
}

