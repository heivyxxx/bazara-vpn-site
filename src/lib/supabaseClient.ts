import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// ВАЖНО: Использовать только на сервере (API Routes, Server Actions) для обхода RLS 
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Клиентский инстанс
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Серверный инстанс
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);