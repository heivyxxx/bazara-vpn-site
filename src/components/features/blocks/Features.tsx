"use client";

import Image from 'next/image';
import { useLang } from '@/lib/LanguageContext';

interface FeatureBlockProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
}

const FeatureBlock = ({ 
  title, 
  subtitle, 
  description, 
  image, 
  imageAlt,
  reverse = false,
  gradientFrom = "orange-400",
  gradientTo = "purple-500"
}: FeatureBlockProps) => {
  const { lang } = useLang();
  const t = featuresTexts[lang];

  return (
    <section className="w-full bg-[#181818] py-16 px-4">
      <div className={`max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-stretch gap-10 md:gap-16 ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            <span className={`text-transparent bg-clip-text bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`}>
              {title}
            </span>
            <br />
            <span>{subtitle}</span>
          </h2>
          <div className="text-lg md:text-2xl text-gray-200 font-medium leading-snug">
            {description}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Image 
            src={image} 
            alt={imageAlt}
            width={512}
            height={512}
            className="w-full max-w-xs md:max-w-md lg:max-w-lg object-contain drop-shadow-xl select-none"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
};

const featuresTexts = {
  ru: {
    title: 'Возможности',
    items: [
      'Мультиустройство',
      'Защита Wi-Fi',
      'Смена IP',
      'Доступ к контенту по всему миру',
    ],
  },
  en: {
    title: 'Features',
    items: [
      'Multi-device',
      'Wi-Fi protection',
      'IP change',
      'Access to content worldwide',
    ],
  },
};

export const Features = () => {
  const features = [
    {
      title: "Всегда на связи.",
      subtitle: "Даже когда весь мир против.",
      description: 'BazaraVPN подключает тебя к миру — без слежки, блокировок и прерываний. Работай, чиль, смотри YouTube и телегу, даже если кто-то решил "запретить".',
      image: "/assets/block1.png",
      imageAlt: "Всегда на связи",
      gradientFrom: "orange-400",
      gradientTo: "purple-500"
    },
    {
      title: "Оставайся в тени.",
      subtitle: "Всегда.",
      description: "Никакого отслеживания, логов и рекламных трекеров. Твой трафик шифруется, а личные данные остаются твоими. BazaraVPN — как ниндзя в интернете, только круче.",
      image: "/assets/block2.png",
      imageAlt: "Оставайся в тени",
      reverse: true,
      gradientFrom: "purple-500",
      gradientTo: "orange-400"
    },
    {
      title: "Ничего лишнего.",
      subtitle: "Только результат.",
      description: 'BazaraVPN запускается с одного нажатия и сразу работает. Без регистрации, без настройки, без вопросов. Нажал "подключить" — и ты уже в безопасности.',
      image: "/assets/block3.png",
      imageAlt: "Ничего лишнего",
      gradientFrom: "orange-400",
      gradientTo: "purple-500"
    }
  ];

  return (
    <>
      {features.map((feature, index) => (
        <FeatureBlock key={index} {...feature} />
      ))}
    </>
  );
}; 