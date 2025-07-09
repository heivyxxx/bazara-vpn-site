"use client";

// Весь предыдущий код главной страницы возвращён:

import { Hero } from '@/components/features/hero/Hero';
import { PromoCards } from '@/components/features/promo/PromoCards';
import { Reviews } from '@/components/features/reviews/Reviews';
import { Features } from '@/components/features/blocks/Features';
import { HowItWorks } from '@/components/features/how-it-works/HowItWorks';
import { FAQ } from '@/components/features/faq/FAQ';
import { Header } from '@/components/layout/Header';
// import { Footer } from '@/components/layout/Footer';
import { LanguageProvider, useLang } from '@/lib/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { ReviewModal } from '@/components/features/reviews/ReviewModal';
import { User } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/lib/LanguageContext';

// Расширяем глобальный интерфейс Window
declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

// Удаляю пропсы user/setUser из HomePage, возвращаю стандартный экспорт
export default function HomePage() {
  const { lang } = useLang();
  const [authOpen, setAuthOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useUser();

  // --- DEBUG LOGS ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        // DEBUG: выводим initData
        console.log('initData:', tg.initData);
      }
    }
  }, []);

  // Очищаем user и localStorage, если нет Telegram WebApp (чтобы не было реальных данных в браузере)
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Telegram?.WebApp) {
      setUser(null);
      localStorage.removeItem('bazaraUser');
      return;
    }
    const saved = localStorage.getItem('bazaraUser');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.name) {
          setUser(parsed);
        }
      } catch (e) {}
    }
  }, []);

  // --- Telegram Mini App авторизация с двойной защитой от спама ---
  const authDone = useRef(false);
  useEffect(() => {
    if (authDone.current) return;
    if (typeof window !== 'undefined' && localStorage.getItem('bazaraAuthDone') === '1') {
      authDone.current = true;
      return;
    }
    let isMounted = true;
    if (typeof window === 'undefined' || !window.Telegram?.WebApp) return;
    const tg = window.Telegram.WebApp;
    const tgUser = tg.initDataUnsafe?.user;
    if (!tgUser) return;

    fetch('/api/get-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: String(tgUser.id) }),
    })
      .then(res => res.json())
      .then(async data => {
        if (!isMounted) return;
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('bazaraUser', JSON.stringify(data.user));
          const { data: authData } = await supabase.auth.getUser();
          if (!authData?.user || authData.user.id !== data.user.auth_id) {
            const initData = window.Telegram.WebApp.initData || '';
            const regRes = await fetch('/api/auth/telegram', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: tgUser.id,
                username: tgUser.username,
                first_name: tgUser.first_name,
                last_name: tgUser.last_name,
                photo_url: tgUser.photo_url,
                language_code: tgUser.language_code,
                initData
              }),
            });
            const regData = await regRes.json();
            if (regData.access_token && regData.refresh_token) {
              await supabase.auth.setSession({
                access_token: regData.access_token,
                refresh_token: regData.refresh_token
              });
            }
            if (regData.user) {
              setUser(regData.user);
              localStorage.setItem('bazaraUser', JSON.stringify(regData.user));
              localStorage.setItem('bazaraAuthDone', '1');
              authDone.current = true;
              window.location.reload();
            }
          } else {
            localStorage.setItem('bazaraAuthDone', '1');
            authDone.current = true;
          }
        } else {
          // Если не найден — регистрация
          const initData = window.Telegram.WebApp.initData || '';
          const regRes = await fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: tgUser.id,
              username: tgUser.username,
              first_name: tgUser.first_name,
              last_name: tgUser.last_name,
              photo_url: tgUser.photo_url,
              language_code: tgUser.language_code,
              initData
            }),
          });
          const regData = await regRes.json();
          if (regData.access_token && regData.refresh_token) {
            await supabase.auth.setSession({
              access_token: regData.access_token,
              refresh_token: regData.refresh_token
            });
          }
          if (regData.user) {
            setUser(regData.user);
            localStorage.setItem('bazaraUser', JSON.stringify(regData.user));
            localStorage.setItem('bazaraAuthDone', '1');
            authDone.current = true;
            window.location.reload();
          }
        }
      });
    return () => { isMounted = false; };
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
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: user.id,
      //     text,
      //     rating,
      //     userName: user.name,
      //     userUsername: user.username
      //   })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setIsModalOpen(false);
      //   // Можно добавить обновление отзывов, если нужно
      // }
    } catch (error) {
      // TODO: Показать ошибку
    }
  };

  return (
    <>
      <Header user={user} onLogin={() => setAuthOpen(true)} onLogout={() => { setUser(null); if (typeof window !== 'undefined') localStorage.removeItem('bazaraUser'); }} />
      <ReviewModal isOpen={isModalOpen && !!user} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitReview} user={user} />
      <main className="min-h-screen bg-black">
        <Hero />
        <PromoCards />
        <Reviews />
        {/* Кнопка оставить отзыв — только под отзывами */}
        <section className="max-w-3xl mx-auto mt-0 mb-10 px-4 flex justify-center gap-4">
          <button onClick={() => { user ? setIsModalOpen(true) : setAuthOpen(true); }} className="flex items-center gap-2 bg-gradient-to-r from-[#FE6125] to-[#FE6125] hover:from-[#FE6125] hover:to-[#FE6125] text-white text-[22px] font-bold py-4 px-10 rounded-xl shadow-lg transition-all duration-200">
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
      {/* <Footer /> */}
    </>
  );
}