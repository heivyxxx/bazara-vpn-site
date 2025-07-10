"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Header } from '@/components/layout/Header';
import { LanguageProvider, useLang } from '@/lib/LanguageContext';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@/lib/LanguageContext';
import QRCode from 'react-qr-code';
import { Disclosure } from '@headlessui/react';

function ProfileHistoryModal({ open, onClose, items }: { open: boolean, onClose: () => void, items: any[] }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
      <div className="bg-[#18181b] rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto relative">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 sticky top-0 z-10 bg-[#18181b] rounded-t-2xl">
          <span className="text-white font-bold text-lg">Вся история</span>
          <button className="text-zinc-400 text-2xl p-1 rounded-full ml-2" onClick={onClose} aria-label="Закрыть">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="flex flex-col gap-2 p-6 pt-2">
          {items.length === 0 && <div className="text-gray-400 text-center py-4">Нет операций</div>}
          {items.map((item, idx) => (
            <div key={item.id || idx} className="flex items-center gap-4 py-4 border-b border-[#23232b] last:border-0 bg-[#18181b] rounded-2xl px-4">
              <span className={item.type === 'buy' ? 'text-[#fd6a32] font-bold text-lg' : 'text-green-400 font-bold text-lg'}>{item.type === 'buy' ? 'Пополнение' : 'Списание'}</span>
              <span className="flex items-center gap-1 text-white font-bold text-lg">{item.price} <span className="text-gray-400 text-base font-normal">RUB</span></span>
              <span className="text-zinc-500 text-base ml-auto whitespace-nowrap">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileHistoryBlock({ userId }: { userId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
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

  // Маппинг с поддержкой groupName/number (как в Eclipse)
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
        <div className="bg-[#18181b] rounded-2xl p-0 shadow-sm flex flex-col gap-1 w-full">
          <Disclosure.Button className="flex items-center justify-between w-full px-6 py-4">
            <span className="text-white font-semibold text-base">История</span>
            <svg className={`transition-transform ${open ? 'rotate-180' : ''}`} width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#fd6a32" strokeWidth="2" strokeLinecap="round"/></svg>
          </Disclosure.Button>
          <Disclosure.Panel>
            <div className="flex flex-col gap-1 mt-1 px-4 pb-4">
              {loading ? (
                <div className="text-gray-400 text-center py-4">Загрузка...</div>
              ) : mapped.length === 0 ? (
                <div className="text-gray-400 text-center py-4">Нет операций</div>
              ) : (
                mapped.slice(0, 5).map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center gap-4 py-3 border-b border-[#23232b] last:border-0 bg-[#18181b] rounded-xl px-2">
                    <span className={item.type === 'buy' ? 'text-[#fd6a32] font-bold text-base' : 'text-green-400 font-bold text-base'}>{item.type === 'buy' ? 'Пополнение' : 'Списание'}</span>
                    <span className="text-white font-bold text-base flex-1 truncate">{item.groupName && (<span>{item.groupName} <span className="text-zinc-400">#{item.number}</span></span>)} </span>
                    <span className="flex items-center gap-1 text-white font-bold text-base">{item.price} <span className="text-gray-400 text-sm font-normal">RUB</span></span>
                    <span className="text-zinc-500 text-xs ml-2 whitespace-nowrap">{item.date}</span>
                  </div>
                ))
              )}
            </div>
            {mapped.length > 5 && (
              <button className="w-full mt-2 py-2 rounded-xl font-semibold text-sm transition bg-[#23232b] border border-[#23232b] text-[#fd6a32] hover:bg-[#23232b]/80" onClick={() => setModalOpen(true)}>
                Посмотреть всё
              </button>
            )}
            <ProfileHistoryModal open={modalOpen} onClose={() => setModalOpen(false)} items={mapped} />
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

function ReferralModal({ open, onClose, referralLink }: { open: boolean, onClose: () => void, referralLink: string }) {
  const [copied, setCopied] = useState(false);
  const [closing, setClosing] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  };
  if (!open && !closing) return null;
  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-end justify-center sm:items-center">
      <div
        className={`bg-[#18181b] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg relative flex flex-col animate-fadeInUp ${closing ? 'animate-slideOutDown' : 'animate-slideInUp'} min-h-[30vh] max-h-[65vh] overflow-y-auto`}
        style={{ minWidth: 0 }}
      >
        <div className="flex flex-row items-center justify-between px-6 pt-6 pb-2 sticky top-0 z-10 bg-[#18181b] rounded-t-3xl">
          <span className="text-white font-bold text-lg w-full text-center">Пригласить друга</span>
          <button
            onClick={handleClose}
            className="text-zinc-400 text-2xl p-1 rounded-full ml-2 absolute right-6 top-6"
            aria-label="Закрыть"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="flex flex-col items-center px-6 pb-6 pt-2 gap-6">
          <div className="bg-white rounded-2xl p-4 flex items-center justify-center mb-2 mt-2">
            <QRCode value={referralLink} bgColor="#fff" fgColor="#18181b" size={160} />
          </div>
          <div className="w-full text-center text-gray-300 text-base break-all select-all mb-2">{referralLink}</div>
        </div>
        <div className="sticky bottom-0 left-0 w-full flex justify-center gap-4 px-6 pb-6 pt-2 bg-[#18181b] rounded-b-3xl z-20 mt-auto">
          <button
            className="flex-1 py-3 rounded-xl bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-semibold text-base transition"
            onClick={handleCopy}
          >
            {copied ? 'Скопировано!' : 'Скопировать ссылку'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReferralBlock({ userId }: { userId: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [stats, setStats] = useState({ count: 0, turnover: 0, earned: 0, lvl: 1, nextLvlTurnover: 100, progress: 0 });
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    (async () => {
      const { data: refs } = await supabase
        .from('referrals')
        .select('*')
        .eq('user_id', userId);
      const count = refs?.length || 0;
      const turnover = refs?.reduce((sum, r) => sum + Number(r.total_turnover || 0), 0);
      const earned = refs?.reduce((sum, r) => sum + Number(r.total_earned_rub || 0), 0);
      const lvl = Math.floor(turnover / 100) + 1;
      const nextLvlTurnover = lvl * 100;
      const progress = Math.min(100, Math.round((turnover / nextLvlTurnover) * 100));
      setStats({ count, turnover, earned, lvl, nextLvlTurnover, progress });
    })();
  }, [userId]);
  const referralLink = `https://t.me/BazaraVPN_bot?startapp=ref_${userId}`;
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div className="bg-[#18181b] rounded-2xl p-0 shadow-sm flex flex-col gap-1 w-full mt-2">
          <Disclosure.Button className="flex items-center justify-between w-full px-6 py-4">
            <span className="text-white font-semibold text-base">Реферальная программа</span>
            <svg className={`transition-transform ${open ? 'rotate-180' : ''}`} width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#fd6a32" strokeWidth="2" strokeLinecap="round"/></svg>
          </Disclosure.Button>
          <Disclosure.Panel>
            <div className="flex flex-col items-center gap-4 w-full pt-2 pb-1 px-4">
              <div className="text-gray-400 text-center mb-2">Приглашайте друзей — зарабатывайте RUB и очки сезона</div>
              <div className="flex flex-row gap-4 justify-center mb-2 w-full">
                <div className="flex-1 bg-[#23232b] rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
                  <div className="text-white font-bold text-lg mb-1">RUB</div>
                  <div className="text-gray-300 text-base mb-1">Зарабатывай</div>
                  <div className="text-[#fd6a32] text-2xl font-extrabold mb-1">2%</div>
                  <div className="text-gray-400 text-xs text-center">от всех продаж твоих рефералов</div>
                </div>
                <div className="flex-1 bg-[#23232b] rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
                  <div className="text-white font-bold text-lg mb-1">Очки сезона</div>
                  <div className="text-gray-300 text-base mb-1">Зарабатывай</div>
                  <div className="text-yellow-400 text-2xl font-extrabold mb-1">10%</div>
                  <div className="text-gray-400 text-xs text-center">от всех продаж твоих рефералов</div>
                </div>
              </div>
              <div className="text-gray-400 text-sm mb-1">Твой прогресс</div>
              <div className="relative w-full max-w-xs h-10 bg-[#23232b] rounded-full overflow-hidden flex items-center">
                <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#fd6a32] via-[#fd6a32] to-[#FFD700] transition-all duration-700" style={{ width: `${stats.progress}%` }}></div>
                <div className="relative z-10 w-full flex flex-row justify-between items-center px-4 text-white font-bold text-base">
                  <span>LVL {stats.lvl}</span>
                  <span>{stats.turnover} / {stats.nextLvlTurnover} RUB оборота</span>
                </div>
              </div>
              <div className="w-full max-w-xs mx-auto flex flex-row justify-between mb-2 px-2">
                <span className="text-gray-400 text-base">Рефералов: <span className="text-white font-bold">{stats.count}</span></span>
                <span className="text-gray-400 text-base">Заработок: <span className="text-white font-bold">{stats.earned} RUB</span></span>
              </div>
              <button className="w-full mt-2 py-2 rounded-xl font-semibold text-sm transition bg-[#23232b] border border-[#23232b] text-[#fd6a32] hover:bg-[#23232b]/80" onClick={() => setModalOpen(true)}>
                Пригласить друга
              </button>
              <ReferralModal open={modalOpen} onClose={() => setModalOpen(false)} referralLink={referralLink} />
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

export default function ProfilePage() {
  const { lang } = useLang();
  const [user, setUser] = useUser();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [supabaseUserLoading, setSupabaseUserLoading] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser && tgUser.id) {
      setSupabaseUserLoading(true);
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
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
  const [refOpen, setRefOpen] = useState(true);
  return (
    <>
      <Header user={effectiveUser} onLogout={() => setUser(null)} />
      <main className="min-h-screen bg-black flex flex-col items-center pt-[calc(var(--tg-viewport-safe-area-inset-top)+0px)] pb-[calc(var(--tg-viewport-safe-area-inset-bottom)+56px)]">
        {/* Профиль */}
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 mb-6">
          <Image src={effectiveUser?.avatar || "/assets/avatar1.png"} alt="avatar" width={96} height={96} className="rounded-2xl w-24 h-24 object-cover border-4 border-[#232323]" />
          <div className="text-2xl font-bold text-white">{effectiveUser?.name || effectiveUser?.username || '—'}</div>
          <div className="text-lg font-semibold text-[#fd6a32] flex items-center gap-2">
            {typeof effectiveUser?.balance === 'number' ? effectiveUser.balance.toFixed(2) : '—'} <span className="text-gray-400 text-base font-normal">RUB</span>
          </div>
          {effectiveUser?.id && (
            <a
              href="/deposit"
              className="mt-1 px-5 py-2 rounded-xl bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-semibold text-sm transition shadow-md border border-[#fd6a32]"
              style={{minWidth: 120, textAlign: 'center'}}
            >
              Пополнить
            </a>
          )}
        </div>
        {/* История и рефералы */}
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 mb-6">
          {effectiveUser?.id && <ProfileHistoryBlock userId={effectiveUser.id} />}
          {effectiveUser?.id && <ReferralBlock userId={effectiveUser.id} />}
        </div>
      </main>
    </>
  );
} 