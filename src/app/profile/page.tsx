"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from '@/components/layout/Header';
import { LanguageProvider, useLang } from '@/lib/LanguageContext';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@/lib/UserContext';

const mockUser = {
  name: "heivyxxx",
  balance: 79.60,
  avatar: "/assets/avatar1.png",
};

export default function ProfilePage() {
  const { lang } = useLang();
  const [user, setUser] = useUser();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [supabaseUserLoading, setSupabaseUserLoading] = useState(false);
  // fallback: если user нет, ищем по telegram_id
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser && tgUser.id) {
      setSupabaseUserLoading(true);
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      supabase
        .from('users')
        .select('*')
        .eq('id', tgUser.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setSupabaseUser(data);
            setUser(data);
            localStorage.setItem('bazaraUser', JSON.stringify(data));
          } else {
            setSupabaseUser(null);
            setUser(null);
            localStorage.removeItem('bazaraUser');
          }
          setSupabaseUserLoading(false);
        });
    }
  }, []);
  const effectiveUser = user || supabaseUser;
  // Моки истории и рефки
  const [historyOpen, setHistoryOpen] = useState(false);
  const [refOpen, setRefOpen] = useState(true);
  return (
    <>
      <Header user={effectiveUser} onLogout={() => setUser(null)} />
      <main className="min-h-screen bg-black flex flex-col items-center pt-24 pb-8">
        {/* Профиль */}
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 mb-6">
          <Image src={effectiveUser?.avatar || "/assets/avatar1.png"} alt="avatar" width={96} height={96} className="rounded-2xl w-24 h-24 object-cover border-4 border-[#232323]" />
          <div className="text-2xl font-bold text-white">{effectiveUser?.name || effectiveUser?.username || '—'}</div>
          <div className="text-lg font-semibold text-[#fd6a32] flex items-center gap-2">
            {typeof effectiveUser?.balance === 'number' ? effectiveUser.balance.toFixed(2) : '—'} <span className="text-gray-400 text-base font-normal">RUB</span>
          </div>
        </div>
        {/* История */}
        <div className="w-full max-w-2xl mx-auto mb-6">
          <button onClick={()=>setHistoryOpen(v=>!v)} className="w-full flex justify-between items-center bg-[#18181b] rounded-2xl px-6 py-4 text-lg font-bold text-white mb-2 shadow border border-[#232323]">
            <span>История</span>
            <svg className={`w-6 h-6 transition-transform ${historyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {historyOpen && (
            <div className="bg-[#232323] rounded-2xl p-6 text-gray-200 text-base flex flex-col gap-2 border border-[#232323]">
              <div className="text-center text-gray-400">Нет операций</div>
            </div>
          )}
        </div>
        {/* Реферальная программа */}
        <div className="w-full max-w-2xl mx-auto mb-6">
          <button onClick={()=>setRefOpen(v=>!v)} className="w-full flex justify-between items-center bg-[#18181b] rounded-2xl px-6 py-4 text-lg font-bold text-white mb-2 shadow border border-[#232323]">
            <span>Реферальная Орбита</span>
            <svg className={`w-6 h-6 transition-transform ${refOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {refOpen && (
            <div className="bg-[#232323] rounded-2xl p-6 text-gray-200 text-base flex flex-col gap-4 border border-[#232323]">
              <div className="text-center text-lg font-bold text-white mb-2">Приглашайте друзей — зарабатывайте RUB и очки сезона</div>
              <div className="flex gap-4 flex-col sm:flex-row justify-center items-center">
                <div className="bg-[#18181b] rounded-2xl p-6 flex-1 min-w-[160px] flex flex-col items-center">
                  <div className="text-white text-lg font-bold mb-1">RUB</div>
                  <div className="text-gray-400 text-sm mb-1">Зарабатывай</div>
                  <div className="text-2xl font-extrabold text-[#00c3ff] mb-1">2%</div>
                  <div className="text-xs text-gray-400 text-center">от всех продаж твоих рефералов</div>
                </div>
                <div className="bg-[#18181b] rounded-2xl p-6 flex-1 min-w-[160px] flex flex-col items-center">
                  <div className="text-white text-lg font-bold mb-1">Очки сезона</div>
                  <div className="text-gray-400 text-sm mb-1">Зарабатывай</div>
                  <div className="text-2xl font-extrabold text-yellow-400 mb-1">10%</div>
                  <div className="text-xs text-gray-400 text-center">от всех продаж твоих рефералов</div>
                </div>
              </div>
              <div className="text-center text-white mt-4 mb-2">Твой прогресс</div>
              <div className="flex justify-center gap-4 mb-2">
                <div className="bg-[#18181b] rounded-xl px-6 py-2 text-white font-bold">LVL 1</div>
                <div className="bg-[#18181b] rounded-xl px-6 py-2 text-white font-bold">0 / 100 RUB оборота</div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <div>Рефералов: 0</div>
                <div>Заработок: 0 RUB</div>
              </div>
              <button className="mt-4 w-full bg-[#232323] hover:bg-[#18181b] text-[#00c3ff] font-bold py-3 rounded-xl transition">Пригласить друга</button>
            </div>
          )}
        </div>
      </main>
    </>
  );
} 