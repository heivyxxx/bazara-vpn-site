import { useEffect } from 'react';

export function useTelegramInit(onUser?: (user: any) => void) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      // fullscreen для мобилок
      if (tg.platform === 'android' || tg.platform === 'ios' || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
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
        // console.log('[Telegram Apps SDK] Инициализация завершена');
      } catch (e) {
        // console.error('[Telegram Apps SDK] Ошибка инициализации:', e);
      }
    })();
  }, [onUser]);
} 