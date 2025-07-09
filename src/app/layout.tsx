"use client";
import './globals.css';
import type { ReactNode } from 'react';
import { UserProvider } from '@/lib/LanguageContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import SafeArea from '@/components/SafeArea';
import BottomNav from '@/components/BottomNav';
import Script from 'next/script';
import { useState } from 'react';
import { User } from '@/lib/types';
import React from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body>
        <UserProvider>
          <LanguageProvider>
            <SafeArea>
              {children}
              <BottomNav />
            </SafeArea>
          </LanguageProvider>
        </UserProvider>
      </body>
    </html>
  );
} 