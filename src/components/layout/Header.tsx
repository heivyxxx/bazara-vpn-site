"use client";

import Link from 'next/link';
import { useLang } from '@/lib/LanguageContext';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getTelegramUser, signInOrUpWithTelegram, upsertUserProfile } from '@/lib/auth';
import { User } from '@/lib/types';
import { PaymentModal } from '@/app/tariffs/PaymentModal';
import { AdminPinModal } from '@/components/AdminPinModal';

interface HeaderProps {
  onLogin?: () => void;
  user?: User | null;
  onLogout?: () => void;
}

export const Header = ({ onLogin, user, onLogout }: HeaderProps) => {
  const { lang, setLang } = useLang();
  const [loading, setLoading] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#232323] pt-[env(safe-area-inset-top,0px)]">
      <div className="wide-shell w-full max-w-full box-border px-3 py-3 flex items-center justify-between">
        
        {/* Left: Avatar, Name & ID */}
        <div 
         className="flex items-center gap-3 cursor-pointer" 
         onClick={() => {
           if (String(user?.id) === "980466532") {
             setAdminModalOpen(true);
           }
         }}
        >
          <div className="relative">
             {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-[44px] h-[44px] rounded-full object-cover border-2 border-zinc-700/60"
                />
             ) : (
                <div className="w-[44px] h-[44px] rounded-full bg-[#0E0E11] border-2 border-zinc-700/60 flex items-center justify-center text-zinc-500">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/></svg>
                </div>
             )}
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-white font-extrabold text-[16px] leading-tight mb-0.5 tracking-tight drop-shadow-sm">
              {user?.name || user?.username || 'Пользователь'}
            </span>
            <span className="text-zinc-500 text-[11px] font-medium tracking-wide">
              ID: {user?.id || '—'}
            </span>
          </div>
        </div>

        {/* Right: Balance Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/deposit" className="flex items-center gap-2 bg-[#0E0E11] border border-zinc-700/50 pl-2 pr-3 py-1.5 rounded-full flex-shrink-0 hover:border-[#fe6125]/40 transition-colors">
            <span className="w-7 h-7 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/bazara-nav/koshel.svg" alt="" width={24} height={24} className="opacity-90" />
            </span>
            <span className="text-[#fe6125] font-bold text-sm tracking-wide whitespace-nowrap">
              {typeof user?.balance === 'number' ? user.balance.toFixed(2).replace(/\.00$/, '') : '0'}<span className="text-[12px] text-zinc-400 font-semibold ml-0.5">₽</span>
            </span>
          </Link>
        </div>

      </div>
      <PaymentModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} tariff={"month"} price={""} />
      {isMounted
        ? createPortal(
            <AdminPinModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />,
            document.body
          )
        : null}
    </header>
  );
}; 