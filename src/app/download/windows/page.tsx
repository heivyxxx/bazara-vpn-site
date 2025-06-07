"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider } from '@/lib/LanguageContext';

const texts = {
  ru: {
    title1: "Bazara",
    title2: "VPN для Windows",
    subtitle: "Скачай за 2 минуты — и ты уже в безопасности!",
    desc: "VPN, который не грузит мозги. Просто скачай, вставь подписку — и пользуйся!",
    step1: "Жми на кнопку ниже и скачай <b>Hiddify Next</b> для Windows (Portable или Setup — что больше по кайфу).",
    step2: "Запусти <b>Hiddify.exe</b> (лучше с правами администратора, чтобы всё работало по-базарному).",
    step3: "Скопируй свою подписку BazaraVPN и добавь её через «Новый профиль» → «Добавить профиль из буфера обмена».",
    step4: "В настройках выбери режим <b>VPN</b> (для всего трафика) или <b>Системный прокси</b> (только для браузера).",
    step5: "Выбери сервер, подключайся — и всё, ты под защитой!",
    downloadBtn: "Скачать Hiddify Next для Windows",
    helpTitle: "Если что-то не работает:",
    help1: "Добавь Hiddify в исключения антивируса.",
    help2: "Для Discord выбери регион «Другой».",
    help3: "Если нет интернета — попробуй сменить режим или DNS (например, 9.9.9.9).",
    help4: "Всё равно не работает? <a href='/support' class='text-orange-400 underline'>Напиши в поддержку</a> — поможем!"
  },
  en: {
    title1: "Bazara",
    title2: "VPN for Windows",
    subtitle: "Download in 2 minutes — and you're already protected!",
    desc: "VPN that doesn't overload your brain. Just download, paste your subscription — and enjoy!",
    step1: "Click the button below to download <b>Hiddify Next</b> for Windows (Portable or Setup — whichever you prefer).",
    step2: "Run <b>Hiddify.exe</b> (preferably as administrator for best results).",
    step3: "Copy your BazaraVPN subscription and add it via 'New Profile' → 'Add profile from clipboard'.",
    step4: "In settings, choose <b>VPN</b> mode (for all traffic) or <b>System Proxy</b> (browser only).",
    step5: "Choose a server, connect — and you're protected!",
    downloadBtn: "Download Hiddify Next for Windows",
    helpTitle: "If something doesn't work:",
    help1: "Add Hiddify to your antivirus exceptions.",
    help2: "For Discord, select the 'Other' region.",
    help3: "No internet? Try changing mode or DNS (e.g., 9.9.9.9).",
    help4: "Still not working? <a href='/support' class='text-orange-400 underline'>Contact support</a> — we'll help!"
  }
};

function useLang() {
  const [lang, setLang] = React.useState(() => typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ru' : 'ru');
  React.useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);
  return [lang, setLang] as const;
}

export default function WindowsInstallPage() {
  const [lang] = useLang();
  const t = texts[lang];
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center pt-32 pb-16 bg-[#181818]">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-fade-in">
          {/* Баннер */}
          <div className="relative flex flex-col items-center mb-8">
            <Image src="/assets/windows.png" alt="Windows logo" width={180} height={180} className="mb-4 mx-auto" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2">
              <span className="text-orange-400">{t.title1}</span><span className="text-white">{t.title2}</span>
            </h1>
            <div className="text-xl md:text-2xl text-white text-center font-semibold mb-2">{t.subtitle}</div>
            <div className="text-base text-gray-400 text-center max-w-xl" dangerouslySetInnerHTML={{__html: t.desc}} />
          </div>
          {/* Инструкция */}
          <ol className="w-full flex flex-col gap-6 mt-2 mb-8">
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-purple-500 text-white text-2xl font-bold shadow-lg"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7"/></svg></span>
              <span className="text-lg" dangerouslySetInnerHTML={{__html: t.step1}} />
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-purple-500 text-white text-2xl font-bold shadow-lg"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/></svg></span>
              <span className="text-lg" dangerouslySetInnerHTML={{__html: t.step2}} />
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-purple-500 text-white text-2xl font-bold shadow-lg"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></span>
              <span className="text-lg" dangerouslySetInnerHTML={{__html: t.step3}} />
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-purple-500 text-white text-2xl font-bold shadow-lg"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg></span>
              <span className="text-lg" dangerouslySetInnerHTML={{__html: t.step4}} />
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-purple-500 text-white text-2xl font-bold shadow-lg"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 19l7-7-7-7"/></svg></span>
              <span className="text-lg" dangerouslySetInnerHTML={{__html: t.step5}} />
            </li>
          </ol>
          <a href="https://github.com/hiddify/hiddify-next/releases" target="_blank" className="block w-full text-center bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-bold py-4 rounded-2xl text-xl shadow-xl transition mb-8">
            <svg className="inline-block w-7 h-7 mr-2 align-middle" fill="#fff" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/></svg>{t.downloadBtn}
          </a>
          <div className="w-full bg-[#232323] rounded-2xl p-5 text-base text-gray-200 flex flex-col gap-2 animate-fade-in-slow">
            <div className="font-bold text-orange-400 mb-1">{t.helpTitle}</div>
            <ul className="list-disc list-inside space-y-1">
              <li>{t.help1}</li>
              <li>{t.help2}</li>
              <li>{t.help3}</li>
              <li dangerouslySetInnerHTML={{__html: t.help4}} />
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 