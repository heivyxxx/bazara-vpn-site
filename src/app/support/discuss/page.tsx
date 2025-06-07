"use client";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider, useLang } from '@/lib/LanguageContext';
import React from 'react';

const discussTexts = {
  ru: {
    title: 'Обсудить и задать вопрос',
    tgTitle: 'Наш Telegram-чат',
    tgDesc: 'Присоединяйтесь к нашему Telegram-чату, чтобы задать вопрос, обсудить BazaraVPN или просто пообщаться с командой и другими пользователями.\nМы всегда на связи и рады помочь!',
    tgBtn: 'Вступить в Telegram',
    tgLink: 'https://t.me/bazaravpn',
  },
  en: {
    title: 'Discuss and Ask a Question',
    tgTitle: 'Our Telegram Chat',
    tgDesc: 'Join our Telegram chat to ask a question, discuss BazaraVPN, or just chat with the team and other users.\nWe are always in touch and happy to help!',
    tgBtn: 'Join Telegram',
    tgLink: 'https://t.me/bazaravpn',
  }
};

function DiscussContent() {
  const { lang } = useLang();
  const t = discussTexts[lang];
  return (
    <main className="flex-1 flex flex-col items-center pt-24 pb-16 min-h-screen bg-[#181818]">
      <h2 className="text-4xl font-extrabold text-orange-400 mb-10 text-center">{t.title}</h2>
      <div className="bg-[#232323] rounded-2xl border-2 border-orange-500 p-10 flex flex-col items-center gap-6 max-w-xl w-full shadow-lg">
        <svg className="w-24 h-24 text-orange-400 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 48 48"><path d="M22 38l-2-6-8-2c-2-.5-2-2.5 0-3l32-12c2-.5 3 1.5 2.5 3l-6 32c-.5 2-2.5 2-3 0l-2-8-6-2z" fill="#a259ff"/><path d="M22 38l-2-6-8-2c-2-.5-2-2.5 0-3l32-12c2-.5 3 1.5 2.5 3l-6 32c-.5 2-2.5 2-3 0l-2-8-6-2z" stroke="#ff8800" strokeWidth={3}/></svg>
        <h3 className="text-2xl font-extrabold text-orange-400 mb-2">{t.tgTitle}</h3>
        <div className="text-lg text-gray-200 text-center mb-4 whitespace-pre-line">{t.tgDesc}</div>
        <a href={t.tgLink} target="_blank" rel="noopener" className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold text-lg rounded-2xl px-8 py-4 shadow-lg transition-all duration-200">{t.tgBtn}</a>
      </div>
    </main>
  );
}

export default function DiscussPage() {
  return (
    <LanguageProvider>
      <Header />
      <DiscussContent />
      <Footer />
    </LanguageProvider>
  );
} 