"use client";
import './globals.css';
import type { ReactNode } from 'react';
import { UserProvider } from '@/lib/LanguageContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import SafeArea from '@/components/SafeArea';
import BottomNav from '@/components/BottomNav';
import Script from 'next/script';
import React, { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      const isMobile = tg.platform === 'android' || tg.platform === 'ios' || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile) {
        tg.requestFullscreen();
        window.addEventListener('click', () => tg.requestFullscreen(), { once: true });
      }
    }
  }, []);
  return (
    <html lang="ru">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={outfit.className}>
        <UserProvider>
          <LanguageProvider>
            <SafeArea>
              <div className="animate-page-in flex flex-col min-h-screen">
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