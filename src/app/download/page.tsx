"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const LANGS = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

function useLang(): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [lang, setLang] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ru' : 'ru');
  useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);
  return [lang, setLang];
}

function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [lang, setLang] = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  // Закрытие мегаменю при клике вне
  useEffect(() => {
    function handler(e: MouseEvent): void {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    }
    if (megaOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [megaOpen]);
  return (
    <nav className="fixed top-0 left-0 w-full z-20 bg-[#181818] shadow-sm border-b border-orange-900" id="main-navbar">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4 md:px-8 text-lg gap-8">
        <div className="flex items-center gap-3 logo-home cursor-pointer flex-shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <img src="/assets/logo-bazara.png" alt="BazaraVPN Logo" className="h-10 w-10" />
            <span className="text-3xl font-bold text-orange-500">Bazara<span className="text-white">VPN</span></span>
          </Link>
        </div>
        {/* Десктоп-меню */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-8 font-semibold">
            <li className="relative group" onMouseEnter={()=>setMegaOpen(true)} onMouseLeave={()=>setMegaOpen(false)}>
              <button className="text-white hover:text-orange-500 transition flex items-center gap-1 py-2 px-2 rounded-lg" onClick={()=>setMegaOpen(v=>!v)}>
                Преимущества
                <svg className={`w-5 h-5 text-orange-400 transition-transform ${megaOpen?"rotate-180":""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {/* Мегаменю */}
              {megaOpen && (
                <div ref={megaRef} className="absolute left-0 top-full mt-3 w-[700px] bg-[#232323] rounded-2xl shadow-2xl p-6 z-50 text-white animate-fade-in flex gap-8" style={{animation:'fadeIn .2s'}}>
                  <div className="flex-1 min-w-[220px] flex flex-col gap-4">
                    <div>
                      <div className="font-bold text-lg text-orange-400 mb-1">Что такое VPN?</div>
                      <div className="text-gray-200 text-sm">VPN — это технология для анонимности, безопасности и обхода блокировок в интернете.</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-orange-400 mb-1">Почему BazaraVPN?</div>
                      <div className="text-gray-200 text-sm">Без логов, высокая скорость, поддержка стриминга и торрентов, современные протоколы.</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-orange-400 mb-1">Все функции</div>
                      <div className="text-gray-200 text-sm">Мультиустройство, защита Wi-Fi, смена IP, доступ к контенту по всему миру.</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-orange-400 mb-1">VPN-серверы</div>
                      <div className="text-gray-200 text-sm">Сервера в 10+ странах для стабильного и быстрого соединения.</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-[220px] flex flex-col gap-4">
                    <div>
                      <div className="font-bold text-lg text-orange-400 mb-1">VPN для стриминга</div>
                      <div className="text-gray-200 text-sm">Смотрите Netflix, Hulu, Disney+ и другие сервисы без ограничений.</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-orange-400 mb-1">Страны</div>
                      <div className="text-gray-200 text-sm">США, Турция, Япония, Германия, Франция, и другие.</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-orange-400 mb-1">Устройства</div>
                      <div className="text-gray-200 text-sm">Windows, macOS, Android, iOS, роутеры.</div>
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li><Link href="/tariffs" className="text-white hover:text-orange-500 transition py-2 px-2 rounded-lg">Тарифы</Link></li>
            <li><Link href="/download" className="px-4 py-2 hover:bg-[#181818] cursor-pointer text-orange-500 border border-orange-500 rounded-lg">Скачать</Link></li>
          </ul>
        </div>
        {/* Десктоп поддержка и язык */}
        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
          <Link href="/support" className="flex items-center gap-2 text-orange-500 font-bold py-2 px-3 rounded-lg border border-orange-500 bg-[#232323]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span className="hidden md:inline">Поддержка</span>
          </Link>
          {/* Языковой переключатель */}
          <div className="relative flex items-center gap-2 select-none">
            <button className="flex items-center gap-2 px-3 py-2 bg-[#232323] rounded-lg border border-gray-700 text-white hover:bg-[#2c2c2c] focus:outline-none text-base" onClick={e=>{e.stopPropagation();setLang(l=>l==='ru'?'en':'ru')}}>
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>
              <span className="font-semibold">{lang==='ru'?'Русский':'English'}</span>
              <svg className="w-5 h-5 ml-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>
        </div>
        {/* Мобильный бургер */}
        <button className="block md:hidden p-2 rounded-lg hover:bg-[#232323] focus:outline-none" onClick={()=>setMobileOpen(true)} aria-label="Открыть меню">
          <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      {/* Мобильное меню */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-[#181818] bg-opacity-95 z-50 flex-col items-center justify-center gap-8 flex md:hidden animate-fade-in">
          <button className="absolute top-6 right-6 p-2 rounded-lg hover:bg-[#232323]" onClick={()=>setMobileOpen(false)} aria-label="Закрыть меню">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <ul className="flex flex-col gap-8 text-2xl font-bold mt-24">
            <li>
              <button className="hover:text-orange-400" onClick={()=>setMegaOpen(v=>!v)}>Преимущества</button>
              {megaOpen && (
                <div className="mt-2 w-[90vw] max-w-xl bg-[#232323] rounded-2xl shadow-2xl p-6 z-50 text-white animate-fade-in flex flex-col gap-4">
                  <div className="font-bold text-lg text-orange-400 mb-1">Что такое VPN?</div>
                  <div className="text-gray-200 text-sm mb-2">VPN — это технология для анонимности, безопасности и обхода блокировок в интернете.</div>
                  <div className="font-bold text-lg text-orange-400 mb-1">Почему BazaraVPN?</div>
                  <div className="text-gray-200 text-sm mb-2">Без логов, высокая скорость, поддержка стриминга и торрентов, современные протоколы.</div>
                  <div className="font-bold text-lg text-orange-400 mb-1">Все функции</div>
                  <div className="text-gray-200 text-sm mb-2">Мультиустройство, защита Wi-Fi, смена IP, доступ к контенту по всему миру.</div>
                  <div className="font-bold text-lg text-orange-400 mb-1">VPN-серверы</div>
                  <div className="text-gray-200 text-sm mb-2">Сервера в 10+ странах для стабильного и быстрого соединения.</div>
                  <div className="font-bold text-lg text-orange-400 mb-1">VPN для стриминга</div>
                  <div className="text-gray-200 text-sm mb-2">Смотрите Netflix, Hulu, Disney+ и другие сервисы без ограничений.</div>
                  <div className="font-bold text-lg text-orange-400 mb-1">Страны</div>
                  <div className="text-gray-200 text-sm mb-2">США, Турция, Япония, Германия, Франция, и другие.</div>
                  <div className="font-bold text-lg text-orange-400 mb-1">Устройства</div>
                  <div className="text-gray-200 text-sm">Windows, macOS, Android, iOS, роутеры.</div>
                </div>
              )}
            </li>
            <li><Link href="/tariffs" className="hover:text-orange-400" onClick={()=>setMobileOpen(false)}>Тарифы</Link></li>
            <li><Link href="/download" className="hover:text-orange-400 text-orange-500" onClick={()=>setMobileOpen(false)}>Скачать</Link></li>
            <li><Link href="/support" className="hover:text-orange-400" onClick={()=>setMobileOpen(false)}>Поддержка</Link></li>
            <li>
              <div className="flex flex-col items-center gap-2">
                <span className="text-base text-gray-400">Язык</span>
                {LANGS.map(l=>(
                  <button key={l.code} className="w-full text-left px-5 py-3 text-lg hover:bg-[#232323] text-white flex items-center gap-2" onClick={()=>{setLang(l.code);setMobileOpen(false);}}>{l.label}</button>
                ))}
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-[#232323] border-t border-[#333] py-6 px-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-12 text-gray-200 text-base mt-auto text-center md:text-left">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 w-full justify-center md:justify-start">
        <Link href="/contacts" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#181818] transition text-lg font-semibold">
          <img src="/assets/mail-3d.png" alt="Контакты" className="w-7 h-7" style={{objectFit:'contain'}} />
          <span>Контакты</span>
        </Link>
        <Link href="/privacy" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#181818] transition text-lg font-semibold">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 8h8v8H8z"/></svg>
          <span>Политика</span>
        </Link>
      </div>
      <div className="text-center text-lg font-medium w-full md:w-auto">© 2024 BazaraVPN</div>
      <div className="flex items-center justify-center gap-5 w-full md:w-auto mt-4 md:mt-0">
        <a href="https://t.me/bazaraVPN" className="hover:text-orange-400" aria-label="Telegram" target="_blank" rel="noopener"><img src="/assets/telegram.png" alt="Telegram" className="w-7 h-7" /></a>
        <a href="https://www.instagram.com/bazaravpn/" className="hover:text-orange-400" aria-label="Instagram" target="_blank" rel="noopener"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6"/><circle cx="12" cy="12" r="5"/><circle cx="17" cy="7" r="1.5"/></svg></a>
        <a href="https://www.youtube.com/@BazaraVPN" className="hover:text-orange-400" aria-label="YouTube" target="_blank" rel="noopener"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="4"/><polygon points="10,9 16,12 10,15" fill="currentColor"/></svg></a>
        <a href="https://www.tiktok.com/@bazaravpn1?lang=ru-RU" className="hover:text-orange-400" aria-label="TikTok" target="_blank" rel="noopener"><svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"><path d="M16.5 3a4.5 4.5 0 0 0 4.5 4.5v2A6.5 6.5 0 0 1 14.5 3h2zm-2 0v12.5a3.5 3.5 0 1 1-3.5-3.5h1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
      </div>
    </footer>
  );
}

const platforms = [
  {
    name: "Windows",
    img: "/assets/windows.png",
    desc: "Простая установка для Windows 10/11. Поддержка Hiddify Next.",
    link: "/install-windows.html"
  },
  {
    name: "macOS",
    img: "/assets/apple.png",
    desc: "Инструкция для MacBook и iMac. Быстрый старт через Hiddify.",
    link: "/install-macos.html"
  },
  {
    name: "Linux",
    img: "/assets/linux.png",
    desc: "Поддержка Ubuntu, Debian и других дистрибутивов.",
    link: "/install-linux.html"
  },
  {
    name: "Android",
    img: "/assets/android.png",
    desc: "Установка на Android-смартфоны и планшеты. Hiddify Next.",
    link: "/install-android.html"
  },
  {
    name: "iPhone / iPad",
    img: "/assets/apple.png",
    desc: "Инструкция для iOS и iPadOS. Быстрый старт через Hiddify.",
    link: "/install-ios.html"
  },
];

export default function DownloadPage() {
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  // Определяем количество колонок: если 4 или 5 платформ — 2 колонки, иначе 3
  const gridCols = platforms.length <= 5 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-3";
  // Если карточек 5 — добавляем плейсхолдер
  const needPlaceholder = platforms.length % 3 !== 0;
  return (
    <>
      <Header />
      <div className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 bg-[#181818] overflow-hidden">
        {/* SVG фон */}
        <svg width="700" height="700" className="absolute left-[-180px] top-[-120px] opacity-10 z-0" viewBox="0 0 700 700" fill="none"><circle cx="350" cy="350" r="340" stroke="#ff8800" strokeWidth="24" /></svg>
        <svg width="400" height="400" className="absolute right-[-120px] bottom-[-80px] opacity-10 z-0" viewBox="0 0 400 400" fill="none"><rect x="40" y="40" width="320" height="320" rx="80" stroke="#a259ff" strokeWidth="18" /></svg>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center z-10" style={{background: 'linear-gradient(90deg,#ff8800,#a259ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Скачать BazaraVPN</h1>
        <div className={`grid grid-cols-1 ${gridCols} gap-8 w-full max-w-4xl z-10`}>
          {platforms.map((p, i) => (
            <Link key={p.name} href={p.link} className="bg-[#232323] rounded-2xl shadow-xl p-10 flex flex-col items-center text-center card-hover transition hover:scale-105 hover:shadow-2xl hover:border-orange-400 border border-[#232323]" style={{minWidth:260}}>
              <Image src={p.img} alt={p.name} width={64} height={64} className="mb-6 select-none pointer-events-none" draggable={false} />
              <div className="text-2xl font-extrabold text-white mb-2">{p.name}</div>
              <div className="text-[16px] text-[#B8B8B8] mb-2">{p.desc}</div>
            </Link>
          ))}
          {needPlaceholder && (
            <div className="bg-gradient-to-br from-[#232323] to-[#2d1a00] rounded-2xl shadow-xl p-10 flex flex-col items-center text-center border-2 border-dashed border-orange-400 justify-center min-h-[180px]">
              <div className="text-2xl font-extrabold text-orange-400 mb-2">Скоро новые платформы</div>
              <div className="text-base text-[#B8B8B8]">Следите за обновлениями!</div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
} 