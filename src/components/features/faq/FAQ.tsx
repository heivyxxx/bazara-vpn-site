"use client";

import { useState } from 'react';

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

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Как работает BazaraVPN?",
      answer: "BazaraVPN защищает вашу конфиденциальность в Интернете, скрывая ваш настоящий IP-адрес. Когда ваше виртуальное местоположение скрыто, отслеживать, ограничивать или продавать вашу онлайн-активность становится намного сложнее."
    },
    {
      question: "Как установить BazaraVPN?",
      answer: "Чтобы установить BazaraVPN, скачайте приложение для вашего устройства и следуйте нашему руководству по настройке. Затем просто войдите в свой аккаунт, и вы будете готовы к подключению."
    },
    {
      question: "Можно ли пользоваться бесплатно?",
      answer: "Да, у нас есть бесплатный пробный период и базовые функции без оплаты."
    },
    {
      question: "Какие устройства поддерживаются?",
      answer: "Windows, macOS, Android, iOS, роутеры и другие."
    },
    {
      question: "Можно ли смотреть Netflix и другие стриминги?",
      answer: "Да, BazaraVPN позволяет обходить блокировки и смотреть любые стриминговые сервисы."
    },
    {
      question: "Сколько устройств можно подключить?",
      answer: "До 5 устройств одновременно на одном аккаунте."
    },
    {
      question: "Как оплатить подписку?",
      answer: "Мы принимаем карты, криптовалюту и другие способы оплаты."
    },
    {
      question: "Законно ли использовать VPN?",
      answer: "В большинстве стран — да. Но проверьте законы вашей страны."
    }
  ];

  return (
    <section className="max-w-4xl mx-auto my-20 px-4">
      <h2 className="text-3xl font-bold text-orange-400 mb-10 text-center">
        Часто задаваемые вопросы
      </h2>
      <div className="bg-[#232323] rounded-2xl shadow-xl p-6 md:p-8">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
}; 