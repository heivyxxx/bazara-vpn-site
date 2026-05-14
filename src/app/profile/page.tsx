"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Header } from '@/components/layout/Header';
import { LanguageProvider, useLang } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/lib/LanguageContext';
import QRCode from 'react-qr-code';
import { Disclosure } from '@headlessui/react';
import { useRouter } from "next/navigation";
import { AppMainShell } from '@/components/AppMainShell';
import { ResponsiveDialog } from '@/components/modal/ResponsiveDialog';

// --- HISTORY MODAL ---
function ProfileHistoryModal({ open, onClose, items }: { open: boolean; onClose: () => void; items: any[] }) {
  return (
    <ResponsiveDialog open={open} onClose={onClose} title="Вся история" sheetBg="#13141C" desktopMaxWidthClass="max-w-md">
      <div className="flex flex-col gap-1">
        {items.length === 0 && <div className="py-6 text-center text-gray-500">Нет операций</div>}
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex flex-col gap-1 rounded-xl border border-transparent px-4 py-3 transition hover:border-white/5 hover:bg-white/5"
          >
            <div className="flex items-center justify-between">
              <span className={item.type === 'buy' ? 'text-sm font-medium text-[#A259FF]' : 'text-sm font-medium text-green-400'}>
                {item.type === 'buy' ? 'Пополнение' : 'Списание'}
              </span>
              <span className="text-xs text-gray-500">{item.date}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="flex-1 truncate pr-2 text-base font-semibold text-white">
                {item.groupName ? (
                  <>
                    {item.groupName} <span className="text-sm text-gray-500">#{item.number}</span>
                  </>
                ) : (
                  '—'
                )}
              </span>
              <span className="whitespace-nowrap text-lg font-bold text-white">
                {item.price} <span className="text-sm font-normal text-gray-500">₽</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </ResponsiveDialog>
  );
}

