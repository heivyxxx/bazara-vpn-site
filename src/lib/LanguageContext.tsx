import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTelegramInit } from '@/hooks/useTelegramInit';
import { signInOrUpWithTelegram } from './auth';
import { supabase } from '@/lib/supabaseClient';
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
  const handleTgUser = React.useCallback((tgData: any) => {
    // 1. Мгновенно заполняем стейт данными из Telegram WebApp, чтобы шапка не показывала "Пользователь"
    setUser((prev: any) => ({
      ...(prev || {}),
      id: String(tgData.id),
      name: tgData.name,
      username: tgData.username,
      avatar: tgData.photo_url,
      balance: prev?.balance || 0,
    }));

    // 2. Запрашиваем бекенд (регистрация/авторизация), чтобы подтянуть реальный баланс и базу
    if (typeof window !== 'undefined') {
      const tgUserFull = window.Telegram?.WebApp?.initDataUnsafe?.user;
      if (tgUserFull) {
        signInOrUpWithTelegram(tgUserFull).then((dbUser) => {
          if (dbUser) {
            setUser(dbUser);
            localStorage.setItem('bazaraUser', JSON.stringify(dbUser));
          }
        });
      }
    }
  }, []);

  useTelegramInit(handleTgUser);

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