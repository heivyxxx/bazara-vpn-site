"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/LanguageContext';
import { useState } from 'react';
import { getTelegramUser, signInOrUpWithTelegram, upsertUserProfile, getProfileFromUsersTable } from '@/lib/auth';

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
  user?: import('@/lib/types').User | null;
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
      // Можно получить профиль из users
      // const profile = await getProfileFromUsersTable(supaUser.id);
      window.location.reload();
    } catch (e) {
      alert('Ошибка входа: ' + (e?.message || e));
    }
    setLoading(false);
  }

  return (
    <header>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <Image 
            src="/assets/logo-bazara.png" 
            alt="BazaraVPN" 
            width={40} 
            height={40} 
            className="w-10 h-10 min-w-[40px] min-h-[40px]"
            priority
          />
          <span className="text-2xl font-bold text-white">
            {t.bazara}<span className="text-white">{t.vpn}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {/* Удалено: навигация по тарифам, отзывам, поддержке */}

        {/* Actions */}
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
      {/* Удаляю бургер и мобильное меню */}
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
          /* Можно добавить blur, если хочется */
          /* backdrop-filter: blur(8px); */
        }
      `}</style>
    </header>
  );
}; 