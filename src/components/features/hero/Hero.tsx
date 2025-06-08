"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/lib/LanguageContext';
import Link from 'next/link';

const HeroFeature = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <li className="flex items-center gap-2 text-white text-lg">
    {icon}
    {text}
  </li>
);

const heroIcons = [
  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>,
  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>,
];

const heroTexts = {
  ru: {
    title: 'Bazara',
    subtitle: 'VPN',
    main: 'Быстро. Безопасно. Анонимно.',
    desc: 'VPN, который не спрашивает лишнего и не грузит мозги. Просто включил — и ты уже в безопасности. Всё по-базарному просто!',
    btn: 'Попробовать бесплатно',
    features: [
      'Скорость до 1 Гбит/с',
      'Без логов и слежки',
      'До 5 устройств',
    ],
    greeting: 'Привет! Чем могу помочь?',
  },
  en: {
    title: 'Bazara',
    subtitle: 'VPN',
    main: 'Fast. Secure. Anonymous.',
    desc: 'A VPN that doesn\'t ask unnecessary questions or overload your brain. Just turn it on — and you\'re already safe. Simple as bazar!',
    btn: 'Try for free',
    features: [
      'Speed up to 1 Gbps',
      'No logs or tracking',
      'Up to 5 devices',
    ],
    greeting: 'Hi! How can I help you?',
  },
};

export const Hero = () => {
  const { lang } = useLang();
  const t = heroTexts[lang];
  return (
    <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto py-16 md:py-24 px-2 sm:px-4 md:pt-32 md:pb-24 gap-8 md:gap-0">
      <style jsx>{`
        .fade-up-main {
          opacity: 0;
          transform: translateY(32px);
          animation: fadeUpMain 0.7s cubic-bezier(.77,0,.18,1) forwards;
        }
        @keyframes fadeUpMain {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .hero-shield-anim:hover #main-hero-shield {
          transform: rotate(-24deg) translateY(32px) scale(0.98);
          filter: drop-shadow(0 12px 32px #0008);
        }
        .hero-shield-anim:hover .trader-anim {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0) scaleX(-1);
          transition-delay: 0.25s;
        }
        .hero-shield-anim:hover .greeting-anim {
          opacity: 1;
          pointer-events: auto;
          transition-delay: 0.45s;
        }
        @media (max-width: 700px) {
          .text-5xl, .md\:text-6xl { font-size: 2rem !important; }
          .text-2xl, .md\:text-3xl { font-size: 1.1rem !important; }
          .mb-6 { margin-bottom: 1.1rem !important; }
          .py-16, .py-24, .md\:py-24, .md\:pt-32, .md\:pb-24 { padding-top: 1.2rem !important; padding-bottom: 1.2rem !important; }
        }
      `}</style>

      <div className="flex-1 flex flex-col items-start md:items-start text-left w-full max-w-xl">
        <h1 
          className="text-5xl md:text-6xl font-extrabold text-orange-500 mb-6 fade-up-main"
          style={{ animationDelay: '0.08s' }}
        >
          {t.title}<span className="text-white">{t.subtitle}</span>
        </h1>
        
        <p 
          className="text-2xl md:text-3xl text-white mb-10 max-w-xl fade-up-main"
          style={{ animationDelay: '0.18s' }}
        >
          {t.main}
          <span className="text-gray-300 text-lg block mt-4">
            {t.desc}
          </span>
        </p>

        <Link href="/tariffs" passHref legacyBehavior>
          <a
            className="mb-6 text-xl md:text-2xl py-4 md:py-5 px-6 md:px-12 fade-up-main btn-glow block text-center w-full max-w-xs md:max-w-none"
            style={{ animationDelay: '0.32s', borderRadius: '1.1rem', boxShadow: '0 2px 16px 0 #ff880088' }}
          >
            {t.btn}
          </a>
        </Link>

        <ul 
          className="flex flex-wrap gap-4 md:gap-6 mt-6 fade-up-main"
          style={{ animationDelay: '0.44s' }}
        >
          {t.features.map((text, i) => <HeroFeature key={i} icon={heroIcons[i]} text={text} />)}
        </ul>
      </div>

      <div 
        className="flex-1 flex justify-center items-center fade-up-main w-full"
        style={{ animationDelay: '0.56s' }}
      >
        <div className="relative group hero-shield-anim w-full max-w-xs md:max-w-[340px] h-[220px] md:h-[300px]" style={{}}>
          <Image
            src="/assets/trader.gif"
            width={176}
            height={176}
            alt="Trader animation"
            className="absolute bottom-36 left-0 w-32 md:w-44 h-auto trader-anim select-none"
            style={{ 
              opacity: 1,
              pointerEvents: 'auto',
              transform: 'translateY(0)',
              transition: 'opacity 0.5s, transform 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
              zIndex: 1
            }}
          />
          
          <svg 
            id="main-hero-shield" 
            width="100%" 
            height="100%" 
            viewBox="0 0 340 300" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-2xl"
            style={{
              zIndex: 2,
              position: 'relative',
              transition: 'transform 0.7s cubic-bezier(.68,-0.55,.27,1.55), filter 0.5s',
              maxWidth: '340px',
              width: '100%',
              height: '100%'
            }}
          >
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff8800"/>
                <stop offset="100%" stopColor="#a259ff"/>
              </linearGradient>
            </defs>
            <path 
              d="M170 20C230 40 300 40 300 100C300 220 170 280 170 280C170 280 40 220 40 100C40 40 110 40 170 20Z" 
              fill="url(#shieldGrad)" 
              stroke="#fff" 
              strokeWidth="6"
            />
            <path 
              d="M170 80v60l40 20" 
              stroke="#fff" 
              strokeWidth="8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle 
              cx="170" 
              cy="140" 
              r="16" 
              fill="#fff" 
              fillOpacity="0.15"
            />
          </svg>

          <div 
            className="absolute left-24 md:left-32 bottom-60 md:bottom-72 bg-[#232323ee] text-white text-base px-4 py-1.5 rounded-lg shadow-lg opacity-0 pointer-events-none greeting-anim whitespace-nowrap"
            style={{ 
              transition: 'opacity 0.5s',
              zIndex: 3
            }}
          >
            {t.greeting}
          </div>
        </div>
      </div>
    </section>
  );
}; 