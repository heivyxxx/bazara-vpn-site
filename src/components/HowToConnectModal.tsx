"use client";
import React from 'react';

interface HowToConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryLink?: string;
  reserveLink?: string;
}

export const HowToConnectModal: React.FC<HowToConnectModalProps> = ({ isOpen, onClose, primaryLink = 'https://vpn.bazara.app/sub/primary-placeholder', reserveLink = 'https://vpn.bazara.app/sub/reserve-placeholder' }) => {
  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-[9999] w-full h-full bg-black/80 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#18181b] rounded-3xl flex flex-col animate-page-in shadow-2xl border border-white/5 max-h-[90vh] flex-shrink-0">
        
        {/* Header */}
        <div className="flex flex-row items-center justify-between px-6 pt-6 pb-4 sticky top-0 z-10 bg-[#18181b] rounded-t-3xl border-b border-white/5">
          <h2 className="text-white font-extrabold text-xl">Как подключиться?</h2>
          <button
            onClick={onClose}
            className="text-[#6A6D82] hover:text-white bg-white/5 hover:bg-white/10 transition-colors w-8 h-8 rounded-full flex items-center justify-center transform hover:scale-105 active:scale-95"
            aria-label="Закрыть"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col px-6 py-6 gap-8 overflow-y-auto">
          
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#fe6125]/10 text-[#fe6125] flex items-center justify-center font-bold text-sm flex-shrink-0 border border-[#fe6125]/20">1</div>
            <div className="flex flex-col w-full gap-3 mt-1">
              <span className="text-white font-bold text-base">Скачайте приложение</span>
              <div className="grid grid-cols-2 gap-2">
                <a href="#" className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl px-3 py-2.5 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#a2a5b8"><path d="M0 3.449L9.75 2.1v9.168H0V3.449zm10.519-1.54L24 0v11.268H10.519V1.909zm0 10.421H24V24l-13.481-1.928V12.33zm-10.519.865h9.75V21.61L0 20.311v-7.116z"/></svg>
                  <span className="text-[#a2a5b8] text-sm font-semibold">Windows</span>
                </a>
                <a href="#" className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl px-3 py-2.5 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#a2a5b8"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm3.325 15.025a1.8 1.8 0 01-1.467.75c-.71 0-1.258-.291-1.258-.291s-.6.291-1.325.291c-.684 0-1.325-.5-1.575-1.125a5.533 5.533 0 01-.291-1.434c-.017-.233-.034-.483-.034-.741 0-1.875 1.159-3.3 2.825-3.3.692 0 1.25.275 1.25.275s.442-.217 1.05-.275c1.4-.117 2.375 1.084 2.459 1.209a3.1 3.1 0 00-1.859 2.85c0 1.633 1.25 2.5 1.459 2.625-.334.8-.817 1.483-1.234 1.866zm-1.867-6.225c-.258 1.417-1.575 2-1.575 2s-.225-1.25.042-2.5c.342-1.567 1.833-2.075 1.833-2.075s.175 1.175-.3 2.575z"/></svg>
                  <span className="text-[#a2a5b8] text-sm font-semibold">iOS / Mac</span>
                </a>
                <a href="#" className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl px-3 py-2.5 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#a2a5b8"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997M6.4764 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997M12.2785 2.1c-.2603-.004-.5107.0988-.6964.2858L9.07 4.8988C5.2351 6.8406 2.6011 10.7495 2.35 15.2285h19.3c-.2511-4.479-2.8851-8.3879-6.72-10.3297l-2.5121-2.513c-.183-.1866-.4311-.2901-.6894-.2858M12.2785 24h-.557c-5.7725 0-10.457-4.6845-10.457-10.4571h21.471C22.7355 19.3155 18.051 24 12.2785 24"/></svg>
                  <span className="text-[#a2a5b8] text-sm font-semibold">Android</span>
                </a>
                <a href="#" className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl px-3 py-2.5 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#a2a5b8"><path d="M12.015 1.054c-1.848 0-3.332 1.488-3.332 3.328 0 1.83 1.484 3.32 3.332 3.32 1.836 0 3.324-1.49 3.324-3.32s-1.488-3.328-3.324-3.328zM9.473 11.23c-1.636 0-3.136.937-3.9 2.414l-2.68 5.16c-.495.957-.12 2.133.84 2.625.96.494 2.13.12 2.624-.84l2.68-5.16c.38-.737 1.127-1.2 1.944-1.2h4.524c.816 0 1.564.463 1.943 1.2l2.68 5.16c.494.96 1.666 1.334 2.625.84.958-.492 1.334-1.668.84-2.625l-2.68-5.16c-.764-1.477-2.264-2.414-3.9-2.414h-5.04zM12 20.354c-1.043 0-1.898.845-1.898 1.889s.855 1.887 1.898 1.887 1.897-.843 1.897-1.887c0-1.044-.855-1.889-1.897-1.889z"/></svg>
                  <span className="text-[#a2a5b8] text-sm font-semibold">Linux</span>
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#fe6125]/10 text-[#fe6125] flex items-center justify-center font-bold text-sm flex-shrink-0 border border-[#fe6125]/20">2</div>
            <div className="flex flex-col w-full gap-3 mt-1">
               <span className="text-white font-bold text-base">Скопируйте ссылку</span>
               
               <div className="flex items-center gap-2 w-full">
                 <span className="text-[#6A6D82] text-xs font-semibold w-16">Основная:</span>
                 <div className="flex-1 flex bg-white/[0.03] border border-white/5 rounded-xl h-10 items-center overflow-hidden">
                    <input type="text" readOnly value={primaryLink} className="bg-transparent text-[#a2a5b8] text-xs h-full w-full px-3 outline-none" />
                 </div>
                 <button onClick={() => handleCopy(primaryLink)} className="w-10 h-10 bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl flex items-center justify-center text-[#a2a5b8] hover:text-white flex-shrink-0 active:scale-95">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                 </button>
               </div>

               <div className="bg-[#fe6125]/[0.08] border border-[#fe6125]/20 rounded-xl p-3 flex items-center gap-2">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fe6125" strokeWidth="2.5" className="flex-shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round"/></svg>
                 <span className="text-[#a2a5b8] text-xs">Используйте <b className="text-[#fe6125] font-bold">резервную ссылку</b>, если основная не работает</span>
               </div>

               <div className="flex items-center gap-2 w-full">
                 <span className="text-[#6A6D82] text-xs font-semibold w-16">Резервная:</span>
                 <div className="flex-1 flex bg-white/[0.03] border border-white/5 rounded-xl h-10 items-center overflow-hidden">
                    <input type="text" readOnly value={reserveLink} className="bg-transparent text-[#a2a5b8] text-xs h-full w-full px-3 outline-none" />
                 </div>
                 <button onClick={() => handleCopy(reserveLink)} className="w-10 h-10 bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl flex items-center justify-center text-[#a2a5b8] hover:text-white flex-shrink-0 active:scale-95">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                 </button>
               </div>

            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#fe6125]/10 text-[#fe6125] flex items-center justify-center font-bold text-sm flex-shrink-0 border border-[#fe6125]/20">3</div>
            <div className="flex flex-col w-full gap-3 mt-1">
               <span className="text-white font-bold text-base">Или отсканируйте QR-код</span>
               <div className="grid grid-cols-2 gap-4 mt-2">
                 <div className="flex flex-col items-center gap-2">
                   <span className="text-[#6A6D82] text-[10px] font-bold uppercase tracking-widest">Основная</span>
                   <div className="w-full bg-white p-2 rounded-xl border-4 border-white/5 aspect-square relative">
                      {/* Fake QR code for UI demonstration */}
                      <svg viewBox="0 0 100 100" fill="currentColor" className="text-black w-full h-full">
                        <path d="M10 10h30v30H10zm10 10h10v10H20zm40-10h30v30H60zm10 10h10v10H70zM10 60h30v30H10zm10 10h10v10H20zm30 10h10v10H50zm10-10h10v10H60zm10 0h10v10H70zm10-20h10v10H80zm-40-10h10v10H50zm10-10h10v10H60z" fillRule="evenodd" clipRule="evenodd" />
                      </svg>
                   </div>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                   <span className="text-[#fe6125] text-[10px] font-bold uppercase tracking-widest">Резервная</span>
                   <div className="w-full bg-white p-2 rounded-xl border-4 border-[#fe6125]/20 aspect-square relative">
                      <svg viewBox="0 0 100 100" fill="currentColor" className="text-black w-full h-full">
                        <path d="M10 10h30v30H10zm10 10h10v10H20zm40-10h30v30H60zm10 10h10v10H70zM10 60h30v30H10zm10 10h10v10H20zm30 10h10v10H50zm10-10h10v20H60zm10-10h20v10H70zm-30-20h10v10H40zm10-10h10v10H50z" fillRule="evenodd" clipRule="evenodd" />
                      </svg>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#fe6125] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-[0_2px_10px_rgba(254,97,37,0.4)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="flex flex-col w-full mt-1.5">
               <span className="text-white font-bold text-base">Вставьте и подключитесь!</span>
               <span className="text-[#a2a5b8] text-sm mt-1">Откройте приложение &rarr; вставьте ссылку или QR &rarr; нажмите Connect</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
