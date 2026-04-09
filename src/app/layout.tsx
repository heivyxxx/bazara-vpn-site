"use client";
import './globals.css';
import type { ReactNode } from 'react';
import { UserProvider } from '@/lib/LanguageContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import SafeArea from '@/components/SafeArea';
import BottomNav from '@/components/BottomNav';
import { SplashScreen } from '@/components/SplashScreen';
import Script from 'next/script';
import React, { useEffect } from 'react';
import { User } from '@/lib/types';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});


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