import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTelegramInit } from '@/hooks/useTelegramInit';
import { signInOrUpWithTelegram } from './auth';
import { createClient } from '@supabase/supabase-js';
import { User } from './types';

type Lang = 'ru' | 'en';

interface LangContextProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextProps>({ lang: 'ru', setLang: () => {} });

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('ru');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (stored === 'ru' || stored === 'en') setLang(stored);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('lang', lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);

// --- UserContext ---
interface UserContextProps {
  user: User | null;
  setUser: (u: User | null) => void;
}
const UserContext = createContext<UserContextProps>({ user: null, setUser: () => {} });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Инициализация из localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bazaraUser');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id && parsed.name) setUser(parsed);
        } catch {}
      }
    }
  }, []);

  // Синхронизация с Supabase и Telegram (как в Eclipse)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser && tgUser.id) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      supabase
        .from('users')
        .select('*')
        .eq('id', tgUser.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setUser(data);
            localStorage.setItem('bazaraUser', JSON.stringify(data));
          } else {
            setUser(null);
            localStorage.removeItem('bazaraUser');
          }
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = useContext(UserContext);
  return [user, setUser] as const;
}; 