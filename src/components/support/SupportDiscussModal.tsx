"use client";
import React from 'react';
import Image from 'next/image';
import { useLang } from '@/lib/LanguageContext';
import { ResponsiveDialog } from '@/components/modal/ResponsiveDialog';

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
  },
};

interface SupportDiscussModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportDiscussModal: React.FC<SupportDiscussModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLang();
  const t = discussTexts[lang];
  return (
    <ResponsiveDialog open={isOpen} onClose={onClose} title={t.title} sheetBg="#18181b" desktopMaxWidthClass="max-w-xl">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
        <Image src="/assets/relegram.png" alt="Telegram" width={96} height={96} className="mb-2 h-24 w-24 select-none" draggable={false} />
        <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">{t.tgTitle}</h3>
        <div className="mb-4 whitespace-pre-line text-center text-base text-gray-100 md:text-lg">{t.tgDesc}</div>
        <a
          href={t.tgLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl bg-[#fd6a32] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#e65a1e]"
        >
          {t.tgBtn}
        </a>
      </div>
    </ResponsiveDialog>
  );
};
