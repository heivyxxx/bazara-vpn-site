"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from '@/components/layout/Header';
// import { Footer } from '@/components/layout/Footer';
import { useUser } from '@/lib/LanguageContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import { DownloadModal } from '@/components/features/download/DownloadModal';
import { AppMainShell } from '@/components/AppMainShell';

const LANGS = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

function useLang(): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [lang, setLang] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ru' : 'ru');
  useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);
  return [lang, setLang];
}

const platforms = [
  {
    name: "Windows",
    img: "/assets/windows.png",
    desc: "Простая установка для Windows 10/11. Поддержка Hiddify Next.",
    link: "/download/windows"
  },
  {
    name: "macOS",
    img: "/assets/apple.png",
    desc: "Инструкция для MacBook и iMac. Быстрый старт через Hiddify.",
    link: "/download/macos"
  },
  {
    name: "Linux",
    img: "/assets/linux.png",
    desc: "Поддержка Ubuntu, Debian и других дистрибутивов.",
    link: "/download/linux"
  },
  {
    name: "Android",
    img: "/assets/android.png",
    desc: "Установка на Android-смартфоны и планшеты. Hiddify Next.",
    link: "/download/android"
  },
  {
    name: "iPhone / iPad",
    img: "/assets/apple.png",
    desc: "Инструкция для iOS и iPadOS. Быстрый старт через Hiddify.",
    link: "/download/ios"
  },
];

const texts = {
  ru: {
    title: "Скачать BazaraVPN",
    soon: "Скоро новые платформы",
    follow: "Следите за обновлениями!"
  },
  en: {
    title: "Download BazaraVPN",
    soon: "New platforms coming soon",
    follow: "Stay tuned!"
  }
};

export default function DownloadPage() {
  const [lang] = useLang();
  const t = lang === "en" ? texts.en : texts.ru;
  const [user, setUser] = useUser();
  const [modal, setModal] = useState<null | 'windows' | 'macos' | 'linux' | 'android' | 'ios'>(null);
  // Определяем количество колонок: если 4 или 5 платформ — 2 колонки, иначе 3
  const gridCols = platforms.length <= 5 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-3";
  // Если карточек 5 — добавляем плейсхолдер
  const needPlaceholder = platforms.length % 3 !== 0;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(() => {
        window.history.back();
      });
    }
    // Скрыть Header
    const style = document.createElement('style');
    style.innerHTML = `header, .Header, .header { display: none !important; }`;
    style.setAttribute('data-hide-header', '1');
    document.head.appendChild(style);
    return () => {
      if (window.Telegram?.WebApp?.BackButton) {
        window.Telegram.WebApp.BackButton.hide();
      }
      const s = document.querySelector('style[data-hide-header="1"]');
      if (s) s.remove();
    };
  }, []);

  return (
    <LanguageProvider>
      <Header user={user} onLogout={() => { setUser(null); if (typeof window !== 'undefined') localStorage.removeItem('bazaraUser'); }} />
      <AppMainShell className="bg-black overflow-hidden relative" innerClassName="items-center justify-center flex-1 min-h-0">
        <h1 className="text-2xl md:text-5xl font-extrabold mb-8 md:mb-12 text-center z-10" style={{color:'#fd6a32'}}>{t.title}</h1>
        <div className={`grid grid-cols-1 md:${gridCols} gap-4 md:gap-8 w-full max-w-4xl z-10`}>
          {platforms.map((p, i) => (
            <button
              key={p.name}
              className="bg-[#18181b] rounded-2xl shadow-xl p-6 md:p-10 flex flex-col items-center text-center card-hover transition hover:scale-105 hover:shadow-2xl hover:border-[#fd6a32] border border-[#18181b] w-full focus:outline-none"
              style={{minWidth:0}}
              onClick={() => setModal(p.name.toLowerCase().includes('windows') ? 'windows' : p.name.toLowerCase().includes('mac') ? 'macos' : p.name.toLowerCase().includes('linux') ? 'linux' : p.name.toLowerCase().includes('android') ? 'android' : p.name.toLowerCase().includes('iphone') || p.name.toLowerCase().includes('ipad') ? 'ios' : null)}
            >
              <Image src={p.img} alt={p.name} width={48} height={48} className="mb-4 md:mb-6 w-12 h-12 md:w-16 md:h-16 select-none pointer-events-none" draggable={false} />
              <div className="text-lg md:text-2xl font-extrabold text-white mb-2 md:mb-4">{p.name}</div>
              <div className="text-sm md:text-[16px] text-[#B8B8B8] mb-2">{p.desc}</div>
            </button>
          ))}
          {needPlaceholder && (
            <div className="bg-gradient-to-br from-[#18181b] to-[#2d1a00] rounded-2xl shadow-xl p-6 md:p-10 flex flex-col items-center text-center border-2 border-dashed border-[#fd6a32] justify-center min-h-[120px] md:min-h-[180px] w-full">
              <div className="text-lg md:text-2xl font-extrabold text-[#fd6a32] mb-2">{t.soon}</div>
              <div className="text-sm md:text-base text-[#B8B8B8]">{t.follow}</div>
            </div>
          )}
        </div>
        <DownloadModal isOpen={!!modal} onClose={() => setModal(null)} platform={modal || 'windows'} />
      </AppMainShell>
      {/* <Footer /> */}
    </LanguageProvider>
  );
} 