// --- HISTORY BLOCK ---
function ProfileHistoryBlock({ userId }: { userId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, [userId]);

  const mapped = (items || []).map(tx => ({
    type: tx.type === 'deposit' ? 'buy' : 'sell',
    groupName: tx.meta?.group_name || '',
    number: tx.meta?.number || '',
    price: tx.amount,
    date: tx.created_at?.slice(0, 10) || '',
    id: tx.id,
  }));

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div className="glass-card flex flex-col overflow-hidden transition-all duration-300">
          <Disclosure.Button className="flex items-center justify-between w-full px-5 py-5 hover:bg-white/[0.02] transition">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-[#A259FF]/10 flex items-center justify-center">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A259FF" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </div>
               <span className="text-white font-bold tracking-wide">История операций</span>
            </div>
            <svg className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#6A6D82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Disclosure.Button>
          <Disclosure.Panel>
            <div className="flex flex-col gap-0 px-5 pb-5">
              {loading ? (
                <div className="text-gray-500 text-center py-4 text-sm animate-pulse">Загрузка...</div>
              ) : mapped.length === 0 ? (
                <div className="text-gray-500 text-center py-4 text-sm">Нет операций</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {mapped.slice(0, 3).map((item, idx) => (
                    <div key={item.id || idx} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                       <div className="flex flex-col min-w-0 pr-3">
                          <span className={item.type === 'buy' ? 'text-[#A259FF] text-xs font-semibold uppercase tracking-wider mb-1' : 'text-green-400 text-xs font-semibold uppercase tracking-wider mb-1'}>
                            {item.type === 'buy' ? 'Пополнение' : 'Списание'}
                          </span>
                          <span className="text-white text-sm font-medium truncate">{item.groupName || '—'}{item.number ? ` #${item.number}` : ''}</span>
                       </div>
                       <div className="flex flex-col items-end whitespace-nowrap">
                          <span className="text-white font-bold text-base">{item.price} <span className="text-gray-500 text-xs font-normal">₽</span></span>
                          <span className="text-gray-500 text-[11px] mt-0.5">{item.date}</span>
                       </div>
                    </div>
                  ))}
                  {mapped.length > 3 && (
                    <button className="w-full mt-2 py-2.5 rounded-xl text-sm font-semibold transition glass-btn text-white hover:text-[#A259FF]" onClick={() => setModalOpen(true)}>
                      Посмотреть всё
                    </button>
                  )}
                </div>
              )}
            </div>
            <ProfileHistoryModal open={modalOpen} onClose={() => setModalOpen(false)} items={mapped} />
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

// --- REFERRAL MODAL ---
function ReferralModal({ open, onClose, referralLink }: { open: boolean; onClose: () => void; referralLink: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Пригласить друга"
      sheetBg="#13141C"
      desktopMaxWidthClass="max-w-md"
      footer={
        <button
          type="button"
          className="group relative w-full overflow-hidden rounded-xl py-3.5 text-base font-bold transition btn-glow"
          onClick={() => {
            navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? 'Скопировано!' : 'Скопировать ссылку'}
          <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
        </button>
      }
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center justify-center rounded-3xl bg-white p-4 shadow-[0_0_40px_rgba(162,89,255,0.15)]">
          <QRCode value={referralLink} bgColor="#fff" fgColor="#13141C" size={180} />
        </div>
        <div className="w-full break-all rounded-xl border border-white/10 bg-white/5 p-3 text-center font-mono text-sm text-gray-300">
          {referralLink}
        </div>
      </div>
    </ResponsiveDialog>
  );
}

// --- REFERRAL BLOCK ---
function ReferralBlock({ userId }: { userId: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [stats, setStats] = useState({ count: 0, turnover: 0, earned: 0, lvl: 1, nextLvlTurnover: 100, progress: 0 });
  
  useEffect(() => {
    if (!userId) return;
    supabase.from('referrals').select('*').eq('user_id', userId).then(({ data }) => {
        const count = data?.length || 0;
        const turnover = data?.reduce((sum, r) => sum + Number(r.total_turnover || 0), 0);
        const earned = data?.reduce((sum, r) => sum + Number(r.total_earned_rub || 0), 0);
        const lvl = Math.floor(turnover / 100) + 1;
        const nextLvlTurnover = lvl * 100;
        const progress = Math.min(100, Math.round((turnover / nextLvlTurnover) * 100));
        setStats({ count, turnover, earned, lvl, nextLvlTurnover, progress });
    });
  }, [userId]);
  
  const referralLink = `https://t.me/BazaraVPN_bot?startapp=ref_${userId}`;

  const handleOpenModal = async () => {
    setModalOpen(true);
    try {
      await fetch('/api/referral-hit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name: `ref_${userId}` })
      });
    } catch (e) {}
  };

  return (
    <div className="glass-card p-5 mt-2 overflow-hidden relative group">
      {/* Decorative gradient orb */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A259FF]/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#A259FF]/30 transition-colors duration-500"></div>

      <div className="flex items-center gap-3 mb-5 relative z-10">
         <div className="w-8 h-8 rounded-full bg-[#A259FF]/10 flex items-center justify-center">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A259FF" strokeWidth="2"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
         </div>
         <span className="text-white font-bold tracking-wide text-lg">Реферальная программа</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
         <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Заработано</span>
            <span className="text-[#A259FF] font-black text-2xl">{stats.earned}₽</span>
         </div>
         <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Приглашено</span>
            <span className="text-white font-black text-2xl">{stats.count}</span>
         </div>
      </div>
      
      <div className="mb-5 relative z-10">
         <div className="flex justify-between items-end mb-2">
            <span className="text-white font-bold text-sm">Уровень {stats.lvl}</span>
            <span className="text-gray-400 text-xs">{stats.turnover} / {stats.nextLvlTurnover} ₽</span>
         </div>
         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#A259FF] to-[#7C3AED] rounded-full transition-all duration-1000" style={{ width: `${stats.progress}%` }}></div>
         </div>
      </div>
      
      <button className="w-full py-3.5 rounded-xl btn-glow font-bold text-sm tracking-wide transition relative z-10" onClick={handleOpenModal}>
        Пригласить друга
      </button>

      <ReferralModal open={modalOpen} onClose={() => setModalOpen(false)} referralLink={referralLink} />
    </div>
  );
}

// --- PROFILE PAGE MAIN ---
export default function ProfilePage() {
  const { lang } = useLang();
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
            localStorage.setItem('bazaraUser', JSON.stringify(data));
          } else {
            setSupabaseUser(null);
            setUser(null);
            localStorage.removeItem('bazaraUser');
          }
      });
    }
  }, []);
  
  const effectiveUser = user || supabaseUser;
  
  return (
    <>
      <Header user={effectiveUser} onLogout={() => setUser(null)} />
      <AppMainShell innerClassName="items-center">
        
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
          
          {/* Welcome Text */}
          <div className="mt-2 mb-2 animate-fadeIn">
            <h1 className="text-[26px] md:text-3xl font-extrabold text-white tracking-tight">
              Добро пожаловать, {effectiveUser?.name || 'Друг'} 
              <span className="inline-block ml-2 animate-bounce">👋</span>
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <a href="/tariffs" className="glass-btn flex flex-col items-center justify-center py-4 px-2 gap-2 text-center group">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#A259FF]/20 transition-colors">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A259FF" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </div>
               <span className="text-white text-sm font-semibold tracking-wide">Продлить</span>
             </a>
             <a href="/download" className="glass-btn flex flex-col items-center justify-center py-4 px-2 gap-2 text-center group">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#A259FF]/20 transition-colors">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A259FF" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </div>
               <span className="text-white text-sm font-semibold tracking-wide">Скачать VPN</span>
             </a>
          </div>

          {/* User Blocks */}
          {effectiveUser?.id && (
            <>
              <ReferralBlock userId={effectiveUser.id} />
              <ProfileHistoryBlock userId={effectiveUser.id} />
            </>
          )}

        </div>
      </AppMainShell>
    </>
  );
} 