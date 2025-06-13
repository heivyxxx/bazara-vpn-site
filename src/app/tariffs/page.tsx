"use client";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider, useLang, useUser } from '@/lib/LanguageContext';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { PaymentModal, TariffType } from './PaymentModal';
import { TelegramAuthModal } from '@/components/features/TelegramAuthModal';

const tariffsTexts = {
  ru: {
    bannerTitle: 'Открытие BazaraVPN',
    bannerDesc: '20% скидка на все тарифы!<br><span class="text-base text-white font-normal">Только до 31 мая</span>',
    bannerBtn: 'Жми!',
    mainTitle: 'VPN для важных задач',
    mainDesc: 'Быстро. Безопасно. Анонимно.<br>Доступ к любимым сайтам и сервисам по всему миру — без ограничений и слежки. Всё по-базарному просто!',
    btnYear: '2290₽/год',
    btnMonth: '399₽/мес',
    tryTitle: 'Попробуйте BazaraVPN бесплатно',
    tryDesc: '3 дня полной защиты — без оплаты. без карты.<br>Оцени качество — а потом решишь сам.',
    tryBtn: 'Активировать пробную версию',
    appsTitle: 'Приложения для всех устройств',
    appsDesc: 'BazaraVPN работает на Windows, macOS, Android, iOS и даже на роутерах. Защитите все свои устройства одним кликом!',
    guaranteeTitle: '30-дневная гарантия возврата денег',
    guaranteeDesc: 'Если что-то не понравится — вернём деньги без лишних вопросов. Просто напиши в поддержку!',
    testimonial: 'Пользуюсь BazaraVPN уже год — скорость отличная, поддержка отвечает быстро, а тарифы реально выгодные!',
    testimonialUser: '— Настоящий пользователь',
  },
  en: {
    bannerTitle: 'BazaraVPN Launch',
    bannerDesc: '20% discount on all tariffs!<br><span class="text-base text-white font-normal">Only until May 31</span>',
    bannerBtn: 'Go!',
    mainTitle: 'VPN for important tasks',
    mainDesc: 'Fast. Secure. Anonymous.<br>Access your favorite sites and services worldwide — no limits, no tracking. As simple as it gets!',
    btnYear: '2290₽/year',
    btnMonth: '399₽/month',
    tryTitle: 'Try BazaraVPN for free',
    tryDesc: '3 days of full protection — no payment, no card.<br>Try the quality — then decide for yourself.',
    tryBtn: 'Activate trial',
    appsTitle: 'Apps for all devices',
    appsDesc: 'BazaraVPN works on Windows, macOS, Android, iOS, and even routers. Protect all your devices with one click!',
    guaranteeTitle: '30-day money-back guarantee',
    guaranteeDesc: 'If you don\'t like something — we\'ll refund your money, no questions asked. Just contact support!',
    testimonial: "I've been using BazaraVPN for a year — great speed, fast support, and really good prices!",
    testimonialUser: '— Real user',
  }
};

