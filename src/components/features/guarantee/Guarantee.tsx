"use client";

import { useLang } from '@/lib/LanguageContext';

const guaranteeTexts = {
  ru: {
    text: '30-дневная гарантия возврата денег на годовую подписку',
  },
  en: {
    text: '30-day money-back guarantee for annual subscription',
  },
};

export const Guarantee = () => {
  const { lang } = useLang();
  const t = guaranteeTexts[lang];
  return (
    <div className="w-full flex justify-center mt-8 mb-8">
      <div className="bg-orange-500 text-white font-bold text-lg md:text-xl px-8 py-4 rounded-xl shadow-lg flex items-center gap-3">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
        {t.text}
      </div>
    </div>
  );
}; 