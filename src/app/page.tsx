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
import { LanguageProvider, useUser } from '@/lib/LanguageContext';
import { useState, useEffect } from 'react';
import { ReviewModal } from '@/components/features/reviews/ReviewModal';
import { User } from '@/lib/types';
import { useLang } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

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

  // --- DEBUG LOGS ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Проверка по документации Telegram
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        console.log('[TG SDK] tg.ready() вызван');
      } else {
        console.log('[TG SDK] window.Telegram.WebApp отсутствует');
      }
      // Явный вывод для дебага
      console.log('[TG SDK] window.Telegram:', window.Telegram);
      console.log('[TG SDK] window.Telegram.WebApp:', window.Telegram?.WebApp);
      console.log('[TG SDK] window.Telegram.WebApp.initDataUnsafe:', window.Telegram?.WebApp?.initDataUnsafe);
      console.log('[DEBUG] localStorage:', JSON.stringify(localStorage, null, 2));
    }
  }, []);

  // Очищаем user и localStorage, если нет Telegram WebApp (чтобы не было реальных данных в браузере)
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Telegram?.WebApp) {
      console.log('[DEBUG] Нет Telegram WebApp, очищаю user и localStorage');
      setUser(null);
      localStorage.removeItem('bazaraUser');
      return;
    }
    const saved = localStorage.getItem('bazaraUser');
    console.log('[DEBUG] bazaraUser из localStorage:', saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.name) {
          setUser(parsed);
          console.log('[DEBUG] setUser из localStorage:', parsed);
        }
      } catch (e) {
        console.log('[DEBUG] Ошибка парса bazaraUser:', e);
      }
    }
  }, []);

  // --- Telegram Mini App авторизация с ожиданием появления tgUser ---
  useEffect(() => {
    let tries = 0;
    function tryAuth() {
      if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
        if (tries < 50) { // увеличено до 50 попыток
          tries++;
          setTimeout(tryAuth, 150);
        } else {
          console.log('[TG AUTH] window.Telegram.WebApp так и не появился после 50 попыток');
        }
        return;
      }
      const tg = window.Telegram.WebApp;
      console.log('[TG AUTH] tg:', tg);
      tg.ready && tg.ready();
      tg.expand && tg.expand();
      // fullscreen на всех устройствах, кроме ПК (Eclipse-style)
      const isDesktop = (
        tg.platform === 'tdesktop' ||
        tg.platform === 'web' ||
        tg.platform === 'macos'
      );
      if (!isDesktop) {
        tg.requestFullscreen && tg.requestFullscreen();
        window.addEventListener('click', () => tg.requestFullscreen && tg.requestFullscreen(), { once: true });
        console.log('[TG AUTH] fullscreen вызван');
      }
      const tgUser = tg.initDataUnsafe?.user;
      console.log('[TG AUTH] try', tries, tgUser);
      if (tgUser) {
        (async () => {
          try {
            console.log('[TG AUTH] tgUser найден:', tgUser);
            const res = await fetch('/api/get-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ telegram_id: String(tgUser.id) }),
            });
            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
              console.log('[TG AUTH] setUser:', data.user);
              // Проверяем сессию Supabase
              const { data: authData } = await supabase.auth.getUser();
              console.log('[TG AUTH] supabase.auth.getUser:', authData);
              if (!authData?.user || authData.user.id !== data.user.auth_id) {
                // Нет сессии — логинимся через /api/auth/telegram
                const regRes = await fetch('/api/auth/telegram', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    telegram_id: String(tgUser.id),
                    username: tgUser.username,
                    first_name: tgUser.first_name,
                    last_name: tgUser.last_name,
                    photo_url: tgUser.photo_url,
                    language_code: tgUser.language_code,
                    initData: tg.initData || ''
                  }),
                });
                const regData = await regRes.json();
                console.log('[TG AUTH] /api/auth/telegram ответ:', regData);
                if (regData.access_token && regData.refresh_token) {
                  await supabase.auth.setSession({
                    access_token: regData.access_token,
                    refresh_token: regData.refresh_token
                  });
                  console.log('[TG AUTH] supabase setSession выполнен');
                }
                if (regData.user) {
                  setUser(regData.user);
                  console.log('[TG AUTH] setUser после регистрации:', regData.user);
                  window.location.reload();
                }
              }
            } else {
              // Если не найден — регистрация
              const regRes = await fetch('/api/auth/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  telegram_id: String(tgUser.id),
                  username: tgUser.username,
                  first_name: tgUser.first_name,
                  last_name: tgUser.last_name,
                  photo_url: tgUser.photo_url,
                  language_code: tgUser.language_code,
                  initData: tg.initData || ''
                }),
              });
              const regData = await regRes.json();
              console.log('[TG AUTH] /api/auth/telegram ответ (регистрация):', regData);
              if (regData.access_token && regData.refresh_token) {
                await supabase.auth.setSession({
                  access_token: regData.access_token,
                  refresh_token: regData.refresh_token
                });
                console.log('[TG AUTH] supabase setSession выполнен (регистрация)');
              }
              if (regData.user) {
                setUser(regData.user);
                console.log('[TG AUTH] setUser после регистрации:', regData.user);
                window.location.reload();
              }
            }
          } catch (e) {
            console.error('[TG AUTH] Ошибка авторизации:', e);
          }
        })();
      } else if (tries < 50) { // увеличено до 50 попыток
        tries++;
        setTimeout(tryAuth, 150);
      } else {
        console.log('[TG AUTH] tgUser не появился после 50 попыток');
      }
    }
    tryAuth();
  }, [setUser]);

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
      <div style={{background:'#111',color:'#fff',padding:12,borderRadius:8,margin:'16px 0',fontSize:13}}>
        <b>DEBUG:</b>
        <div><b>window.Telegram:</b> {JSON.stringify(typeof window !== 'undefined' ? window.Telegram : null)}</div>
        <div><b>window.Telegram.WebApp:</b> {JSON.stringify(typeof window !== 'undefined' ? window.Telegram?.WebApp : null)}</div>
        <div><b>window.Telegram.WebApp.initDataUnsafe:</b> {JSON.stringify(typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe : null)}</div>
        <div><b>user:</b> {JSON.stringify(user)}</div>
      </div>
    </>
  );
}