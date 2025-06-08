"use client";

import Image from 'next/image';
import { useLang } from '@/lib/LanguageContext';

const howItWorksTexts = {
  ru: {
    title: 'Как это работает?',
    steps: [
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
    ]
  },
  en: {
    title: 'How does it work?',
    steps: [
      {
        image: "/assets/install.png",
        title: "Install BazaraVPN in seconds",
        description: "Download the app for any device: Windows, Mac, Android, or iOS. It's simple: open, install, log in. No complicated settings or instructions. Even grandma can do it (and if not — we'll help her)."
      },
      {
        image: "/assets/map.png",
        title: "Choose a country — and go",
        description: "Open BazaraVPN, select the desired country from the list, and press one button. That's it — you're safe, traffic is encrypted, content is unblocked. Automatically. Instantly. Always stable."
      },
      {
        image: "/assets/mikrochel.png",
        title: "No borders. Online or in life.",
        description: "Watch streams, work, study, download, and just live — anywhere. BazaraVPN opens up the entire internet and gives you freedom without censorship, blocks, or slowdowns."
      }
    ]
  }
};

export const HowItWorks = () => {
  const { lang } = useLang();
  const t = howItWorksTexts[lang];
  return (
    <section className="max-w-6xl mx-auto my-10 md:my-20 px-2 sm:px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-6 md:mb-10 text-center">
        {t.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
        {t.steps.map((step, index) => (
          <div key={index} className="bg-[#232323] rounded-2xl shadow-xl p-5 md:p-8 flex flex-col items-center text-center">
            <Image src={step.image} alt={step.title} width={80} height={80} className="mb-4 md:mb-6 w-20 h-20 md:w-28 md:h-28 object-contain select-none" draggable={false} />
            <div className="text-lg md:text-2xl font-bold text-white mb-2">{step.title}</div>
            <div className="text-base text-gray-300">{step.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}; 