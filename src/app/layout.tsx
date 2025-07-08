"use client";
import './globals.css';
import type { ReactNode } from 'react';
import { UserProvider } from '@/lib/LanguageContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import SafeArea from '@/components/SafeArea';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <SafeArea>
          {children}
        </SafeArea>
      </body>
    </html>
  );
} 