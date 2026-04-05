import { createClient } from '@supabase/supabase-js';

// Предотвращаем краш фронтенда, если переменные окружения Vercel не применились к сборке
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-fix-crash.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';

// Клиентский инстанс
export const supabase = createClient(supabaseUrl, supabaseAnonKey);