"use client";
import React from "react";
import { Header } from '@/components/layout/Header';
import { useUser } from '@/lib/LanguageContext';
import { AppMainShell } from '@/components/AppMainShell';

export default function SupportPage() {
  const [user, setUser] = useUser();

  const faqs = [
    { title: "Как продлить подписку?", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
    { title: "Как подключить дополнительное устройство?", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
    { title: "VPN не подключается или работает нестабильно", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
    { title: "Какие способы пополнения баланса доступны?", icon: "M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4M4 10v9a2 2 0 002 2h14v-9H4z" },
    { title: "Как получить тестовый период?", icon: "M19 21H5m9-11v11a4 4 0 004-4v-7M9 10v11a4 4 0 01-4-4v-7m4 0V5a2 2 0 012-2h2a2 2 0 012 2v5h-6z" },
    { title: "Остались вопросы? Нужна помощь?", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
  ];

  return (
    <>
      <Header user={user} onLogout={() => setUser(null)} />
      <AppMainShell innerClassName="items-stretch">
        <div className="w-full flex flex-col gap-5">
          
          <div className="mt-1 text-left">
            <h1 className="text-xl font-bold text-white tracking-tight mb-1">
              Служба поддержки
            </h1>
          </div>

          <div className="bazara-panel flex flex-col items-center p-6 text-center">
             <div className="w-14 h-14 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M18 10a6 6 0 10-12 0v8h12v-8z" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 21a2.5 2.5 0 01-2.5-2.5V18h5v.5A2.5 2.5 0 0112 21zM9 14h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </div>
             <p className="text-zinc-500 text-[14px] mb-5">Есть вопросы? Свяжитесь с нами 24/7</p>
             <a href="https://t.me/bazara_support" target="_blank" rel="noreferrer" className="btn-glow font-semibold py-2.5 px-6 rounded-xl flex items-center gap-2 text-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06 .01.24 0 .38z"/></svg>
                Открыть чат
             </a>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="pl-1 mb-1">
               <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wide">Часто задаваемые вопросы</span>
            </div>
            
            <div className="bazara-panel p-1.5 flex flex-col">
              {faqs.map((faq, idx) => {
                const [isOpen, setIsOpen] = React.useState(false);
                return (
                <React.Fragment key={idx}>
                  <div 
                    onClick={() => setIsOpen(!isOpen)}
                    className="hover:bg-zinc-900/40 transition-colors px-3 py-3 rounded-xl flex flex-col cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-center text-zinc-500 flex-shrink-0">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d={faq.icon} strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <span className="text-white text-[13px] font-medium tracking-tight pr-1">{faq.title}</span>
                      </div>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={`text-zinc-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    {isOpen && (
                      <div className="mt-3 pl-12 text-zinc-500 text-[13px] leading-relaxed pr-2 pb-1">
                        Здесь вы можете найти ответ на свой вопрос. Для подробной консультации, пожалуйста, обратитесь в службу поддержки через кнопку &quot;Открыть чат&quot; выше. Мы всегда рады помочь!
                      </div>
                    )}
                  </div>
                  {idx < faqs.length - 1 && <div className="h-px bg-zinc-800/80 w-[92%] mx-auto"></div>}
                </React.Fragment>
              )})}
            </div>
          </div>

        </div>
      </AppMainShell>
    </>
  );
}