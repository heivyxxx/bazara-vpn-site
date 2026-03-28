"use client";

import Link from 'next/link';
import { useLang } from '@/lib/LanguageContext';
import { useState } from 'react';
import { getTelegramUser, signInOrUpWithTelegram, upsertUserProfile } from '@/lib/auth';
import { User } from '@/lib/types';
import { PaymentModal } from '@/app/tariffs/PaymentModal';

interface HeaderProps {
  onLogin?: () => void;
  user?: User | null;
  onLogout?: () => void;
}

export const Header = ({ onLogin, user, onLogout }: HeaderProps) => {
  const { lang, setLang } = useLang();
  const [loading, setLoading] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Left: Avatar, Name & ID */}
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-11 h-11 rounded-full object-cover border border-white/10 bg-white/5"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/></svg>
            </div>
          )}
          <div className="flex flex-col justify-center">
            <span className="text-white font-bold text-[15px] leading-tight mb-0.5 tracking-wide">
              {user?.name || user?.username || 'Пользователь'}
            </span>
            <span className="text-gray-500 text-[11px] font-medium tracking-wider uppercase">
              ID: {user?.id || '—'}
            </span>
          </div>
        </div>

        {/* Right: Balance Badge */}
        <div className="flex items-center gap-3">
          <Link href="/deposit" className="flex items-center gap-2 bg-[#1B192A]/60 backdrop-blur-sm border border-[#A259FF]/20 px-3 py-1.5 rounded-full hover:bg-[#1B192A] transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12 22v-6m0-10V2m0 0a6 6 0 100 12 6 6 0 000-12zm-3 8h6" stroke="#A259FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white font-bold text-sm tracking-wide">
              {typeof user?.balance === 'number' ? user.balance.toFixed(2).replace(/\.00$/, '') : '0'}₽
            </span>
          </Link>
        </div>

      </div>
      <PaymentModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} tariff={"month"} price={""} />
    </header>
  );
}; 