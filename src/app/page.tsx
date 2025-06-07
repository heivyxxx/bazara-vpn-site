"use client";

import { Hero } from '@/components/features/hero/Hero';
import { PromoCards } from '@/components/features/promo/PromoCards';
import { Reviews } from '@/components/features/reviews/Reviews';
import { Features } from '@/components/features/blocks/Features';
import { HowItWorks } from '@/components/features/how-it-works/HowItWorks';
import { FAQ } from '@/components/features/faq/FAQ';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider } from '@/lib/LanguageContext';

// Расширяем глобальный интерфейс Window
declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <Header />
      <main className="min-h-screen bg-[#1A1A1A]">
        <Hero />
        <PromoCards />
        <Reviews />
        <Features />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </LanguageProvider>
  );
} 
