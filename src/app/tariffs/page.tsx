"use client";
import React, { useState } from "react";
import { Header } from '@/components/layout/Header';
import { useUser } from '@/lib/LanguageContext';
import { PaymentModal } from './PaymentModal';
import { useRouter } from 'next/navigation';

export default function TariffsPage() {
  const [user, setUser] = useUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<any>(null);

  const handleSelectTariff = (t: any) => {
    if (!user) return; // Wait until user is loaded

    // For custom tariff it says "от 2.3 ₽", we'll just parse digits for now.
    const numericPrice = Number(String(t.price).replace(/[^\d]/g, ''));
    const balance = typeof user.balance === 'number' ? user.balance : 0;
    
    if (balance < numericPrice) {
      router.push('/deposit');
    } else {
      setSelectedTariff(t);
      setIsModalOpen(true);
    }
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
      <main className="min-h-screen pt-[100px] pb-[100px] px-4 flex flex-col items-center">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center">
          
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Тарифы
          </h1>
          <p className="text-[#A2A5B8] text-[13px] leading-relaxed mb-8 text-center">
            Выберите подходящий тариф для безграничного доступа.
          </p>

          <div className="flex flex-col gap-4 w-full">
            {tariffs.map(t => (
              <div key={t.id} className="bg-white/[0.03] hover:bg-white/[0.06] transition-all cursor-pointer p-5 rounded-[1.5rem] relative overflow-hidden group border border-white/5 hover:border-[#fe6125]/30 flex justify-between items-center w-full shadow-lg shadow-black/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#fe6125]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {t.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#fe6125] to-[#ff9e5e] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-2xl z-20 shadow-[0_2px_10px_rgba(254,97,37,0.4)]">
                    Хит продаж
                  </div>
                )}
                <div className="flex flex-col z-10">
                   <span className="text-white font-extrabold text-[17px]">{t.title}</span>
                   <span className="text-[#6A6D82] text-[12px] font-medium mt-1">{t.desc}</span>
                </div>
                <div className="flex flex-col items-end z-10">
                   <span className="text-[#fe6125] font-black text-xl tracking-tight">{t.price}</span>
                   <button onClick={() => handleSelectTariff(t)} className="mt-2 bg-white/5 group-hover:bg-[#fe6125] group-hover:text-white text-[#A2A5B8] text-[11px] font-bold uppercase tracking-wide py-1.5 px-3.5 rounded-xl transition-all shadow-sm">
                     Выбрать
                   </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tariff={selectedTariff?.title || 'month'} 
        price={selectedTariff?.price || '0 ₽'} 
      />
    </>
  );
}