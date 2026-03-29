"use client";
import React from "react";
import { Header } from '@/components/layout/Header';
import { useUser } from '@/lib/LanguageContext';

export default function DepositPage() {
  const [user, setUser] = useUser();

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
              
              <div className="hover:bg-white/[0.04] transition px-4 py-4 rounded-2xl flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#A2A5B8] overflow-hidden group-hover:scale-110 transition-transform duration-300 p-2 border border-white/5">
                    <img src="https://static.tinkoff.ru/images/new-payments/sbp_logo_140x140.webp" alt="СБП" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_of_the_System_of_Fast_Payments.svg' }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-extrabold text-[15px]">СБП</span>
                    <span className="text-[#6A6D82] font-semibold tracking-wide text-[11px] mt-0.5">Система быстрых платежей</span>
                  </div>
                </div>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2.5" className="group-hover:translate-x-1.5 transition-transform duration-300"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-[90%] mx-auto my-1"></div>
              
              <div className="hover:bg-white/[0.04] transition px-4 py-4 rounded-2xl flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#A2A5B8] overflow-hidden group-hover:scale-110 transition-transform duration-300 p-2.5 border border-white/5 shadow-[0_0_20px_rgba(33,165,230,0.1)]">
                    <img src="https://cryptologos.cc/logos/toncoin-ton-logo.webp" alt="CryptoBot" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-extrabold text-[15px]">CryptoBot</span>
                    <span className="text-[#6A6D82] font-semibold tracking-wide text-[11px] mt-0.5">Криптовалютные платежи</span>
                  </div>
                </div>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2.5" className="group-hover:translate-x-1.5 transition-transform duration-300"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-[90%] mx-auto my-1"></div>

              <div className="hover:bg-white/[0.04] transition px-4 py-4 rounded-2xl flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 flex items-center justify-center text-yellow-500 overflow-hidden group-hover:scale-110 transition-transform duration-300 p-2 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
                     <img src="https://emoji.discadia.com/emojis/f2df2616-e575-403d-88ca-deddce4d98ed.webp" alt="Telegram Stars" className="w-full h-full object-contain scale-110" onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Telegram_Premium_logo.svg/512px-Telegram_Premium_logo.svg.png' }} />
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
               <svg width="24" height="24" viewBox="0 0 24 24" fill="#A2A5B8"><path d="M2 8a2 2 0 012-2h16a2 2 0 012 2v2v2v2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4v-2v-2V8zm2-2a2 2 0 00-2 2v2a2 2 0 012 2 2 2 0 01-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 01-2-2 2 2 0 012-2V8a2 2 0 00-2-2H4z" fillRule="evenodd" clipRule="evenodd"/></svg>
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
    </>
  );
}