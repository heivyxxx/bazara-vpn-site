"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/LanguageContext';
import { useState } from 'react';
import { TelegramAuthModal } from '@/components/features/TelegramAuthModal';

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-lg border-b border-[#333]">
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
          <span className="text-2xl font-bold text-white truncate max-w-[120px] sm:max-w-none">
            {t.bazara}<span className="text-white">{t.vpn}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/tariffs" 
            className="text-white hover:text-orange-400 transition"
          >
            {t.prices}
          </Link>
          <Link 
            href="/reviews" 
            className="text-white hover:text-orange-400 transition"
          >
            {t.reviews}
          </Link>
          <Link 
            href="/support" 
            className="text-white hover:text-orange-400 transition"
          >
            {t.support}
          </Link>
        </nav>

        {/* Mobile burger */}
        <button className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg hover:bg-[#232323] transition ml-2" onClick={()=>setMenuOpen(v=>!v)} aria-label="Открыть меню">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <Image src={user.photo_url || '/assets/avatar1.png'} alt={user.name} width={40} height={40} className="w-10 h-10 rounded-full border-2 border-orange-400 shadow" />
              <span className="text-white font-semibold text-base hidden md:inline">{user.name}</span>
              <button onClick={onLogout} className="ml-2 px-3 py-2 bg-[#232323] rounded-lg border border-gray-700 text-white hover:bg-[#2c2c2c] text-sm">Выйти</button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="text-white hover:text-orange-400 transition hidden md:block font-semibold"
            >
              {t.login}
            </button>
          )}
          <Link 
            href="/download" 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-5 md:px-6 rounded-xl shadow-lg transition text-base md:text-lg"
          >
            {t.download}
          </Link>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-[#232323] rounded-lg border border-gray-700 text-white hover:bg-[#2c2c2c] focus:outline-none text-base ml-1 md:ml-2"
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            aria-label="Сменить язык"
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>
            <span className="font-semibold hidden xs:inline">{lang === 'ru' ? 'Русский' : 'English'}</span>
          </button>
        </div>
      </div>
      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={()=>setMenuOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 z-50 w-4/5 max-w-xs h-full bg-[#232323] shadow-2xl transition-transform duration-300 md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{willChange:'transform'}}>
        <div className="flex flex-col gap-2 p-6 pt-8">
          <button className="self-end mb-4 text-gray-400 hover:text-white" onClick={()=>setMenuOpen(false)} aria-label="Закрыть меню">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6"/></svg>
          </button>
          <Link href="/tariffs" className="text-white text-lg font-semibold py-3 px-2 rounded-lg hover:bg-[#181818] transition" onClick={()=>setMenuOpen(false)}>{t.prices}</Link>
          <Link href="/reviews" className="text-white text-lg font-semibold py-3 px-2 rounded-lg hover:bg-[#181818] transition" onClick={()=>setMenuOpen(false)}>{t.reviews}</Link>
          <Link href="/support" className="text-white text-lg font-semibold py-3 px-2 rounded-lg hover:bg-[#181818] transition" onClick={()=>setMenuOpen(false)}>{t.support}</Link>
          <button onClick={()=>{setMenuOpen(false);onLogin&&onLogin();}} className="text-white text-lg font-semibold py-3 px-2 rounded-lg hover:bg-[#181818] transition text-left">{t.login}</button>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 600px) {
          .text-2xl { font-size: 1.2rem; }
          .py-4 { padding-top: 0.7rem; padding-bottom: 0.7rem; }
        }
      `}</style>
    </header>
  );
}; 