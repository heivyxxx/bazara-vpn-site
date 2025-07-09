import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTelegramInit } from '@/hooks/useTelegramInit';
import { signInOrUpWithTelegram } from './auth';

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
interface User {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  photo_url?: string;
  balance?: number;
  language_code?: string;
  last_name?: string;
}
interface UserContextProps {
  user: User | null;
  setUser: (u: User | null) => void;
}
const UserContext = createContext<UserContextProps>({ user: null, setUser: () => {} });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  // --- УБРАНО: Telegram Mini App авторизация через useTelegramInit ---
  // Теперь авторизация только в главном компоненте (HomePage)

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

  // Выводим логи на экран для отладки
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {/* DEBUG LOG удалён */}
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = useContext(UserContext);
  return [user, setUser] as const;
}; 