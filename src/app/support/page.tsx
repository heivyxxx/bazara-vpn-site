"use client";
import { Header } from '@/components/layout/Header';
// import { Footer } from '@/components/layout/Footer';
import { LanguageProvider, useLang, useUser } from '@/lib/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { SupportChatModal } from '@/components/support/SupportChatModal';
import { SupportIssueModal } from '@/components/support/SupportIssueModal';
import { SupportKbModal } from '@/components/support/SupportKbModal';
import { SupportDiscussModal } from '@/components/support/SupportDiscussModal';

const supportTexts = {
  ru: {
    title: 'Поддержка BazaraVPN',
    desc: 'Всё для вашей уверенности: быстрые ответы, база знаний, обсуждение и личный чат с поддержкой. Мы всегда на связи!',
    faq: 'FAQ',
    faqDesc: 'Ответы на самые частые вопросы о BazaraVPN.',
    faqBtn: 'Открыть FAQ',
    kb: 'База знаний',
    kbDesc: 'Всё, что нужно знать о BazaraVPN и наших продуктах.',
    kbBtn: 'Открыть базу знаний',
    discuss: 'Обсудить',
    discussDesc: 'Присоединяйтесь к обсуждению с командой и пользователями BazaraVPN.',
    discussBtn: 'Перейти к обсуждению',
    mail: 'Почта поддержки',
    mailValue: 'support@bazaravpn.ru',
    mailCopied: 'Скопировано!',
  },
  en: {
    title: 'BazaraVPN Support',
    desc: 'Everything for your confidence: quick answers, knowledge base, discussion and direct chat with support. We are always in touch!',
    faq: 'FAQ',
    faqDesc: 'Answers to the most common questions about BazaraVPN.',
    faqBtn: 'Open FAQ',
    kb: 'Knowledge Base',
    kbDesc: 'Everything you need to know about BazaraVPN and our products.',
    kbBtn: 'Open Knowledge Base',
    discuss: 'Discuss',
    discussDesc: 'Join the discussion with the BazaraVPN team and users.',
    discussBtn: 'Go to Discussion',
    mail: 'Support Email',
    mailValue: 'support@bazaravpn.ru',
    mailCopied: 'Copied!',
  }
};

function SupportContent() {
  const { lang } = useLang();
  const t = supportTexts[lang];
  const [copied, setCopied] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [issueOpen, setIssueOpen] = React.useState(false);
  const [kbOpen, setKbOpen] = React.useState(false);
  const [discussOpen, setDiscussOpen] = React.useState(false);
  return (
    <main className="flex-1 flex flex-col pt-24 items-center w-full min-h-screen bg-black">
      {/* Блок с почтой */}
      <div className="flex justify-center mt-0 mb-8">
        <button
          onClick={() => {navigator.clipboard.writeText(t.mailValue); setCopied(true); setTimeout(()=>setCopied(false), 1500);}}
          className="group flex flex-col items-center bg-[#18181b] rounded-2xl shadow-xl px-8 py-6 transition hover:shadow-2xl relative"
          style={{boxShadow:'0 8px 32px 0 #00000044, 0 2px 8px 0 #a259ff22'}}
        >
          <Image src="/assets/mail-3d.png" alt="Почта поддержки" width={80} height={80} className="w-20 h-20 mb-3 z-10 transition-transform duration-300 group-hover:-rotate-12 select-none pointer-events-none" draggable={false} />
          <span className="text-xl font-bold text-white z-10 select-none opacity-100 transition-opacity duration-300" style={{whiteSpace:'nowrap'}}>{t.mailValue}</span>
          <span className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-[#232323] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg ${copied ? 'opacity-100' : 'opacity-0'} pointer-events-none transition-opacity duration-300`} style={{zIndex:20}}>{t.mailCopied}</span>
        </button>
      </div>
      <SupportChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <SupportKbModal isOpen={kbOpen} onClose={() => setKbOpen(false)} />
      <SupportDiscussModal isOpen={discussOpen} onClose={() => setDiscussOpen(false)} />
      {/* Большой блок Чат поддержки */}
      <section className="w-full max-w-3xl mx-auto mb-8 px-2 sm:px-4">
        <div className="bg-[#18181b] rounded-[2.2rem] shadow-xl p-8 md:p-12 flex flex-col items-center text-center">
          <Image src="/assets/faq-3d.png" alt="Чат поддержки" width={64} height={64} className="w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-6 select-none pointer-events-none mx-auto" draggable={false} />
          <div className="text-2xl md:text-3xl font-extrabold text-white mb-2">{lang === 'ru' ? 'Чат поддержки' : 'Support Chat'}</div>
          <div className="text-base md:text-lg text-[#B8B8B8] mb-4 md:mb-5">{lang === 'ru' ? 'Быстрые ответы на ваши вопросы в чате с поддержкой.' : 'Quick answers to your questions in support chat.'}</div>
          <button
            onClick={() => window.open('https://t.me/bazarasupport', '_blank')}
            className="w-full max-w-xs py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl text-white shadow-lg transition-all duration-200 bg-[#fd6a32] hover:bg-[#e65a1e] mt-0"
          >
            {lang === 'ru' ? 'Открыть чат поддержки' : 'Open Support Chat'}
          </button>
        </div>
      </section>
      {/* База знаний и Обсудить на одном уровне */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-12 px-2 sm:px-4">
        <div className="bg-[#18181b] rounded-[2.2rem] shadow-xl p-6 md:p-10 flex flex-col items-center text-center">
          <Image src="/assets/kb-3d.png" alt="База знаний" width={64} height={64} className="w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-6 select-none pointer-events-none mx-auto" draggable={false} />
          <div className="text-lg md:text-2xl font-extrabold text-white mb-2">{t.kb}</div>
          <div className="text-sm md:text-[16px] text-[#B8B8B8] mb-4 md:mb-5">{t.kbDesc}</div>
          <button
            onClick={() => setKbOpen(true)}
            className="w-full max-w-xs py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg text-white shadow-lg transition-all duration-200 bg-[#fd6a32] hover:bg-[#e65a1e] mt-0 text-center block"
          >
            {t.kbBtn}
          </button>
        </div>
        <div className="bg-[#18181b] rounded-[2.2rem] shadow-xl p-6 md:p-10 flex flex-col items-center text-center">
          <Image src="/assets/chat-3d.png" alt="Обсудить" width={64} height={64} className="w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-6 select-none pointer-events-none mx-auto" draggable={false} />
          <div className="text-lg md:text-2xl font-extrabold text-white mb-2">{t.discuss}</div>
          <div className="text-sm md:text-[16px] text-[#B8B8B8] mb-4 md:mb-5">{t.discussDesc}</div>
          <button
            onClick={() => setDiscussOpen(true)}
            className="w-full max-w-xs py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg text-white shadow-lg transition-all duration-200 bg-[#fd6a32] hover:bg-[#e65a1e] mt-0 text-center block"
          >
            {t.discussBtn}
          </button>
        </div>
      </section>
    </main>
  );
}

export default function SupportPage() {
  const { lang } = useLang();
  const t = supportTexts[lang];
  const [user, setUser] = useUser();
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
      {/* Header убран */}
      <SupportContent />
      {/* <Footer /> */}
    </LanguageProvider>
  );
} 