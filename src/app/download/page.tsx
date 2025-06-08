"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useUser } from '@/lib/LanguageContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

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

export default function DownloadPage() {
  const { lang } = useLang();
  const t = texts[lang];
  const [user, setUser] = useUser();
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  // Определяем количество колонок: если 4 или 5 платформ — 2 колонки, иначе 3
  const gridCols = platforms.length <= 5 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-3";
  // Если карточек 5 — добавляем плейсхолдер
  const needPlaceholder = platforms.length % 3 !== 0;
  return (
    <LanguageProvider>
      <Header user={user} onLogout={() => { setUser(null); if (typeof window !== 'undefined') localStorage.removeItem('bazaraUser'); }} />
      <div className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 md:pb-16 bg-[#181818] overflow-hidden">
        {/* SVG фон */}
        <svg width="700" height="700" className="absolute left-[-180px] top-[-120px] opacity-10 z-0" viewBox="0 0 700 700" fill="none"><circle cx="350" cy="350" r="340" stroke="#ff8800" strokeWidth="24" /></svg>
        <svg width="400" height="400" className="absolute right-[-120px] bottom-[-80px] opacity-10 z-0" viewBox="0 0 400 400" fill="none"><rect x="40" y="40" width="320" height="320" rx="80" stroke="#a259ff" strokeWidth="18" /></svg>
        <h1 className="text-2xl md:text-5xl font-extrabold mb-8 md:mb-12 text-center z-10" style={{background: 'linear-gradient(90deg,#ff8800,#a259ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Скачать BazaraVPN</h1>
        <div className={`grid grid-cols-1 md:${gridCols} gap-4 md:gap-8 w-full max-w-4xl z-10 px-2 sm:px-0`}>
          {platforms.map((p, i) => (
            <Link key={p.name} href={p.link} className="bg-[#232323] rounded-2xl shadow-xl p-6 md:p-10 flex flex-col items-center text-center card-hover transition hover:scale-105 hover:shadow-2xl hover:border-orange-400 border border-[#232323] w-full" style={{minWidth:0}}>
              <Image src={p.img} alt={p.name} width={48} height={48} className="mb-4 md:mb-6 w-12 h-12 md:w-16 md:h-16 select-none pointer-events-none" draggable={false} />
              <div className="text-lg md:text-2xl font-extrabold text-white mb-2 md:mb-4">{p.name}</div>
              <div className="text-sm md:text-[16px] text-[#B8B8B8] mb-2">{p.desc}</div>
            </Link>
          ))}
          {needPlaceholder && (
            <div className="bg-gradient-to-br from-[#232323] to-[#2d1a00] rounded-2xl shadow-xl p-6 md:p-10 flex flex-col items-center text-center border-2 border-dashed border-orange-400 justify-center min-h-[120px] md:min-h-[180px] w-full">
              <div className="text-lg md:text-2xl font-extrabold text-orange-400 mb-2">Скоро новые платформы</div>
              <div className="text-sm md:text-base text-[#B8B8B8]">Следите за обновлениями!</div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </LanguageProvider>
  );
} 