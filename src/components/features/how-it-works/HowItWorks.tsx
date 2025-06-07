"use client";

import Image from 'next/image';

interface StepCardProps {
  image: string;
  title: string;
  description: string;
}

const StepCard = ({ image, title, description }: StepCardProps) => (
  <div className="flex flex-col items-center text-center bg-[#232323] rounded-2xl shadow-xl p-10 md:p-12 min-w-[320px] max-w-[370px] mx-auto">
    <div className="bg-[#181818] rounded-full mb-6 shadow-lg flex items-center justify-center w-40 h-40">
      <Image 
        src={image} 
        alt={title} 
        width={128} 
        height={128} 
        className="w-32 h-32 object-contain select-none" 
        draggable={false}
      />
    </div>
    <div className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">
      {title}
    </div>
    <div className="text-lg md:text-xl text-gray-200 font-medium leading-snug">
      {description}
    </div>
  </div>
);

export const HowItWorks = () => {
  const steps = [
    {
      image: "/assets/install.png",
      title: "Установите BazaraVPN за пару секунд",
      description: "Скачайте приложение на любое устройство: Windows, Mac, Android или iOS. Всё просто: открыл, поставил, зашёл. Без лишних настроек и сложных инструкций. Даже бабушка справится (если надо — справимся за неё )."
    },
    {
      image: "/assets/map.png",
      title: "Выберите страну — и в путь",
      description: "Откройте BazaraVPN, выберите нужную страну из списка и нажмите одну кнопку. Всё — ты в безопасности, трафик шифруется, контент разблокирован. Автоматически. Мгновенно. Всегда стабильно."
    },
    {
      image: "/assets/mikrochel.png",
      title: "Никаких границ. Ни в интернете, ни в жизни.",
      description: "Смотри стримы, работай, учись, скачивай и просто живи — где угодно. BazaraVPN открывает весь интернет и даёт тебе свободу без цензуры, блокировок и замедлений."
    }
  ];

  return (
    <section className="max-w-6xl mx-auto my-20 px-4">
      <h2 className="text-3xl font-bold text-orange-400 mb-10 text-center">
        Как это работает?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((step, index) => (
          <StepCard key={index} {...step} />
        ))}
      </div>
    </section>
  );
}; 