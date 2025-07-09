import React from 'react';
import { useLang } from '@/lib/LanguageContext';

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

interface SupportDiscussModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportDiscussModal: React.FC<SupportDiscussModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLang();
  const t = discussTexts[lang];
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-end justify-center">
      <div className="bg-[#18181b] rounded-t-3xl rounded-b-none shadow-2xl p-4 sm:p-8 md:p-12 w-full max-w-2xl relative flex flex-col gap-6 sm:gap-8 min-h-[40vh] max-h-[98vh] overflow-y-auto" style={{minWidth:0}}>
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-[#181818] hover:bg-[#2c2c2c] text-2xl text-gray-400">&times;</button>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#fd6a32] mb-4 text-center">{t.title}</h2>
        <div className="bg-[#232323] rounded-2xl border-2 border-[#fd6a32] p-6 md:p-8 flex flex-col items-center gap-6 max-w-xl w-full shadow-lg mx-auto">
          <svg className="w-24 h-24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 48 48"><path d="M22 38l-2-6-8-2c-2-.5-2-2.5 0-3l32-12c2-.5 3 1.5 2.5 3l-6 32c-.5 2-2.5 2-3 0l-2-8-6-2z" fill="#a259ff"/><path d="M22 38l-2-6-8-2c-2-.5-2-2.5 0-3l32-12c2-.5 3 1.5 2.5 3l-6 32c-.5 2-2.5 2-3 0l-2-8-6-2z" stroke="#fd6a32" strokeWidth={3}/></svg>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#fd6a32] mb-2">{t.tgTitle}</h3>
          <div className="text-base md:text-lg text-gray-200 text-center mb-4 whitespace-pre-line">{t.tgDesc}</div>
          <a href={t.tgLink} target="_blank" rel="noopener" className="bg-gradient-to-r from-[#fd6a32] to-purple-600 hover:from-[#fd6a32] hover:to-purple-700 text-white font-bold text-lg rounded-2xl px-8 py-4 shadow-lg transition-all duration-200">{t.tgBtn}</a>
        </div>
      </div>
    </div>
  );
}; 