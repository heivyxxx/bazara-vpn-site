"use client";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider, useLang } from '@/lib/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { SupportChatModal } from '@/components/support/SupportChatModal';
import { SupportIssueModal } from '@/components/support/SupportIssueModal';

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
  return (
    <main className="flex-1 flex flex-col pt-24 items-center w-full min-h-screen bg-[#181818]">
      <Image src="/assets/trader.gif" alt="BazaraVPN" width={208} height={208} className="w-52 h-52 mx-auto mb-8 select-none pointer-events-none cursor-pointer" draggable={false} onClick={() => setChatOpen(true)} />
      <SupportChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <SupportIssueModal isOpen={issueOpen} onClose={() => setIssueOpen(false)} />
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4"><span className="text-orange-400">{t.title}</span></h1>
      <div className="text-xl md:text-2xl text-[#B8B8B8] mb-10 text-center max-w-xl font-medium">{t.desc}</div>
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 px-4">
        <div className="bg-[#232323] rounded-[2.2rem] shadow-xl p-10 flex flex-col items-center text-center" style={{boxShadow:'0 8px 32px 0 #00000044, 0 2px 8px 0 #a259ff22'}}>
          <Image src="/assets/faq-3d.png" alt="Чат поддержки" width={80} height={80} className="w-20 h-20 mb-6 select-none pointer-events-none mx-auto" draggable={false} />
          <div className="text-2xl font-extrabold text-white mb-2">{lang === 'ru' ? 'Чат поддержки' : 'Support Chat'}</div>
          <div className="text-[16px] text-[#B8B8B8] mb-5">{lang === 'ru' ? 'Быстрые ответы на ваши вопросы в чате с поддержкой.' : 'Quick answers to your questions in support chat.'}</div>
          <button
            onClick={() => setChatOpen(true)}
            className="w-full max-w-xs py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all duration-200 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 mt-0"
          >
            {lang === 'ru' ? 'Открыть чат поддержки' : 'Open Support Chat'}
          </button>
        </div>
        <div className="bg-[#232323] rounded-[2.2rem] shadow-xl p-10 flex flex-col items-center text-center" style={{boxShadow:'0 8px 32px 0 #00000044, 0 2px 8px 0 #a259ff22'}}>
          <Image src="/assets/kb-3d.png" alt="База знаний" width={80} height={80} className="w-20 h-20 mb-6 select-none pointer-events-none mx-auto" draggable={false} />
          <div className="text-2xl font-extrabold text-white mb-2">{t.kb}</div>
          <div className="text-[16px] text-[#B8B8B8] mb-5">{t.kbDesc}</div>
          <Link href="/support/kb" className="w-full max-w-xs py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all duration-200 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 mt-0 text-center block">{t.kbBtn}</Link>
        </div>
        <div className="bg-[#232323] rounded-[2.2rem] shadow-xl p-10 flex flex-col items-center text-center" style={{boxShadow:'0 8px 32px 0 #00000044, 0 2px 8px 0 #a259ff22'}}>
          <Image src="/assets/chat-3d.png" alt="Обсудить" width={80} height={80} className="w-20 h-20 mb-6 select-none pointer-events-none mx-auto" draggable={false} />
          <div className="text-2xl font-extrabold text-white mb-2">{t.discuss}</div>
          <div className="text-[16px] text-[#B8B8B8] mb-5">{t.discussDesc}</div>
          <Link href="/support/discuss" className="w-full max-w-xs py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all duration-200 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 mt-0 text-center block">{t.discussBtn}</Link>
        </div>
        <div className="bg-[#232323] rounded-[2.2rem] shadow-xl p-10 flex flex-col items-center text-center" style={{boxShadow:'0 8px 32px 0 #00000044, 0 2px 8px 0 #a259ff22'}}>
          <Image src="/assets/bug-3d.png" alt="Сообщить о проблеме" width={80} height={80} className="w-20 h-20 mb-6 select-none pointer-events-none mx-auto" draggable={false} />
          <div className="text-2xl font-extrabold text-white mb-2">{lang === 'ru' ? 'Сообщить о проблеме' : 'Report a Problem'}</div>
          <div className="text-[16px] text-[#B8B8B8] mb-5">{lang === 'ru' ? 'Оставьте отзыв или сообщите о проблеме — мы всегда на связи!' : 'Leave feedback or report a problem — we are always in touch!'}</div>
          <button
            onClick={() => setIssueOpen(true)}
            className="w-full max-w-xs py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all duration-200 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 mt-0"
          >
            {lang === 'ru' ? 'Сообщить о проблеме' : 'Report a Problem'}
          </button>
        </div>
      </section>
      <div className="flex justify-center mt-8 mb-4">
        <button
          onClick={() => {navigator.clipboard.writeText(t.mailValue); setCopied(true); setTimeout(()=>setCopied(false), 1500);}}
          className="group flex flex-col items-center bg-[#232323] rounded-2xl shadow-xl px-8 py-6 transition hover:shadow-2xl relative"
          style={{boxShadow:'0 8px 32px 0 #00000044, 0 2px 8px 0 #a259ff22'}}
        >
          <span className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300" style={{boxShadow:'0 0 16px 2px #a259ff55'}}></span>
          <Image src="/assets/mail-3d.png" alt="Почта поддержки" width={80} height={80} className="w-20 h-20 mb-3 z-10 transition-transform duration-300 group-hover:-rotate-12 select-none pointer-events-none" draggable={false} />
          <span className="text-xl font-bold text-white z-10 select-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{whiteSpace:'nowrap'}}>{t.mailValue}</span>
          <span className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-[#232323] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg ${copied ? 'opacity-100' : 'opacity-0'} pointer-events-none transition-opacity duration-300`} style={{zIndex:20}}>{t.mailCopied}</span>
        </button>
      </div>
    </main>
  );
}

export default function SupportPage() {
  return (
    <LanguageProvider>
      <Header />
      <SupportContent />
      <Footer />
    </LanguageProvider>
  );
} 