"use client";
import './globals.css';
import type { ReactNode } from 'react';
import { UserProvider } from '@/lib/LanguageContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import SafeArea from '@/components/SafeArea';
import BottomNav from '@/components/BottomNav';
import { SplashScreen } from '@/components/SplashScreen';
import Script from 'next/script';
import React, { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

function DebugConsole() {
  const [logs, setLogs] = useState<string[]>([]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).DEBUG_LOG) {
        setLogs([...(window as any).DEBUG_LOG]);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  if (logs.length === 0) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.85)', color: '#0f0', zIndex: 99999, padding: '10px', maxHeight: '40vh', overflowY: 'auto', fontSize: '11px', pointerEvents: 'auto', borderBottom: '1px solid #333' }}>
      <button onClick={() => { (window as any).DEBUG_LOG = []; setLogs([]); }} style={{ float:'right', background:'red', color:'white', padding:'2px 5px' }}>Clear</button>
      {logs.map((L, i) => <div key={i} style={{marginBottom:'4px', wordBreak: 'break-all'}}>{L}</div>)}
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
    }
  }, []);
  return (
    <html lang="ru">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} bg-[#0A0A0F] text-white antialiased`}>
        <DebugConsole />
        <SplashScreen />
        <UserProvider>
          <LanguageProvider>
            <SafeArea>
              <div className="flex flex-col min-h-screen">
                {children}
              </div>
              <BottomNav />
            </SafeArea>
          </LanguageProvider>
        </UserProvider>
      </body>
    </html>
  );
} 