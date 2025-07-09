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
  // ... другие поля ...
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
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 99999, background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: 12, maxWidth: 400, maxHeight: 300, overflow: 'auto', padding: 8 }}>
        <b>DEBUG LOG:</b>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {debugLog.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
        <b>user:</b> {JSON.stringify(user)}
      </div>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = useContext(UserContext);
  return [user, setUser] as const;
}; 