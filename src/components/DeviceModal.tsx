"use client";
import React, { useState } from 'react';

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDevices: number;
  totalLimit: number;
}

export const DeviceModal: React.FC<DeviceModalProps> = ({ isOpen, onClose, currentDevices, totalLimit }) => {
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  const [addAmount, setAddAmount] = useState<number>(0);
  const pricePerDevice = 119; // 119 RUB per device 
  const remaining = totalLimit - currentDevices;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] w-full h-full bg-black/80 flex flex-col justify-end sm:items-center sm:justify-center">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-[360px] bg-[#18181b] rounded-t-[28px] sm:rounded-3xl flex flex-col animate-page-in shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 max-h-[90vh] overflow-hidden">
        
        {/* Header with Close */}
        <div className="flex flex-row items-center justify-between px-5 pt-5 pb-3 bg-[#18181b] relative z-20 shadow-sm border-b border-white/5">
          <h2 className="text-white font-extrabold text-[18px]">Настройка устройств</h2>
          <button onClick={onClose} className="text-[#6A6D82] hover:text-white bg-white/5 hover:bg-white/10 transition-colors w-8 h-8 rounded-full flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Custom Tab Switcher */}
        <div className="px-5 pt-4 pb-2">
           <div className="flex p-1 bg-black/40 border border-white/5 rounded-[14px] w-full">
             <button
               className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'add' ? 'bg-[#fe6125] text-white shadow-md' : 'text-[#a2a5b8] hover:text-white'}`}
               onClick={() => setActiveTab('add')}
             >
               Добавить
             </button>
             <button
               className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'remove' ? 'bg-[#a2a5b8]/20 text-white shadow-md' : 'text-[#a2a5b8] hover:text-white'}`}
               onClick={() => setActiveTab('remove')}
             >
               Удалить
             </button>
           </div>
        </div>

        <div className="flex flex-col px-5 py-3 overflow-y-auto">
          {activeTab === 'add' ? (
            <div className="flex flex-col gap-4 animate-page-in h-full">
              
              <div className="bg-[#fe6125]/10 border border-[#fe6125]/20 rounded-xl py-2.5 px-4 flex items-center gap-3">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fe6125" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                 <span className="text-[#a2a5b8] text-xs font-medium">Сейчас: <b className="text-white">{currentDevices}</b> на локацию ({totalLimit} всего)<br/>Можно добавить ещё <b className="text-white">{remaining}</b></span>
              </div>

              <div className="flex flex-col gap-2.5">
                 <span className="text-white font-bold text-sm">Быстрый выбор:</span>
                 <div className="flex gap-2">
                   {[1, 2, 3].map(num => (
                      <button key={num} onClick={() => setAddAmount(num)} className={`h-10 px-4 rounded-xl text-sm font-bold transition-all border ${addAmount === num ? 'bg-[#fe6125] text-white border-[#fe6125]' : 'bg-white/5 border-white/5 text-white hover:bg-white/10'}`}>
                        +{num}
                      </button>
                   ))}
                 </div>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col gap-2.5 mt-1">
                 <span className="text-white font-bold text-sm flex items-center gap-2">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Или введите вручную:
                 </span>
                 <div className="flex items-center gap-3 w-full">
                   <div className="flex-1 bg-black/40 border border-white/10 rounded-xl h-12 flex items-center justify-between px-4 overflow-hidden focus-within:border-[#fe6125]/50 transition-colors">
                     <span className="text-[#6A6D82] text-sm font-medium">Количество</span>
                     <div className="flex items-center">
                       <input 
                         type="text"
                         inputMode="numeric"
                         pattern="[0-9]*"
                         value={addAmount === 0 ? '' : addAmount} 
                         onChange={(e) => setAddAmount(Math.min(remaining, Math.max(0, parseInt(e.target.value.replace(/\D/g, '')) || 0)))}
                         className="bg-transparent text-white text-right font-bold w-12 outline-none"
                         placeholder="0"
                       />
                     </div>
                   </div>
                   <span className="text-white font-bold">уст.</span>
                 </div>
                 <span className="text-[#6A6D82] text-xs mt-1">Стоимость: {pricePerDevice}₽ за устройство на локацию · макс. {remaining}</span>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-between mt-auto mb-2">
                 <div className="flex flex-col">
                   <span className="text-[#a2a5b8] text-sm">Итого к оплате:</span>
                   <span className="text-[#6A6D82] font-semibold text-xs mt-0.5">{addAmount} уст.</span>
                 </div>
                 <span className="text-white font-extrabold text-2xl tracking-tight">{addAmount * pricePerDevice} ₽</span>
              </div>

              <button 
                className={`py-3.5 w-full rounded-2xl font-bold text-[15px] transition-all ${addAmount > 0 ? 'bg-gradient-to-r from-[#fe6125] to-[#ff9e5e] text-white shadow-lg shadow-[#fe6125]/30' : 'bg-white/5 text-[#6A6D82] cursor-not-allowed border border-white/5'}`}
                disabled={addAmount === 0}
              >
                + Добавить
              </button>

            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-page-in h-full pb-3">
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col gap-3">
                 <div className="flex gap-3">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                   <span className="text-[#a2a5b8] text-sm leading-snug">Удаление устройств происходит путём обновления ссылки на подписку.</span>
                 </div>
                 <span className="text-white font-bold text-sm px-8">Трафик, срок действия и все данные подписки сохраняются.</span>
              </div>

              <div className="bg-[#fe6125]/10 border border-[#fe6125]/20 rounded-2xl p-4 flex items-start gap-3 mt-2">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fe6125" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" strokeLinecap="round"/></svg>
                 <span className="text-[#a2a5b8] text-sm leading-relaxed">
                   После обновления необходимо <b className="text-white">вставить новую ссылку подписки заново на нужных устройствах</b> - иначе VPN работать не будет.
                 </span>
              </div>

              <button className="mt-6 py-3.5 w-full rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors flex items-center justify-center gap-2 group text-white">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a2a5b8" strokeWidth="2" className="group-hover:text-red-400 transition-colors"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                 <span className="font-bold">Удалить устройства</span>
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
