"use client";
import React, { useEffect, useState } from "react";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [render, setRender] = useState(true);

  useEffect(() => {
    // Ждем инициализацию (можно держать дольше, если хочется показать дольше)
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => setRender(false), 500); // время на анимацию fadeOut
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#0A0A0F] flex flex-col items-center justify-center transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center animate-page-in">
        {/* Glow effect behind logo */}
        <div className="absolute w-[150px] h-[150px] bg-[#fe6125]/20 rounded-full blur-[40px] animate-pulse"></div>
        <div className="absolute w-[120px] h-[120px] bg-[#a259ff]/20 rounded-full blur-[30px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        {/* Logo and Icon */}
        <div className="flex flex-col items-center gap-6 relative z-10 w-full px-8">
           <img src="/assets/logo-bazara.png" alt="BazaraVPN" className="w-24 h-24 object-contain animate-bounce drop-shadow-[0_0_20px_rgba(254,97,37,0.5)]" />
           <div className="text-4xl font-black text-white tracking-tight flex items-center gap-1.5 drop-shadow-lg">
             <span className="text-[#fe6125]">Bazara</span>VPN
           </div>

           {/* Modern loading bar */}
           <div className="w-48 h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden relative border border-white/5 shadow-inner">
             <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-[#fe6125] to-[#a259ff] rounded-full animate-loaderBar origin-left"></div>
           </div>
           
           <span className="text-[#a2a5b8] text-sm mt-1 font-medium tracking-widest uppercase animate-pulse">
             Загрузка...
           </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes loaderBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-loaderBar {
          animation: loaderBar 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
