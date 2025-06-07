"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/LanguageContext';

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

export const Header = () => {
  const { lang, setLang } = useLang();
  const t = translations[lang];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-lg border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/assets/logo-bazara.png" 
            alt="BazaraVPN" 
            width={40} 
            height={40} 
            className="w-10 h-10"
            priority
          />
          <span className="text-2xl font-bold text-white">
            {t.bazara}<span className="text-white">{t.vpn}</span>
          </span>
        </Link>

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

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-white hover:text-orange-400 transition hidden md:block"
          >
            {t.login}
          </Link>
          <Link 
            href="/download" 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition"
          >
            {t.download}
          </Link>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-[#232323] rounded-lg border border-gray-700 text-white hover:bg-[#2c2c2c] focus:outline-none text-base ml-2"
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            aria-label="Сменить язык"
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>
            <span className="font-semibold">{lang === 'ru' ? 'Русский' : 'English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}; 