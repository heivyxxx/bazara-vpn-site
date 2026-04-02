"use client";
import React, { useState } from "react";
import { Header } from '@/components/layout/Header';
import { useUser } from '@/lib/LanguageContext';
import sbpImg from '../../public/assets/sbp.png';
import cryptoImg from '../../public/assets/cryptobot.png';
import starsImg from '../../public/assets/stars.png';
import { DepositModal } from './DepositModal';

export default function DepositPage() {
  const [user, setUser] = useUser();
  const [selectedMethod, setSelectedMethod] = useState<{ id: string; name: string } | null>(null);

  return (
    <>
      <Header user={user} onLogout={() => setUser(null)} />
      <main className="min-h-screen pt-[88px] pb-[100px] px-4 flex flex-col items-center">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
          
          <div className="mt-2 text-left">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Пополнить баланс
            </h1>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <span className="text-[#6A6D82] text-xs font-bold uppercase tracking-wider pl-1">Доступные способы</span>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-2 flex flex-col">
              
              <div onClick={() => setSelectedMethod({ id: 'sbp', name: 'СБП' })} className="hover:bg-white/[0.04] transition px-4 py-4 rounded-2xl flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-[46px] h-[46px] rounded-[14px] bg-white/[0.04] border border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 p-2.5">
                    <img src={sbpImg.src} alt="СБП" className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-extrabold text-[15px]">СБП</span>
                    <span className="text-[#6A6D82] font-semibold tracking-wide text-[11px] mt-0.5">Система быстрых платежей</span>
                  </div>
                </div>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2.5" className="group-hover:translate-x-1.5 transition-transform duration-300"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-[90%] mx-auto my-1"></div>
              
              <div onClick={() => setSelectedMethod({ id: 'crypto', name: 'CryptoBot' })} className="hover:bg-white/[0.04] transition px-4 py-4 rounded-2xl flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-[46px] h-[46px] rounded-[14px] bg-white/[0.04] border border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 p-2.5">
                    <img src={cryptoImg.src} alt="CryptoBot" className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-extrabold text-[15px]">CryptoBot</span>
                    <span className="text-[#6A6D82] font-semibold tracking-wide text-[11px] mt-0.5">Криптовалютные платежи</span>
                  </div>
                </div>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2.5" className="group-hover:translate-x-1.5 transition-transform duration-300"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-[90%] mx-auto my-1"></div>

              <div onClick={() => setSelectedMethod({ id: 'stars', name: 'Telegram Stars' })} className="hover:bg-white/[0.04] transition px-4 py-4 rounded-2xl flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-[46px] h-[46px] rounded-[14px] bg-white/[0.04] border border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 p-2.5">
                     <img src={starsImg.src} alt="Telegram Stars" className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-extrabold text-[15px]">Telegram Stars</span>
                    <span className="text-[#6A6D82] font-semibold tracking-wide text-[11px] mt-0.5">Встроенная платежная система Telegram</span>
                  </div>
                </div>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2.5" className="group-hover:translate-x-1.5 transition-transform duration-300"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>

            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3 mt-4 mb-2">
             <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
               <span className="text-[#A2A5B8] text-xs font-bold leading-none">i</span>
             </div>
             <span className="text-[#A2A5B8] text-[13px] leading-relaxed">Выберите удобный способ оплаты и желаемую сумму. Средства зачисляются мгновенно.</span>
          </div>

          <div className="glass-card flex flex-col p-5">
             <div className="flex items-center gap-3 mb-5">
               <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fe6125" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>
               <span className="text-white font-bold text-lg">Активировать промокод</span>
             </div>
             
             <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-1.5 flex items-center">
                <input type="text" placeholder="ВВЕДИТЕ ПРОМОКОД" className="bg-transparent text-[#A2A5B8] text-sm font-semibold w-full outline-none px-4 placeholder-[#6A6D82]" />
                <button className="bg-white/10 hover:bg-white/20 transition px-5 py-2.5 rounded-xl text-white font-semibold text-sm">
                  Активировать
                </button>
             </div>
          </div>

        </div>
      </main>
      <DepositModal 
        isOpen={!!selectedMethod} 
        onClose={() => setSelectedMethod(null)} 
        method={selectedMethod} 
      />
    </>
  );
}