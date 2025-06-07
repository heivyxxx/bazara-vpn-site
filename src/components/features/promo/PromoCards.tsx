"use client";

import Image from 'next/image';

interface PromoCardProps {
  image: string;
  title: string;
  description: string;
}

const PromoCard = ({ image, title, description }: PromoCardProps) => (
  <div className="flex flex-col items-center text-center bg-[#232323] rounded-3xl shadow-2xl p-10 md:p-12">
    <div className="w-40 h-40 flex items-center justify-center mb-6 drop-shadow-xl bg-[#181818] rounded-full">
      <Image 
        src={image} 
        alt={title} 
        width={112} 
        height={112} 
        className="w-28 h-28 object-contain select-none" 
        draggable={false}
      />
    </div>
    <div className="text-3xl md:text-4xl font-extrabold text-white mb-4">
      {title}
    </div>
    <div className="text-lg md:text-xl text-gray-300 font-medium">
      {description}
    </div>
  </div>
);

export const PromoCards = () => {
  const cards = [
    {
      image: "/assets/chill.png",
      title: "Свобода без компромиссов",
      description: "Тысячи пользователей выбрали BazaraVPN, чтобы вернуть себе контроль и спокойствие. Рейтинг 4.9/5 — не просто так."
    },
    {
      image: "/assets/stena.png",
      title: "Доступ без границ",
      description: "Открывай сайты, стримы и приложения из любой точки мира — быстро, стабильно и безопасно."
    },
    {
      image: "/assets/planeta.png",
      title: "Универсальная защита",
      description: "BazaraVPN работает на всех популярных устройствах: Windows, macOS, Android, iOS и даже роутерах."
    }
  ];

  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 my-24 px-4" id="promo-cards">
      {cards.map((card, index) => (
        <PromoCard
          key={index}
          image={card.image}
          title={card.title}
          description={card.description}
        />
      ))}
    </section>
  );
}; 