function TariffsContent() {
  const { lang } = useLang();
  const t = tariffsTexts[lang];
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTariff, setModalTariff] = React.useState<TariffType>('year');
  const [modalPrice, setModalPrice] = React.useState('2290₽');
  const [priceAnim, setPriceAnim] = React.useState(false);
  const oldPriceRef = useRef<HTMLSpanElement>(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [bannerFading, setBannerFading] = useState(false);
  const [showOldPrice, setShowOldPrice] = React.useState(true);
  const [exploding, setExploding] = useState(false);
  const [showNewPrice, setShowNewPrice] = useState(false);
  const [explodePieces, setExplodePieces] = useState<{x:number,y:number,key:string}[]>([]);
  const btnYearRef = useRef<HTMLButtonElement>(null);
  const btnMonthRef = useRef<HTMLButtonElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);
  const btnsContainerRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useUser();
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [trialResult, setTrialResult] = useState<string|null>(null);
  const [trialError, setTrialError] = useState<string|null>(null);
  const [loadingTrial, setLoadingTrial] = useState(false);

  const handleOpenModal = (tariff: TariffType, price: string) => {
    setModalTariff(tariff);
    setModalPrice(price);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleBannerClick = () => {
    if (exploding || showNewPrice) return;
    setBannerFading(true);
    setTimeout(() => setBannerVisible(false), 500); // плавное исчезновение баннера
    setExploding(true);
    // Генерируем кусочки для старой цены и кнопок через getBoundingClientRect
    const makePieces = (el:HTMLElement|null, count=12) => {
      if (!el || !btnsContainerRef.current) return [];
      const elRect = el.getBoundingClientRect();
      const parentRect = btnsContainerRef.current.getBoundingClientRect();
      const centerX = elRect.left + elRect.width/2 - parentRect.left;
      const centerY = elRect.top + elRect.height/2 - parentRect.top;
      return Array.from({length:count}).map((_,i)=>({
        x: centerX - 12 + Math.random()*elRect.width/2*(Math.random()>0.5?1:-1),
        y: centerY - 12 + Math.random()*elRect.height/2*(Math.random()>0.5?1:-1),
        key: `${el.id||'piece'}-${i}-${Date.now()}`
      }));
    };
    const pieces = [
      ...makePieces(priceRef.current, 10),
      ...makePieces(btnYearRef.current, 12),
      ...makePieces(btnMonthRef.current, 12)
    ];
    setExplodePieces(pieces);
    setTimeout(()=>{
      setShowOldPrice(false);
      setExplodePieces([]);
      setShowNewPrice(true);
      setExploding(false);
    }, 1200);
  };

  // Обработчик trial-кнопки
  const handleTrialClick = () => {
    setTrialError(null);
    setTrialResult(null);
    if (!user) {
      setTrialModalOpen(true);
    } else {
      requestTrial(user);
    }
  };

  // Запрос trial-ссылки
  const requestTrial = async (u: any) => {
    setLoadingTrial(true);
    setTrialError(null);
    setTrialResult(null);
    try {
      const resp = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegram_id: u.id, name: u.name, username: u.username })
      });
      const data = await resp.json();
      if (data.success && data.link) {
        setTrialResult(data.link);
      } else {
        setTrialError(data.error || 'Ошибка получения trial-ссылки');
      }
    } catch {
      setTrialError('Ошибка соединения с сервером');
    }
    setLoadingTrial(false);
  };

  return (
    <main className="min-h-screen bg-[#181818] pt-24 pb-10 px-2 sm:px-4 flex flex-col items-center">
      <style jsx>{`
        .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.7s, transform 0.7s; }
        .fade-up.visible { opacity: 1; transform: none; }
        .device-anim { transition: transform 0.5s cubic-bezier(.77,0,.18,1); }
        .device-anim:hover { transform: scale(1.13) rotate(-6deg); filter: drop-shadow(0 0 16px #ff8800cc); }
        .tariff-btn { background: linear-gradient(90deg, #ff8800 0%, #a259ff 100%); color: #fff; font-weight: 700; font-size: 1.18rem; border: none; border-radius: 1.1rem; padding: 1.1rem 2.5rem; transition: box-shadow 0.22s, transform 0.18s, background 0.18s; outline: none; position: relative; z-index: 1; box-shadow: 0 2px 16px 0 #ff880088; width:100%; max-width:320px; }
        .tariff-btn:hover, .tariff-btn:focus { background: linear-gradient(90deg, #ff8800 10%, #a259ff 90%); transform: scale(1.06); box-shadow: 0 4px 24px 0 #ff8800aa; }
        .tariff-card { transition: box-shadow 0.22s, border 0.18s; box-shadow: 0 8px 32px 0 #00000044, 0 2px 8px 0 #a259ff22; }
        .tariff-card:hover { z-index: 2; box-shadow: 0 8px 48px 0 #ff880022, 0 2px 0 #a259ff; }
        .no-glow { box-shadow: none !important; }
        .price-old { display:inline-block; font-size:1.2em; color:#b8b8b8; background:none !important; border-radius:0; padding:0; margin-right:0.7em; text-decoration:line-through; opacity:1; transition:opacity 0.6s, transform 0.6s; }
        .price-old.hide { opacity:0; transform:translateY(-30px) scale(0.7) rotate(-12deg); }
        .try-free-btn { background: linear-gradient(90deg, #ff8800 0%, #a259ff 100%); color: #fff; font-weight: 700; font-size: 1.18rem; border: none; border-radius: 1.1rem; min-width:180px; width:100%; max-width:320px; padding:1.1rem 2.5rem; box-shadow:0 2px 16px 0 #ff880088; transition: box-shadow 0.22s, background 0.18s, transform 0.18s; cursor:pointer; }
        .try-free-btn:hover { background: linear-gradient(90deg, #ff8800 10%, #a259ff 90%); box-shadow: 0 4px 24px 0 #ff8800aa; transform: scale(1.04); }
        .promo-banner { background: linear-gradient(90deg, #ff8800 0%, #a259ff 100%); color: #fff; border-radius: 1.1rem; box-shadow: 0 2px 16px 0 #ff880088; padding: 1.1rem 2.5rem; font-weight: 700; font-size: 1.18rem; display: flex; flex-direction:column; gap: 1.5rem; margin-bottom: 2rem; }
        @media (min-width: 640px) { .promo-banner { flex-direction: row; } }
        .promo-banner .promo-btn { background: #fff; color: #ff8800; border-radius: 1.1rem; font-size: 1.2rem; font-weight: 700; padding: 0.8rem 2.2rem; box-shadow: 0 2px 16px 0 #ff880088; transition: background 0.18s, color 0.18s, box-shadow 0.18s; }
        .promo-banner .promo-btn:hover { background: #ff8800; color: #fff; box-shadow: 0 4px 24px 0 #ff8800aa; }
        .explode-piece {
          position: absolute;
          width: 24px;
          height: 24px;
          background: linear-gradient(90deg, #ff8800 0%, #a259ff 100%);
          border-radius: 6px;
          opacity: 1;
          pointer-events: none;
          z-index: 10;
          animation: explode-fall 1.2s forwards;
        }
        @keyframes explode-fall {
          to {
            transform: translateY(120px) scale(0.7) rotate(40deg);
            opacity: 0;
          }
        }
        .new-price-fade {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s, transform 0.7s;
        }
        .new-price-fade.visible {
          opacity: 1;
          transform: none;
        }
        .promo-banner-fade {
          opacity: 0;
          transition: opacity 0.5s;
        }
        .promo-banner-visible {
          opacity: 1;
          transition: opacity 0.5s;
        }
        @media (max-width: 700px) {
          .tariff-card { flex-direction: column !important; padding: 1.2rem !important; gap: 1.5rem !important; }
          .promo-banner { flex-direction: column !important; padding: 1.2rem !important; gap: 1.2rem !important; }
          .w-[320px], .w-[400px], .w-[680px] { width: 100% !important; max-width: 320px !important; }
          .h-[270px], .h-[340px], .h-[360px] { height: auto !important; max-height: 220px !important; }
          .text-4xl, .text-5xl { font-size: 1.5rem !important; }
          .text-3xl { font-size: 1.2rem !important; }
          .text-2xl { font-size: 1.05rem !important; }
          .text-xl { font-size: 1rem !important; }
          .px-14, .px-20, .py-16, .py-10, .p-14, .p-20, .p-12, .p-8 { padding-left: 1rem !important; padding-right: 1rem !important; padding-top: 1rem !important; padding-bottom: 1rem !important; }
          .gap-16, .gap-12, .gap-10, .gap-8, .gap-6, .gap-4 { gap: 1rem !important; }
        }
      `}</style>
      {/* PromoBanner */}
      {bannerVisible && (
        <div className={clsx("fade-up w-full max-w-5xl mx-auto rounded-2xl bg-gradient-to-r from-[#7b2ff2] to-[#f357a8] flex items-center justify-between px-8 py-7 mb-10 shadow-lg cursor-pointer", bannerFading ? "promo-banner-fade" : "promo-banner-visible")}
          onClick={handleBannerClick}>
          <div className="flex items-center gap-6">
            <Image src="/assets/tort.png" alt="Торт" width={128} height={128} className="w-32 h-32 md:w-40 md:h-40 select-none" draggable={false} />
            <div className="flex flex-col gap-1">
              <span className="text-3xl md:text-4xl font-extrabold text-white">{t.bannerTitle}</span>
              <span className="text-xl md:text-2xl font-semibold text-white" dangerouslySetInnerHTML={{__html: t.bannerDesc}} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-white text-orange-600 font-bold px-7 py-3 rounded-2xl text-2xl shadow-lg">{t.bannerBtn}</span>
          </div>
        </div>
      )}
      {/* TariffMainBlock */}
      <section className="fade-up w-full flex justify-center items-center py-16 px-4">
        <div className="tariff-card no-glow w-full max-w-6xl bg-[#232323] rounded-3xl flex flex-col md:flex-row items-center md:items-stretch gap-16 md:gap-0 p-14 md:p-20 border border-[#333] relative overflow-visible">
          <div className="flex-1 flex flex-col justify-center items-start">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">{t.mainTitle}</h2>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-lg" dangerouslySetInnerHTML={{__html: t.mainDesc}} />
            <div className="flex gap-4 mt-2 items-center min-h-[56px] relative" ref={btnsContainerRef}>
              {/* Старые цены и кнопки */}
              {showOldPrice && (
                <>
                  <button ref={btnYearRef} className={clsx("tariff-btn", exploding && 'hide')} onClick={()=>handleOpenModal('year', lang==='ru'?'2290₽':'2290₽')}>2290₽/год</button>
                  <button ref={btnMonthRef} className={clsx("tariff-btn border-2 border-orange-400 text-orange-500 bg-[#232323]", exploding && 'hide')} style={{background: '#232323', color: '#ff8800', border: '2px solid #ff8800', marginLeft: '1rem'}} onClick={()=>handleOpenModal('month', lang==='ru'?'399₽':'399₽')}>399₽/мес</button>
                </>
              )}
              {/* Анимация рассыпания */}
              {explodePieces.map(piece => (
                <span key={piece.key} className="explode-piece" style={{left:piece.x, top:piece.y}} />
              ))}
              {/* Новые цены и кнопки */}
              {showNewPrice && (
                <div className={clsx("flex gap-4 items-center new-price-fade", showNewPrice && 'visible')}>
                  <button className="tariff-btn" style={{marginRight: '1rem'}} onClick={()=>handleOpenModal('year', lang==='ru'?'777₽':'777₽')}>777₽/год</button>
                  <button className="tariff-btn border-2 border-orange-400 text-orange-500 bg-[#232323]" style={{background: '#232323', color: '#ff8800', border: '2px solid #ff8800'}} onClick={()=>handleOpenModal('month', lang==='ru'?'99₽':'99₽')}>99₽/мес</button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <Image src="/assets/vpn-3d.png" alt="VPN 3D" width={400} height={340} className="w-[320px] h-[270px] md:w-[400px] md:h-[340px] object-contain select-none" draggable={false} />
          </div>
        </div>
      </section>
      {/* TryFreeBlock */}
      <section className="fade-up w-full flex justify-center items-center py-10 px-4">
        <div className="tariff-card no-glow w-full max-w-4xl bg-[#232323] rounded-3xl flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12 border border-[#232323]">
          <div className="flex-shrink-0 flex items-center justify-center">
            <Image src="/assets/gift-3d.png" alt="Подарок" width={96} height={96} className="w-24 h-24 md:w-32 md:h-32 select-none" draggable={false} />
          </div>
          <div className="flex-1 flex flex-col items-start">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">{t.tryTitle}</h3>
            <p className="text-base md:text-lg text-white mb-5" dangerouslySetInnerHTML={{__html: t.tryDesc}} />
            <button className="try-free-btn" onClick={handleTrialClick} disabled={loadingTrial}>{loadingTrial ? 'Загрузка...' : t.tryBtn}</button>
            {trialResult && (
              <div className="mt-4 text-green-400 break-all">
                Ваша trial-ссылка: <a href={trialResult} className="underline break-all" target="_blank" rel="noopener noreferrer">{trialResult}</a>
              </div>
            )}
            {trialError && (
              <div className="mt-4 text-red-400">{trialError}</div>
            )}
          </div>
        </div>
        <TelegramAuthModal
          isOpen={trialModalOpen}
          onClose={() => setTrialModalOpen(false)}
          onAuth={u => {
            setUser(u);
            setTrialModalOpen(false);
            requestTrial(u);
          }}
        />
      </section>
      {/* DevicesBlock */}
      <section className="fade-up max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 mb-20 px-4">
        <div className="flex-1 flex flex-col items-start md:items-start text-left mb-8 md:mb-0">
          <h2 className="text-3xl font-bold text-orange-400 mb-4">{t.appsTitle}</h2>
          <p className="text-lg text-white mb-6 max-w-lg">{t.appsDesc}</p>
          <div className="flex flex-wrap gap-4">
            <span className="device-anim bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"><Image src="/assets/windows.png" alt="Windows" width={28} height={28} className="w-7 h-7" />Windows</span>
            <span className="device-anim bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"><Image src="/assets/apple.png" alt="macOS" width={28} height={28} className="w-7 h-7" />macOS</span>
            <span className="device-anim bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"><Image src="/assets/android.png" alt="Android" width={28} height={28} className="w-7 h-7" />Android</span>
            <span className="device-anim bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"><Image src="/assets/apple.png" alt="iOS" width={28} height={28} className="w-7 h-7" />iOS</span>
            <span className="device-anim bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"><Image src="/assets/linux.png" alt="Linux" width={28} height={28} className="w-7 h-7" style={{filter:'invert(1)'}} />Linux</span>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Image src="/assets/devices.png" alt="Все устройства" width={680} height={360} className="w-[680px] h-[360px] object-contain select-none" draggable={false} />
        </div>
      </section>
      {/* GuaranteeBlock */}
      <div className="fade-up guarantee-block flex items-center gap-4 w-full max-w-4xl mx-auto my-8 p-8 rounded-3xl bg-gradient-to-r from-orange-500 to-purple-500 text-white shadow-lg">
        <div>
          <div className="text-2xl font-bold mb-1">{t.guaranteeTitle}</div>
          <div className="text-lg">{t.guaranteeDesc}</div>
        </div>
      </div>
      {/* TestimonialBlock */}
      <div className="fade-up testimonial w-full max-w-3xl mx-auto my-8 p-8 rounded-3xl bg-[#232323] text-white shadow-lg italic relative">
        <span>{t.testimonial}</span>
        <div className="mt-2 text-orange-400 font-bold">{t.testimonialUser}</div>
        <span style={{position:'absolute',right:'1.2rem',bottom:'0.2rem',fontSize:'2.5rem',color:'#ff8800'}}>&quot;</span>
      </div>
      <PaymentModal isOpen={modalOpen} onClose={handleCloseModal} tariff={modalTariff} price={modalPrice} />
    </main>
  );
}

// useEffect для fade-up анимации
function useFadeUp() {
  useEffect(() => {
    const onScroll = () => {
      document.querySelectorAll('.fade-up').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40) {
          el.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('DOMContentLoaded', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('DOMContentLoaded', onScroll);
    };
  }, []);
}

function TariffsPageWrapper() {
  useFadeUp();
  const [user, setUser] = useUser();
  return (
    <LanguageProvider>
      <Header user={user} onLogout={() => { setUser(null); if (typeof window !== 'undefined') localStorage.removeItem('bazaraUser'); }} />
      <TariffsContent />
      <Footer />
    </LanguageProvider>
  );
}

export default TariffsPageWrapper; 