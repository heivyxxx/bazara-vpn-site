"use client";

import { useState } from 'react';
import { useLang } from '@/lib/LanguageContext';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
  <div className="border-b border-[#333] last:border-b-0">
    <button
      className="w-full flex items-center justify-between py-6 text-left focus:outline-none"
      onClick={onClick}
    >
      <span className="text-xl font-semibold text-white pr-8">{question}</span>
      <svg
        className={`w-6 h-6 text-orange-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      className={`overflow-hidden transition-all duration-200 ${
        isOpen ? 'max-h-96 pb-6' : 'max-h-0'
      }`}
    >
      <div className="text-lg text-gray-300">{answer}</div>
    </div>
  </div>
);

const faqTexts = {
  ru: {
    title: 'Часто задаваемые вопросы',
    items: [
      { q: 'Как работает BazaraVPN?', a: 'BazaraVPN защищает вашу конфиденциальность в Интернете, скрывая ваш настоящий IP-адрес.' },
      { q: 'Можно ли пользоваться бесплатно?', a: 'Да, у нас есть бесплатный пробный период и базовые функции без оплаты.' },
      { q: 'Какие устройства поддерживаются?', a: 'Windows, macOS, Android, iOS, роутеры и другие.' },
      { q: 'Можно ли смотреть Netflix и другие стриминги?', a: 'Да, BazaraVPN позволяет обходить блокировки и смотреть любые стриминговые сервисы.' },
      { q: 'Сколько устройств можно подключить?', a: 'До 5 устройств одновременно на одном аккаунте.' },
    ],
  },
  en: {
    title: 'Frequently Asked Questions',
    items: [
      { q: 'How does BazaraVPN work?', a: 'BazaraVPN protects your privacy online by hiding your real IP address.' },
      { q: 'Is there a free version?', a: 'Yes, we have a free trial and basic features without payment.' },
      { q: 'Which devices are supported?', a: 'Windows, macOS, Android, iOS, routers and more.' },
      { q: 'Can I watch Netflix and other streaming services?', a: 'Yes, BazaraVPN allows you to bypass blocks and watch any streaming services.' },
      { q: 'How many devices can I connect?', a: 'Up to 5 devices simultaneously on one account.' },
    ],
  },
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { lang } = useLang();
  const t = faqTexts[lang];

  const faqs = t.items;

  return (
    <section className="max-w-4xl mx-auto my-20 px-4">
      <h2 className="text-3xl font-bold text-orange-400 mb-10 text-center">
        {t.title}
      </h2>
      <div className="bg-[#232323] rounded-2xl shadow-xl p-6 md:p-8">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.q}
            answer={faq.a}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
}; 