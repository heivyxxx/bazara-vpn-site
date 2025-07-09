"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/LanguageContext';
import { useState } from 'react';
import { getTelegramUser, signInOrUpWithTelegram, upsertUserProfile, getProfileFromUsersTable } from '@/lib/auth';
import { User } from '@/lib/types';

const translations = {
  ru: {
    prices: 'Цены',
    reviews: 'Отзывы',
    support: 'Поддержка',
    login: 'Войти',
    download: 'Скачать',
    bazara: 'Bazara',
    vpn: 'VPN',
  },
  en: {
    prices: 'Prices',
    reviews: 'Reviews',
    support: 'Support',
    login: 'Login',
    download: 'Download',
    bazara: 'Bazara',
    vpn: 'VPN',
  },
};

interface HeaderProps {
  onLogin?: () => void;
  user?: User | null;
  onLogout?: () => void;
}

export const Header = ({ onLogin, user, onLogout }: HeaderProps) => {
  const { lang, setLang } = useLang();
  const t = translations[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const tgUser = getTelegramUser();
      if (!tgUser) { alert('Откройте через Telegram WebApp!'); setLoading(false); return; }
      const supaUser = await signInOrUpWithTelegram(tgUser);
      await upsertUserProfile(tgUser, supaUser.id);
      window.location.reload();
    } catch (e) {
      alert('Ошибка входа: ' + (e?.message || e));
    }
    setLoading(false);
  }

  return (
    <header>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Левая часть: Общий баланс + ава + баланс + ₽ */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex flex-col items-start justify-center min-w-0">
            <span className="text-xs text-gray-400 font-semibold mb-1">Общий баланс</span>
            <div className="flex items-center gap-2">
              {/* Аватар */}
              {user?.photo_url ? (
                <img
                  src={user.photo_url}
                  alt="Аватар"
                  className="w-9 h-9 rounded-full object-cover border border-gray-700 bg-gray-800"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-lg font-bold">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/></svg>
                </div>
              )}
              {/* Баланс */}
              <span className="text-white font-extrabold text-[22px] leading-tight tracking-wide">
                {typeof user?.balance === 'number' ? user.balance.toFixed(2) : '—'}
              </span>
              {/* Иконка рубля */}
              <svg className="w-6 h-6 text-gray-300 ml-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M8 6h6a3 3 0 1 1 0 6H8V4m0 8v8m0-4h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
        {/* Actions (язык, скачать) */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link 
            href="/download" 
            className="bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-semibold py-2 px-5 md:px-6 rounded-xl transition text-base md:text-lg"
          >
            {t.download}
          </Link>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-[#232323] rounded-lg border border-[#fd6a32] text-white hover:bg-[#fd6a32] focus:outline-none text-base ml-1 md:ml-2"
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            aria-label="Сменить язык"
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>
            <span className="font-semibold hidden xs:inline">{lang === 'ru' ? 'Русский' : 'English'}</span>
          </button>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 600px) {
          .text-2xl { font-size: 1.2rem; }
          .py-4 { padding-top: 0.7rem; padding-bottom: 0.7rem; }
        }
      `}</style>
      <style jsx global>{`
        #mobile-menu {
          background: #181818 !important;
          opacity: 0.98;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1000;
        }
      `}</style>
    </header>
  );
}; 