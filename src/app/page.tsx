"use client";

import { Hero } from '@/components/features/hero/Hero';
import { Benefits } from '@/components/features/benefits/Benefits';
import { DownloadMenu } from '@/components/features/download/DownloadMenu';
import { Guarantee } from '@/components/features/guarantee/Guarantee';
import { PromoCards } from '@/components/features/promo/PromoCards';
import { Reviews } from '@/components/features/reviews/Reviews';
import { Features } from '@/components/features/blocks/Features';
import { HowItWorks } from '@/components/features/how-it-works/HowItWorks';
import { FAQ } from '@/components/features/faq/FAQ';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Расширяем глобальный интерфейс Window
declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#1A1A1A]">
        <Hero />
        <Benefits />
        <DownloadMenu />
        <Guarantee />
        <PromoCards />
        <Reviews />
        <Features />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </>
  );
} 
