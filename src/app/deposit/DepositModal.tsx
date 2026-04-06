"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/LanguageContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: { id: string; name: string } | null;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, method }) => {
  const [user] = useUser();
  const [closing, setClosing] = useState(false);
  const [amount, setAmount] = useState<string>('1000');
  
  const quickAmounts = [129, 369, 719, 1429];

  useEffect(() => {
    if (isOpen) {
      setAmount('1000');
    }
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  };

  if (!isOpen && !closing) return null;

  const numAmount = parseInt(amount) || 0;
  const isInvalid = numAmount > 0 && (numAmount < 10 || numAmount > 10000);

  const handlePay = () => {
    if (!method || isInvalid || numAmount <= 0) return;
    
    // В будущем здесь будет логика оплаты, пока просто закрываем

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] w-full h-full bg-black/80 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={handleClose} />
      <div 
        className={`relative w-full max-w-[380px] bg-[#18181b] rounded-[24px] flex flex-col p-5 animate-fadeInUp shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 ${closing ? 'animate-slideOutDown' : 'animate-slideInUp'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between mb-5">
          <h2 className="text-white font-extrabold text-[20px]">
            Пополнение - {method?.name}
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-[#A2A5B8] hover:text-white"
            aria-label="Закрыть"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-3">
            <span className="text-[#A2A5B8] text-[13px] font-semibold">Быстрый выбор суммы:</span>
            <div className="flex items-center gap-2">
              {quickAmounts.map(val => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`flex-1 py-2.5 rounded-[12px] text-sm font-bold transition-all border ${
                    parseInt(amount) === val 
                      ? 'bg-white/10 border-white/20 text-white shadow-sm' 
                      : 'bg-white/[0.02] border-white/5 text-[#A2A5B8] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {val}₽
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[20px] p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#A2A5B8]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              <span className="text-[14px] font-semibold">Или введите вручную:</span>
            </div>
            
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-black/20 border border-white/5 focus:border-white/20 transition-colors rounded-[14px] py-3.5 pl-4 pr-12 text-white font-bold text-lg outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A2A5B8] font-bold">
                ₽
              </div>
            </div>
            <span className={`text-[12px] font-medium pl-1 ${isInvalid ? 'text-red-400' : 'text-[#6A6D82]'}`}>
              Минимум 10₽, максимум 10000₽
            </span>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-[20px] p-5 flex flex-col justify-center">
            <span className="text-[#A2A5B8] text-[13px] font-semibold mb-1">Сумма к оплате:</span>
            <div className="flex items-end gap-1.5">
              <span className="text-white text-[32px] font-extrabold leading-none">{numAmount > 0 ? numAmount : 0}</span>
              <span className="text-[#A2A5B8] text-[20px] font-bold mb-0.5">₽</span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={isInvalid || numAmount <= 0}
            className="w-full py-4 rounded-[16px] bg-gradient-to-r from-[#fe6125] to-[#f98055] hover:opacity-90 active:scale-[0.98] text-white font-bold text-[16px] flex justify-center items-center gap-2 shadow-[0_4px_15px_rgba(254,97,37,0.3)] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed mt-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            Пополнить
          </button>
          
        </div>
      </div>
    </div>
  );
};
