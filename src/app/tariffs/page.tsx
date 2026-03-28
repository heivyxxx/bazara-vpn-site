"use client";
import React from "react";
import { Header } from '@/components/layout/Header';
import { useUser } from '@/lib/LanguageContext';

export default function TariffsPage() {
  const [user, setUser] = useUser();

  return (
    <>
      <Header user={user} onLogout={() => setUser(null)} />
      <main className="min-h-screen pt-[120px] pb-[100px] px-4 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center text-center -mt-20">
          
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg shadow-white/5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#fe6125"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          
          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-4">
            Подписка уже активна
          </h1>
          
          <p className="text-[#A2A5B8] text-sm leading-relaxed mb-8 max-w-[280px]">
            Приобрести новую подписку при наличии активной невозможно. Вы можете продлить текущую подписку на вкладке <span className="font-bold text-white">Главная</span>.
          </p>

          <a href="/" className="bg-[#fe6125] hover:bg-[#e04c14] transition-colors text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 w-full shadow-[0_4px_20px_rgba(254,97,37,0.25)]">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            На главную
          </a>

        </div>
      </main>
    </>
  );
}