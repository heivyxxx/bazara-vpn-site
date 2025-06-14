"use client";

import { Hero } from '@/components/features/hero/Hero';
import { PromoCards } from '@/components/features/promo/PromoCards';
import { Reviews } from '@/components/features/reviews/Reviews';
import { Features } from '@/components/features/blocks/Features';
import { HowItWorks } from '@/components/features/how-it-works/HowItWorks';
import { FAQ } from '@/components/features/faq/FAQ';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider, useUser } from '@/lib/LanguageContext';
import { useState, useEffect } from 'react';
import { TelegramAuthModal } from '@/components/features/TelegramAuthModal';
import { ReviewModal } from '@/components/features/reviews/ReviewModal';
import { User } from '@/lib/types';
import { useLang } from '@/lib/LanguageContext';

// Расширяем глобальный интерфейс Window
declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

export default function HomePage() {
  const { lang } = useLang();
  const [authOpen, setAuthOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useUser();
  // Автологин через localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bazaraUser');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id && parsed.name) setUser(parsed);
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (!ref) return;
    let userId = localStorage.getItem('bazara_ref_userid');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('bazara_ref_userid', userId);
    }
    const refKey = `bazara_ref_${ref}`;
    if (localStorage.getItem(refKey)) return;
    fetch('/api/referral-hit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref, userId })
    }).then(() => {
      localStorage.setItem(refKey, '1');
    });
  }, []);

  // Отправка отзыва
  const handleSubmitReview = async (text: string, rating: number) => {
    if (!user) return;
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          text,
          rating,
          userName: user.name,
          userUsername: user.username
        })
      });
      const data = await response.json();
      if (data.success) {
        setIsModalOpen(false);
        // Можно добавить обновление отзывов, если нужно
      }
    } catch (error) {
      // TODO: Показать ошибку
    }
  };

  return (
    <LanguageProvider>
      <Header user={user} onLogin={() => setAuthOpen(true)} onLogout={() => { setUser(null); if (typeof window !== 'undefined') localStorage.removeItem('bazaraUser'); }} />
      <TelegramAuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuth={u => { setUser(u); if (typeof window !== 'undefined') localStorage.setItem('bazaraUser', JSON.stringify(u)); setAuthOpen(false); setIsModalOpen(true); }} />
      <ReviewModal isOpen={isModalOpen && !!user} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitReview} user={user} />
      <main className="min-h-screen bg-[#1A1A1A]">
        <Hero />
        <PromoCards />
        <Reviews />
        {/* Кнопка оставить отзыв — только под отзывами */}
        <section className="max-w-3xl mx-auto mt-0 mb-10 px-4 flex justify-center gap-4">
          <button onClick={() => { user ? setIsModalOpen(true) : setAuthOpen(true); }} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white text-[22px] font-bold py-4 px-10 rounded-xl shadow-lg transition-all duration-200">
            <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5Z" />
            </svg>
            <span>Оставить отзыв</span>
          </button>
        </section>
        <Features />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </LanguageProvider>
  );
} 


