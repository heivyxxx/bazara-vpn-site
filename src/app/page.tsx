"use client";
import React, { useState, useEffect } from "react";
import { Header } from '@/components/layout/Header';
import { useUser } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

export default function HomePage() {
  const [user, setUser] = useUser();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser && tgUser.id) {
      supabase.from('users').select('*').eq('id', tgUser.id).single().then(({ data }) => {
          if (data) {
            setSupabaseUser(data);
            setUser(data);
          }
      });
    }
  }, []);
  
  const effectiveUser = user || supabaseUser;

  return (
    <>
      <Header user={effectiveUser} onLogout={() => setUser(null)} />
      <main className="min-h-screen pt-[88px] pb-[100px] px-4 flex flex-col items-center">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
          
          <div className="mt-2 animate-fadeIn">
            <h1 className="text-[22px] font-extrabold text-white tracking-tight">
              Добро пожаловать, {effectiveUser?.name || 'Друг'}
            </h1>
          </div>

          <div className="glass-card flex flex-col overflow-hidden">
            <div className="px-5 py-5 border-b border-white/5">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-6 h-6 flex items-center justify-center">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="#fe6125"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                 </div>
                 <span className="text-white font-bold text-lg tracking-wide">Активная подписка</span>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#A2A5B8] text-sm"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/></svg> Действительна до</span>
                  <span className="text-white font-semibold text-sm">16 апреля 2026 10:43</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#A2A5B8] text-sm"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2V11h2v5.5zm0-7.5h-2V7h2v2z"/></svg> Дней осталось</span>
                  <span className="text-white font-semibold text-sm">19 дней</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#A2A5B8] text-sm"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/><path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg> Трафик всего</span>
                  <span className="text-white font-semibold text-sm flex items-center gap-1"><span className="text-xl">∞</span> Без ограничений</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#A2A5B8] text-sm"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg> Устройств</span>
                  <span className="text-white font-semibold text-sm">64 <span className="text-[#A2A5B8] font-normal text-xs">(2 на локацию)</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#A2A5B8] text-sm"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg> Автопродление</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#A2A5B8] text-sm">Выкл</span>
                    <div className="w-10 h-6 bg-white/10 rounded-full p-1 cursor-pointer flex items-center relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute left-1 shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex flex-col gap-3">
              <div className="bg-white/[0.04] hover:bg-white/[0.08] transition px-4 py-3 rounded-2xl flex items-center justify-between cursor-pointer border border-transparent hover:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15.5 16l-3.5 3.5m0 0l-3.5-3.5m3.5 3.5V4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">Как подключиться?</span>
                    <span className="text-[#6A6D82] text-xs">Ссылки, QR-код и приложения</span>
                  </div>
                </div>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="bg-white/[0.04] hover:bg-white/[0.08] transition px-4 py-3 rounded-2xl flex items-center justify-between cursor-pointer border border-transparent hover:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">Удалить устройства</span>
                    <span className="text-[#6A6D82] text-xs">Сбросить доступ всех подключённых устройств</span>
                  </div>
                </div>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[#6A6D82] text-xs font-bold uppercase tracking-wider pl-1">Быстрые действия</span>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-2 flex flex-col">
              <div className="hover:bg-white/[0.04] transition px-4 py-4 rounded-2xl flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-base">Продлить</span>
                    <span className="text-[#6A6D82] text-xs">Добавить дни к подписке</span>
                  </div>
                </div>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="h-px bg-white/5 w-[85%] mx-auto"></div>
              <div className="hover:bg-white/[0.04] transition px-4 py-4 rounded-2xl flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-base">Устройства</span>
                    <span className="text-[#6A6D82] text-xs">Подключить больше девайсов</span>
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