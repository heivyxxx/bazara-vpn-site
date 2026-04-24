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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/60 backdrop-blur-xl border-b border-white/[0.03] pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
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
             <div className="absolute inset-0 bg-gradient-to-tr from-[#fe6125] to-[#ff9e5e] rounded-full blur-[2px] opacity-70"></div>
             {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-[46px] h-[46px] rounded-full object-cover relative z-10 border-[2px] border-[#0A0A0F]"
                />
             ) : (
                <div className="w-[46px] h-[46px] rounded-full bg-[#13141C] relative z-10 border-[2px] border-[#0A0A0F] flex items-center justify-center text-gray-400">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/></svg>
                </div>
             )}
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-white font-extrabold text-[16px] leading-tight mb-0.5 tracking-tight drop-shadow-sm">
              {user?.name || user?.username || 'Пользователь'}
            </span>
            <span className="text-white/50 text-[11px] font-semibold tracking-wider uppercase">
              ID: {user?.id || '—'}
            </span>
          </div>
        </div>

        {/* Right: Balance Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/deposit" className="flex items-center gap-2 bg-gradient-to-r from-[#fe6125]/10 to-transparent border border-[#fe6125]/20 pl-2 pr-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(254,97,37,0.15)] relative overflow-hidden flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-[#fe6125]/20 flex items-center justify-center relative z-10 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fe6125" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9z"/>
                <path d="M16 12a1.2 1.2 0 1 0 0 .01"/>
                <path d="M3 9h14"/>
              </svg>
            </div>
            <span className="text-[#fe6125] font-black text-sm tracking-wide relative z-10 whitespace-nowrap">
              {typeof user?.balance === 'number' ? user.balance.toFixed(2).replace(/\.00$/, '') : '0'}<span className="text-[12px] opacity-80">₽</span>
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