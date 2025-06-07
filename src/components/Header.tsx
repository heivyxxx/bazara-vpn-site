"use client";
import React, { useState, useRef, useEffect } from "react";
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

export default function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [lang, setLang] = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
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
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-8 font-semibold">
            <li className="relative group" onMouseEnter={()=>setMegaOpen(true)} onMouseLeave={()=>setMegaOpen(false)}>
              <button className="text-white hover:text-orange-500 transition flex items-center gap-1 py-2 px-2 rounded-lg" onClick={()=>setMegaOpen(v=>!v)}>
                Преимущества
                <svg className={`w-5 h-5 text-orange-400 transition-transform ${megaOpen?"rotate-180":""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
              </button>
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
        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
          <Link href="/support" className="flex items-center gap-2 text-orange-500 font-bold py-2 px-3 rounded-lg border border-orange-500 bg-[#232323]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span className="hidden md:inline">Поддержка</span>
          </Link>
          <div className="relative flex items-center gap-2 select-none">
            <button className="flex items-center gap-2 px-3 py-2 bg-[#232323] rounded-lg border border-gray-700 text-white hover:bg-[#2c2c2c] focus:outline-none text-base" onClick={e=>{e.stopPropagation();setLang(l=>l==='ru'?'en':'ru')}}>
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>
              <span className="font-semibold">{lang==='ru'?'Русский':'English'}</span>
              <svg className="w-5 h-5 ml-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>
        </div>
        <button className="block md:hidden p-2 rounded-lg hover:bg-[#232323] focus:outline-none" onClick={()=>setMobileOpen(true)} aria-label="Открыть меню">
          <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
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