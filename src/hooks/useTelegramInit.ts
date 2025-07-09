declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
      [key: string]: any;
    };
  }
}

import { useEffect } from 'react';

export function useTelegramInit(onUser?: (user: any) => void) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      // fullscreen на всех устройствах, кроме ПК
      const isDesktop = (
        tg.platform === 'tdesktop' ||
        tg.platform === 'web' ||
        tg.platform === 'macos' ||
        tg.platform === 'unknown' ||
        /Win32|Win64|MacIntel|Linux x86_64/.test(navigator.platform)
      );
      if (!isDesktop) {
        tg.requestFullscreen();
        window.addEventListener('click', () => tg.requestFullscreen(), { once: true });
      }
      // Получаем пользователя из Telegram WebApp
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser && onUser) {
        onUser({
          id: tgUser.id,
          name: tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : ''),
          username: tgUser.username,
          photo_url: tgUser.photo_url,
          language_code: tgUser.language_code
        });
      }
    }
    // Инициализация Telegram SDK (опционально)
    (async () => {
      try {
        const { init } = await import('@telegram-apps/sdk');
        await init();
      } catch (e) {}
    })();
  }, [onUser]);
} 