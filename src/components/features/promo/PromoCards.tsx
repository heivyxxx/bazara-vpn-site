"use client";

import Image from 'next/image';
import { useLang } from '@/lib/LanguageContext';

const promoCardsData = {
  ru: [
    {
      icon: '/assets/chill.png',
      title: 'Свобода без компромиссов',
      desc: 'Тысячи пользователей выбрали BazaraVPN, чтобы вернуть себе контроль и спокойствие. Рейтинг 4.9/5 — не просто так.'
    },
    {
      icon: '/assets/stena.png',
      title: 'Доступ без границ',
      desc: 'Открывай сайты, стримы и приложения из любой точки мира — быстро, стабильно и безопасно.'
    },
    {
      icon: '/assets/planeta.png',
      title: 'Универсальная защита',
      desc: 'BazaraVPN работает на всех популярных устройствах: Windows, macOS, Android, iOS и даже роутерах.'
    }
  ],
  en: [
    {
      icon: '/assets/chill.png',
      title: 'Freedom without compromise',
      desc: 'Thousands of users chose BazaraVPN to regain control and peace of mind. 4.9/5 rating — not for nothing.'
    },
    {
      icon: '/assets/stena.png',
      title: 'Access without borders',
      desc: 'Open sites, streams, and apps from anywhere in the world — fast, stable, and secure.'
    },
    {
      icon: '/assets/planeta.png',
      title: 'Universal protection',
      desc: 'BazaraVPN works on all popular devices: Windows, macOS, Android, iOS, and even routers.'
    }
  ]
};

export const PromoCards = () => {
  const { lang } = useLang();
  const cards = promoCardsData[lang];
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 my-8 md:my-12 px-2 sm:px-0">
      {cards.map((card, i) => (
        <div key={i} className="bg-[#232323] rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col items-center text-center w-full">
          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center mb-4 md:mb-6 drop-shadow-xl bg-[#181818] rounded-full">
            <Image src={card.icon} alt={card.title} width={96} height={96} className="w-16 h-16 md:w-24 md:h-24 object-contain select-none" draggable={false} />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-white mb-2 md:mb-4">
            {card.title}
          </div>
          <div className="text-base md:text-lg text-gray-300 font-medium">
            {card.desc}
          </div>
        </div>
      ))}
    </div>
  );
}; 