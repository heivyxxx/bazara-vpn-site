"use client";
import React, { useState, useEffect } from 'react';
import { ResponsiveDialog } from '@/components/modal/ResponsiveDialog';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: { id: string; name: string } | null;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, method }) => {
  const [amount, setAmount] = useState<string>('1000');

  const quickAmounts = [129, 369, 719, 1429];

  useEffect(() => {
    if (isOpen) {
      setAmount('1000');
    }
  }, [isOpen]);

  const numAmount = parseInt(amount, 10) || 0;
  const isInvalid = numAmount > 0 && (numAmount < 10 || numAmount > 10000);

  const handlePay = () => {
    if (!method || isInvalid || numAmount <= 0) return;
    onClose();
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      onClose={onClose}
      title={`Пополнение — ${method?.name ?? ''}`}
      sheetBg="#18181b"
      desktopMaxWidthClass="max-w-md"
      footer={
        <button
          type="button"
          onClick={handlePay}
          disabled={isInvalid || numAmount <= 0}
          className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#fe6125] to-[#f98055] py-4 text-[16px] font-bold text-white shadow-[0_4px_15px_rgba(254,97,37,0.3)] transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          Пополнить
        </button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-semibold text-[#A2A5B8]">Быстрый выбор суммы:</span>
          <div className="flex items-center gap-2">
            {quickAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val.toString())}
                className={`flex-1 rounded-[12px] border py-2.5 text-sm font-bold transition-all ${
                  parseInt(amount, 10) === val
                    ? 'border-white/20 bg-white/10 text-white shadow-sm'
                    : 'border-white/5 bg-white/[0.02] text-[#A2A5B8] hover:bg-white/5 hover:text-white'
                }`}
              >
                {val}₽
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[20px] border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-[#A2A5B8]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span className="text-[14px] font-semibold">Или введите вручную:</span>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-[14px] border border-white/5 bg-black/20 py-3.5 pl-4 pr-12 text-lg font-bold text-white outline-none transition-colors focus:border-white/20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[#A2A5B8]">₽</div>
          </div>
          <span className={`pl-1 text-[12px] font-medium ${isInvalid ? 'text-red-400' : 'text-[#6A6D82]'}`}>
            Минимум 10₽, максимум 10000₽
          </span>
        </div>

        <div className="flex flex-col justify-center rounded-[20px] border border-white/5 bg-white/[0.03] p-5">
          <span className="mb-1 text-[13px] font-semibold text-[#A2A5B8]">Сумма к оплате:</span>
          <div className="flex items-end gap-1.5">
            <span className="text-[32px] font-extrabold leading-none text-white">{numAmount > 0 ? numAmount : 0}</span>
            <span className="mb-0.5 text-[20px] font-bold text-[#A2A5B8]">₽</span>
          </div>
        </div>
      </div>
    </ResponsiveDialog>
  );
};
