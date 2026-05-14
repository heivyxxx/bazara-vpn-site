"use client";
import React, { useState } from 'react';
import { ResponsiveDialog } from '@/components/modal/ResponsiveDialog';

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDevices: number;
  totalLimit: number;
}

export const DeviceModal: React.FC<DeviceModalProps> = ({ isOpen, onClose, currentDevices, totalLimit }) => {
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  const [addAmount, setAddAmount] = useState<number>(0);
  const pricePerDevice = 119;
  const remaining = totalLimit - currentDevices;

  return (
    <ResponsiveDialog
      open={isOpen}
      onClose={onClose}
      title="Настройка устройств"
      sheetBg="#18181b"
      desktopMaxWidthClass="max-w-[440px]"
    >
      <div className="flex flex-col">
        <div className="mb-3 flex w-full p-1">
          <div className="flex w-full rounded-[14px] border border-white/5 bg-black/40 p-1">
            <button
              type="button"
              className={`flex-1 rounded-xl py-2 text-sm font-bold transition-all ${activeTab === 'add' ? 'bg-[#fe6125] text-white shadow-md' : 'text-[#a2a5b8] hover:text-white'}`}
              onClick={() => setActiveTab('add')}
            >
              Добавить
            </button>
            <button
              type="button"
              className={`flex-1 rounded-xl py-2 text-sm font-bold transition-all ${activeTab === 'remove' ? 'bg-[#a2a5b8]/20 text-white shadow-md' : 'text-[#a2a5b8] hover:text-white'}`}
              onClick={() => setActiveTab('remove')}
            >
              Удалить
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-1">
          {activeTab === 'add' ? (
            <div className="flex animate-fadeInScale flex-col gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-[#fe6125]/20 bg-[#fe6125]/10 px-4 py-2.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fe6125" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <span className="text-xs font-medium text-[#a2a5b8]">
                  Сейчас: <b className="text-white">{currentDevices}</b> на локацию ({totalLimit} всего)
                  <br />
                  Можно добавить ещё <b className="text-white">{remaining}</b>
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-sm font-bold text-white">Быстрый выбор:</span>
                <div className="flex gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setAddAmount(num)}
                      className={`h-10 rounded-xl border px-4 text-sm font-bold transition-all ${addAmount === num ? 'border-[#fe6125] bg-[#fe6125] text-white' : 'border-white/5 bg-white/5 text-white hover:bg-white/10'}`}
                    >
                      +{num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-1 flex flex-col gap-2.5 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Или введите вручную:
                </span>
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-12 flex-1 items-center justify-between overflow-hidden rounded-xl border border-white/10 bg-black/40 px-4 transition-colors focus-within:border-[#fe6125]/50">
                    <span className="text-sm font-medium text-[#6A6D82]">Количество</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={addAmount === 0 ? '' : addAmount}
                      onChange={(e) =>
                        setAddAmount(Math.min(remaining, Math.max(0, parseInt(e.target.value.replace(/\D/g, ''), 10) || 0)))
                      }
                      className="w-12 bg-transparent text-right text-base font-bold text-white outline-none"
                      placeholder="0"
                    />
                  </div>
                  <span className="font-bold text-white">уст.</span>
                </div>
                <span className="mt-1 text-xs text-[#6A6D82]">
                  Стоимость: {pricePerDevice}₽ за устройство на локацию · макс. {remaining}
                </span>
              </div>

              <div className="mb-2 mt-auto flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-[#a2a5b8]">Итого к оплате:</span>
                  <span className="mt-0.5 text-xs font-semibold text-[#6A6D82]">{addAmount} уст.</span>
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white">{addAmount * pricePerDevice} ₽</span>
              </div>

              <button
                type="button"
                className={`w-full rounded-2xl py-3.5 text-[15px] font-bold transition-all ${addAmount > 0 ? 'bg-gradient-to-r from-[#fe6125] to-[#ff9e5e] text-white shadow-lg shadow-[#fe6125]/30' : 'cursor-not-allowed border border-white/5 bg-white/5 text-[#6A6D82]'}`}
                disabled={addAmount === 0}
              >
                + Добавить
              </button>
            </div>
          ) : (
            <div className="animate-fadeInScale flex flex-col gap-4 pb-3">
              <div className="flex flex-col gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                <div className="flex gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span className="text-sm leading-snug text-[#a2a5b8]">
                    Удаление устройств происходит путём обновления ссылки на подписку.
                  </span>
                </div>
                <span className="px-2 text-sm font-bold text-white">Трафик, срок действия и все данные подписки сохраняются.</span>
              </div>

              <div className="mt-2 flex items-start gap-3 rounded-2xl border border-[#fe6125]/20 bg-[#fe6125]/10 p-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fe6125" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" strokeLinecap="round" />
                </svg>
                <span className="text-sm leading-relaxed text-[#a2a5b8]">
                  После обновления необходимо <b className="text-white">вставить новую ссылку подписки заново на нужных устройствах</b> — иначе VPN работать не будет.
                </span>
              </div>

              <button
                type="button"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/5 py-3.5 text-white transition-colors hover:bg-white/10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a2a5b8" strokeWidth="2" className="transition-colors group-hover:text-red-400">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-bold">Удалить устройства</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </ResponsiveDialog>
  );
};
