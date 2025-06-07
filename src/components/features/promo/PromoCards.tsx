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
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
      {cards.map((card, i) => (
        <div key={i} className="bg-[#232323] rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center">
          <div className="w-32 h-32 flex items-center justify-center mb-6 drop-shadow-xl bg-[#181818] rounded-full">
            <Image src={card.icon} alt={card.title} width={96} height={96} className="w-24 h-24 object-contain select-none" draggable={false} />
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {card.title}
          </div>
          <div className="text-lg md:text-xl text-gray-300 font-medium">
            {card.desc}
          </div>
        </div>
      ))}
    </div>
  );
}; 