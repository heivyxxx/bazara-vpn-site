"use client";
import React, { useState } from "react";
import { Header } from '@/components/layout/Header';
import { useUser } from '@/lib/LanguageContext';
import { PaymentModal } from './PaymentModal';
import { useRouter } from 'next/navigation';
import { AppMainShell } from '@/components/AppMainShell';

export default function TariffsPage() {
  const [user, setUser] = useUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<any>(null);

  const handleSelectTariff = (t: any) => {
    if (!user) return; // Wait until user is loaded

    setSelectedTariff(t);
    setIsModalOpen(true);
  };

  const tariffs = [
    { id: '1m', title: '1 месяц', price: '69 ₽', desc: 'Отличный старт', popular: false },
    { id: '3m', title: '3 месяца', price: '190 ₽', desc: 'Выгодно', popular: true },
    { id: '1y', title: '1 год', price: '690 ₽', desc: 'Максимальная экономия', popular: false },
    { id: 'custom', title: 'Свои дни', price: 'от 2.3 ₽', desc: '1 день = 2.3 рубля', popular: false }
  ];

  return (
    <>
      <Header user={user} onLogout={() => setUser(null)} />
      <AppMainShell innerClassName="items-center">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center">
          
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            Тарифы
          </h1>
          <p className="text-zinc-500 text-[13px] leading-relaxed mb-6 text-center">
            Выберите подходящий тариф для безграничного доступа.
          </p>

          <div className="flex flex-col gap-3 w-full">
            {tariffs.map(t => (
              <div key={t.id} className="bazara-panel hover:border-zinc-600/60 transition-colors cursor-pointer p-4 relative flex justify-between items-center w-full gap-3">
                {t.popular && (
                  <div className="absolute top-0 right-0 bg-[#fe6125] text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-bl-lg z-10">
                    Хит
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                   <span className="text-white font-semibold text-[16px]">{t.title}</span>
                   <span className="text-zinc-500 text-[12px] font-medium mt-0.5">{t.desc}</span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                   <span className="text-[#fe6125] font-bold text-lg tracking-tight">{t.price}</span>
                   <button type="button" onClick={() => handleSelectTariff(t)} className="mt-2 bg-zinc-800/80 hover:bg-[#fe6125] text-zinc-300 hover:text-white text-[11px] font-semibold uppercase tracking-wide py-1.5 px-3 rounded-lg transition-colors border border-zinc-700/50 hover:border-[#fe6125]">
                     Выбрать
                   </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </AppMainShell>
      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tariff={selectedTariff?.title || 'month'} 
        price={selectedTariff?.price || '0 ₽'} 
      />
    </>
  );
}