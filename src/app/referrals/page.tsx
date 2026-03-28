"use client";
import React, { useState } from "react";
import { Header } from '@/components/layout/Header';
import { useUser } from '@/lib/LanguageContext';

export default function ReferralsPage() {
  const [user, setUser] = useUser();
  const [copied, setCopied] = useState(false);
  const referralLink = `https://t.me/VPNEnvyBot?start=ref${user?.id || '1076484432'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header user={user} onLogout={() => setUser(null)} />
      <main className="min-h-screen pt-[88px] pb-[100px] px-4 flex flex-col items-center">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
          
          <div className="mt-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Приглашайте друзей и зарабатывайте
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-3">
             <div className="glass-card flex flex-col items-center justify-center py-4 px-2 text-center rounded-2xl">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6A6D82" strokeWidth="2" className="mb-2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 7a4 4 0 118 0 4 4 0 01-8 0zM20 8v6M23 11h-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
               <span className="text-[#6A6D82] text-[10px] font-bold tracking-wider uppercase mb-1">Приглашено</span>
               <span className="text-white font-black text-lg">1</span>
             </div>
             <div className="glass-card flex flex-col items-center justify-center py-4 px-2 text-center rounded-2xl">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6A6D82" strokeWidth="2" className="mb-2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01" strokeLinecap="round" strokeLinejoin="round"/></svg>
               <span className="text-[#6A6D82] text-[10px] font-bold tracking-wider uppercase mb-1">Заработано</span>
               <span className="text-white font-black text-lg">0.00₽</span>
             </div>
             <div className="glass-card flex flex-col items-center justify-center py-4 px-2 text-center rounded-2xl">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6A6D82" strokeWidth="2" className="mb-2"><path d="M19 5L5 19M9 5a2 2 0 11-4 0 2 2 0 014 0zM19 19a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
               <span className="text-[#6A6D82] text-[10px] font-bold tracking-wider uppercase mb-1">Процент</span>
               <span className="text-white font-black text-lg">25%</span>
             </div>
          </div>

          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2 px-1">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A6D82" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round"/></svg>
               <span className="text-[#A2A5B8] text-sm">Ваша реферальная ссылка</span>
             </div>
             <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-1.5 flex items-center">
                <input type="text" value={referralLink} readOnly className="bg-transparent text-[#A2A5B8] text-sm w-full outline-none px-3 font-mono" />
                <button onClick={handleCopy} className="w-10 h-10 bg-white/10 hover:bg-white/20 transition rounded-xl flex items-center justify-center flex-shrink-0">
                  {copied ? (
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fe6125" strokeWidth="2"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A2A5B8" strokeWidth="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </button>
             </div>
             
             <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3 mt-1">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A2A5B8" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M9 21h6m-3-3v3M12 4a5 5 0 00-5 5c0 2.5 2.5 3.5 2.5 6h5c0-2.5 2.5-3.5 2.5-6a5 5 0 00-5-5z" strokeLinecap="round" strokeLinejoin="round"/></svg>
               <span className="text-[#A2A5B8] text-[13px] leading-snug">Отправляйте ссылку друзьям, публикуйте в чатах и соцсетях - заработок будет расти автоматически</span>
             </div>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <span className="text-[#6A6D82] text-xs font-bold uppercase tracking-wider pl-1">Вывод средств</span>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-2 flex flex-col">
              <div className="hover:bg-white/[0.04] transition px-4 py-4 rounded-2xl flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#A2A5B8]">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-base">На карту</span>
                    <span className="text-[#6A6D82] text-xs">Вывод на банковскую карту (от 500₽)</span>
                  </div>
                </div>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="h-px bg-white/5 w-[85%] mx-auto"></div>
              <div className="hover:bg-white/[0.04] transition px-4 py-4 rounded-2xl flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#A2A5B8]">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4M4 10v9a2 2 0 002 2h14v-9H4z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="16" cy="15" r="2"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-base">На баланс</span>
                    <span className="text-[#6A6D82] text-xs">Перевести на баланс бота (от 1₽)</span>
                  </div>
                </div>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
