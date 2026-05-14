"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from '@/components/layout/Header';
import { useUser } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { HowToConnectModal } from '@/components/HowToConnectModal';
import { DeviceModal } from '@/components/DeviceModal';
import { PaymentModal } from '@/app/tariffs/PaymentModal';
import { AppMainShell } from '@/components/AppMainShell';

export default function HomePage() {
  const [user, setUser] = useUser();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [autoRenewUpdating, setAutoRenewUpdating] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

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
      supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', String(tgUser.id))
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data }) => {
          setSubscription(data || null);
        });
    }
  }, []);
  
  const effectiveUser = user || supabaseUser;
  const expiresAt = subscription?.expires_at ? new Date(subscription.expires_at) : null;
  const now = new Date();
  const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const formattedExpiresAt = expiresAt
    ? expiresAt.toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Не активна';
  const trafficText =
    subscription?.traffic_total_gb == null
      ? 'Без ограничений'
      : `${Number(subscription.traffic_used_gb || 0).toFixed(1)} / ${Number(subscription.traffic_total_gb).toFixed(1)} ГБ`;
  const devicesPerLocation = Number(subscription?.device_limit ?? 2);
  const totalDevices = Number(subscription?.total_device_limit ?? devicesPerLocation * 32);
  const isAutoRenewEnabled = Boolean(subscription?.auto_renew);

  const handleToggleAutoRenew = async () => {
    if (!effectiveUser?.id || !subscription?.id || autoRenewUpdating) return;
    const next = !isAutoRenewEnabled;
    setAutoRenewUpdating(true);
    setSubscription((prev: any) => prev ? { ...prev, auto_renew: next } : prev);
    try {
      const res = await fetch('/api/subscription/auto-renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: effectiveUser.id,
          enabled: next,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setSubscription((prev: any) => prev ? { ...prev, auto_renew: !next } : prev);
      }
    } catch {
      setSubscription((prev: any) => prev ? { ...prev, auto_renew: !next } : prev);
    } finally {
      setAutoRenewUpdating(false);
    }
  };

  return (
    <>
      <Header user={effectiveUser} onLogout={() => setUser(null)} />
      <AppMainShell innerClassName="items-stretch">
        <div className="w-full flex flex-col gap-5">
          
          <div className="mt-1 text-center md:text-left">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Добро пожаловать, {effectiveUser?.name || 'Друг'}
            </h1>
          </div>

          <div className="flex flex-col gap-5 items-stretch w-full">
            
            <div className="bazara-panel flex flex-col overflow-hidden">
              <div className="px-5 py-5">
                <div className="flex items-center gap-3 mb-5">
                   <div className="w-8 h-8 rounded-full bg-[#fe6125]/15 border border-[#fe6125]/30 flex items-center justify-center">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="#fe6125"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                   </div>
                   <span className="text-white font-bold text-lg tracking-tight">Активная подписка</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="flex items-center gap-2 text-zinc-400 text-[13px] font-medium"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/></svg> Действительна до</span>
                    <span className="text-white font-semibold text-[13px] text-right">{formattedExpiresAt}</span>
                  </div>
                  <div className="flex justify-between items-center bg-zinc-900/30 -mx-1 px-3 py-2 rounded-lg gap-2">
                    <span className="flex items-center gap-2 text-zinc-400 font-medium text-[13px]"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2V11h2v5.5zm0-7.5h-2V7h2v2z"/></svg> Дней осталось</span>
                    <span className="text-[#fe6125] font-bold text-[13px]">{daysLeft} {daysLeft === 1 ? 'день' : 'дней'}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="flex items-center gap-2 text-zinc-400 font-medium text-[13px]"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/><path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg> Трафик всего</span>
                    <span className="text-white font-semibold text-[13px] flex items-center gap-1">
                      {subscription?.traffic_total_gb == null && <span className="text-base text-[#fe6125]">∞</span>}
                      {trafficText}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="flex items-center gap-2 text-zinc-400 font-medium text-[13px]"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg> Устройств</span>
                    <span className="text-white font-semibold text-[13px]">{totalDevices} <span className="text-zinc-500 font-medium text-[11px]">({devicesPerLocation} на локацию)</span></span>
                  </div>
                  <div className="flex justify-between items-center mt-1 gap-2">
                    <span className="flex items-center gap-2 text-zinc-400 font-medium text-[13px]"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg> Автопродление</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-zinc-500 font-semibold text-[12px] uppercase">{isAutoRenewEnabled ? 'Вкл' : 'Выкл'}</span>
                      <div
                        onClick={handleToggleAutoRenew}
                        className={`w-10 h-[22px] transition-colors rounded-full p-[3px] flex items-center relative border border-zinc-700/60 ${subscription?.id ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} ${autoRenewUpdating ? 'opacity-70' : ''} bg-zinc-900/50`}
                      >
                        <div className={`w-[14px] h-[14px] rounded-full absolute left-[3px] transition-transform ${isAutoRenewEnabled ? 'bg-[#fe6125] translate-x-[18px]' : 'bg-zinc-500'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              
              <div className="bazara-panel p-4 flex flex-col gap-3 w-full">
                <span className="text-white font-semibold text-sm ml-0.5">Настройки подключения</span>
                
                <div onClick={() => setIsConnectModalOpen(true)} className="bg-zinc-900/25 hover:bg-zinc-900/45 transition-colors px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer border border-zinc-800/50 hover:border-zinc-600/60 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0E0E11] flex items-center justify-center border border-zinc-700/50 group-hover:border-[#fe6125]/35">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fe6125" strokeWidth="2.2"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-semibold text-[14px]">Как подключиться?</span>
                      <span className="text-zinc-500 text-[11px] mt-0.5">Ссылки, QR-код и приложения</span>
                    </div>
                  </div>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-zinc-500 group-hover:text-zinc-400 shrink-0"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                
                <div onClick={() => setIsRenewModalOpen(true)} className="bg-zinc-900/25 hover:bg-zinc-900/45 transition-colors px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer border border-zinc-800/50 hover:border-zinc-600/60 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0E0E11] flex items-center justify-center border border-zinc-700/50">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-zinc-300"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-semibold text-[14px]">Продлить</span>
                      <span className="text-zinc-500 text-[11px] mt-0.5">Добавить дни к подписке</span>
                    </div>
                  </div>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-zinc-500 shrink-0"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>

                <div onClick={() => setIsDeviceModalOpen(true)} className="bg-zinc-900/25 hover:bg-zinc-900/45 transition-colors px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer border border-zinc-800/50 hover:border-zinc-600/60 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0E0E11] flex items-center justify-center border border-zinc-700/50">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-zinc-300"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-semibold text-[14px]">Устройства</span>
                      <span className="text-zinc-500 text-[11px] mt-0.5">Добавить или удалить</span>
                    </div>
                  </div>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-zinc-500 shrink-0"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>

              </div>

              <Link href="/referrals" className="bazara-panel p-4 flex items-center justify-between hover:border-zinc-600/60 transition-colors group">
                 <div className="flex items-center gap-3 min-w-0 flex-1">
                   <div className="w-10 h-10 rounded-lg bg-[#fe6125]/10 border border-[#fe6125]/20 flex items-center justify-center text-[#fe6125] shrink-0">
                     <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   </div>
                   <div className="flex flex-col min-w-0">
                     <span className="text-white font-semibold text-[14px] truncate">Реферальная программа</span>
                     <span className="text-zinc-500 text-[11px] mt-0.5 truncate">Приглашай друзей и получай бонусы</span>
                   </div>
                 </div>
                 <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fe6125" strokeWidth="2" className="shrink-0 text-zinc-500 group-hover:text-[#fe6125]"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>

            </div>
          </div>



        </div>
      </AppMainShell>
      
      <HowToConnectModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} primaryLink={`https://t.me/VPNEnvyBot?start=sub${effectiveUser?.id}`} reserveLink={`https://ru-vpn.envy.com:228/sub/${effectiveUser?.id}`} />
      <DeviceModal isOpen={isDeviceModalOpen} onClose={() => setIsDeviceModalOpen(false)} currentDevices={devicesPerLocation} totalLimit={totalDevices} />
      <PaymentModal isOpen={isRenewModalOpen} onClose={() => setIsRenewModalOpen(false)} tariff="Продление" price="0 ₽" />
    </>
  );
}