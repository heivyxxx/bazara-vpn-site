"use client";

import Image from 'next/image';
import { useLang } from '@/lib/LanguageContext';

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

const promoTexts = {
  ru: [
    { title: 'Все локации', desc: 'Доступ к серверам в 10+ странах мира.' },
    { title: 'Безлимит', desc: 'Без ограничений по трафику и скорости.' },
    { title: 'Стриминг', desc: 'Смотрите Netflix, Hulu, Disney+ и другие.' },
  ],
  en: [
    { title: 'All locations', desc: 'Access to servers in 10+ countries.' },
    { title: 'Unlimited', desc: 'No limits on traffic or speed.' },
    { title: 'Streaming', desc: 'Watch Netflix, Hulu, Disney+ and more.' },
  ],
};

export const PromoCards = () => {
  const { lang } = useLang();
  const cards = promoTexts[lang];
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
      {cards.map((card, i) => (
        <div key={i} className="bg-[#232323] rounded-2xl shadow-lg border border-orange-700 p-8 flex flex-col items-center text-center">
          <div className="text-2xl font-bold text-orange-400 mb-2">{card.title}</div>
          <div className="text-base text-gray-200">{card.desc}</div>
        </div>
      ))}
    </div>
  );
}; 