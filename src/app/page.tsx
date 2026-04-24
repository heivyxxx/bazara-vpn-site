"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from '@/components/layout/Header';
import { useUser } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { HowToConnectModal } from '@/components/HowToConnectModal';
import { DeviceModal } from '@/components/DeviceModal';
import { PaymentModal } from '@/app/tariffs/PaymentModal';

export default function HomePage() {
  const [user, setUser] = useUser();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
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

  return (
    <>
      <Header user={effectiveUser} onLogout={() => setUser(null)} />
      <main className="min-h-screen pt-[calc(env(safe-area-inset-top,0px)+88px)] pb-[calc(env(safe-area-inset-bottom,0px)+100px)] px-4 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          
          <div className="mt-2 text-center md:text-left">
            <h1 className="text-[22px] font-extrabold text-white tracking-tight drop-shadow-md">
              Добро пожаловать, {effectiveUser?.name || 'Друг'}
            </h1>
          </div>

          <div className="flex flex-col gap-6 items-stretch w-full">
            
            {/* LEFT COLUMN: Subscription Info */}
            <div className="glass-card flex flex-col overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fe6125]/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="px-5 py-5 relative z-10 h-full">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#fe6125] to-[#ff9e5e] flex items-center justify-center shadow-[0_4px_15px_rgba(254,97,37,0.4)]">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                   </div>
                   <span className="text-white font-extrabold text-[19px] tracking-wide drop-shadow-sm">Активная подписка</span>
                </div>
                
                <div className="flex flex-col gap-3.5">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-[#6A6D82] font-semibold text-[13px]"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/></svg> Действительна до</span>
                    <span className="text-white font-bold text-[13px]">{formattedExpiresAt}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/[0.03] -mx-2 px-2 py-1.5 rounded-lg">
                    <span className="flex items-center gap-2 text-[#6A6D82] font-semibold text-[13px]"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2V11h2v5.5zm0-7.5h-2V7h2v2z"/></svg> Дней осталось</span>
                    <span className="text-[#fe6125] font-black text-[13px]">{daysLeft} {daysLeft === 1 ? 'день' : 'дней'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-[#6A6D82] font-semibold text-[13px]"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/><path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg> Трафик всего</span>
                    <span className="text-white font-bold text-[13px] flex items-center gap-1">
                      {subscription?.traffic_total_gb == null && <span className="text-base text-[#fe6125]">∞</span>}
                      {trafficText}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-[#6A6D82] font-semibold text-[13px]"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg> Устройств</span>
                    <span className="text-white font-bold text-[13px]">{totalDevices} <span className="text-[#6A6D82] font-semibold text-[11px]">({devicesPerLocation} на локацию)</span></span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="flex items-center gap-2 text-[#6A6D82] font-semibold text-[13px]"><svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg> Автопродление</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#6A6D82] font-bold text-[12px] uppercase">{isAutoRenewEnabled ? 'Вкл' : 'Выкл'}</span>
                      <div className="w-10 h-[22px] bg-white/[0.08] hover:bg-white/[0.12] transition-colors rounded-full p-[3px] cursor-pointer flex items-center relative border border-white/5 shadow-inner">
                        <div className={`w-[14px] h-[14px] rounded-full absolute left-[3px] shadow-sm transition-transform ${isAutoRenewEnabled ? 'bg-[#fe6125] translate-x-[18px]' : 'bg-[#6A6D82]'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: How to connect & Additions */}
            <div className="flex flex-col gap-4">
              
              <div className="glass-card p-4 flex flex-col gap-3 relative z-10 w-full h-fit">
                <span className="text-white font-bold text-sm ml-1 mb-1">Настройки подключения</span>
                
                <div onClick={() => setIsConnectModalOpen(true)} className="bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 px-4 py-3.5 rounded-xl flex items-center justify-between cursor-pointer border border-transparent hover:border-white/10 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.06] to-transparent flex items-center justify-center border border-white/5 group-hover:border-[#fe6125]/30 transition-colors">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fe6125" strokeWidth="2.5"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-extrabold text-[14px]">Как подключиться?</span>
                      <span className="text-[#6A6D82] font-medium text-[11px] mt-0.5">Ссылки, QR-код и приложения</span>
                    </div>
                  </div>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                
                <div onClick={() => setIsRenewModalOpen(true)} className="bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 px-4 py-3.5 rounded-xl flex items-center justify-between cursor-pointer border border-transparent hover:border-white/10 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.06] to-transparent flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-extrabold text-[14px]">Продлить</span>
                      <span className="text-[#6A6D82] font-medium text-[11px] mt-0.5">Добавить дни к подписке</span>
                    </div>
                  </div>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>

                <div onClick={() => setIsDeviceModalOpen(true)} className="bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 px-4 py-3.5 rounded-xl flex items-center justify-between cursor-pointer border border-transparent hover:border-white/10 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.06] to-transparent flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-extrabold text-[14px]">Устройства</span>
                      <span className="text-[#6A6D82] font-medium text-[11px] mt-0.5">Добавить или удалить</span>
                    </div>
                  </div>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6A6D82" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>

              </div>

              {/* Added extra helpful card for right column balancing */}
              <Link href="/referrals" className="bg-gradient-to-r from-white/[0.04] to-transparent border border-white/5 rounded-[1.5rem] p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.06] transition-colors relative overflow-hidden group block w-full">
                 <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#fe6125]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="flex items-center gap-4 relative z-10 w-full overflow-hidden">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#fe6125] flex-shrink-0">
                     <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   </div>
                   <div className="flex flex-col min-w-0">
                     <span className="text-white font-extrabold text-[14px] truncate">Реферальная программа</span>
                     <span className="text-[#6A6D82] font-medium text-[11px] mt-0.5 truncate">Приглашай друзей и получай бонусы</span>
                   </div>
                 </div>
                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fe6125" strokeWidth="2" className="relative z-10 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>

            </div>
          </div>



        </div>
      </main>
      
      <HowToConnectModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} primaryLink={`https://t.me/VPNEnvyBot?start=sub${effectiveUser?.id}`} reserveLink={`https://ru-vpn.envy.com:228/sub/${effectiveUser?.id}`} />
      <DeviceModal isOpen={isDeviceModalOpen} onClose={() => setIsDeviceModalOpen(false)} currentDevices={devicesPerLocation} totalLimit={totalDevices} />
      <PaymentModal isOpen={isRenewModalOpen} onClose={() => setIsRenewModalOpen(false)} tariff="Продление" price="0 ₽" />
    </>
  );
}