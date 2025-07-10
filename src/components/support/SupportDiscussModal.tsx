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
  const [closing, setClosing] = React.useState(false);
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  };
  if (!isOpen && !closing) return null;
  return (
    <div className="fixed inset-0 z-[9999] w-full h-full bg-black/80 flex items-end justify-center">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className={`relative w-full bg-[#18181b] rounded-t-3xl flex flex-col animate-fadeInUp ${closing ? 'animate-slideOutDown' : 'animate-slideInUp'}`}
        style={{ minHeight: '30vh', maxHeight: '65vh', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
      >
        <div className="flex flex-row items-center justify-between px-6 pt-6 pb-2 sticky top-0 z-10 bg-[#18181b] rounded-t-3xl">
          <span className="text-white font-bold text-lg w-full text-center">{t.title}</span>
          <button
            onClick={handleClose}
            className="text-zinc-400 text-2xl p-1 rounded-full ml-2 absolute right-6 top-6"
            aria-label="Закрыть"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="flex flex-col items-center px-6 pb-6 pt-2 gap-6 overflow-y-auto">
          <div className="flex flex-col items-center gap-6 max-w-xl w-full mx-auto">
            <img src="/assets/relegram.png" alt="Telegram" className="w-24 h-24 mb-2 select-none pointer-events-none" draggable={false} />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{t.tgTitle}</h3>
            <div className="text-base md:text-lg text-gray-100 text-center mb-4 whitespace-pre-line">{t.tgDesc}</div>
            <a href={t.tgLink} target="_blank" rel="noopener" className="bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-bold text-lg rounded-2xl px-8 py-4 shadow-lg transition-all duration-200">{t.tgBtn}</a>
          </div>
        </div>
      </div>
    </div>
  );
}; 