declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
      [key: string]: any;
    };
    DEBUG_LOG?: string[];
  }
}

import { useEffect } from 'react';

export function useTelegramInit(onUser?: (user: any) => void) {
  useEffect(() => {
    function log(...args: any[]) {
      console.log('[useTelegramInit]', ...args);
      if (typeof window !== 'undefined') {
        window.DEBUG_LOG = window.DEBUG_LOG || [];
        window.DEBUG_LOG.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      }
    }
    log('init');
    if (typeof window !== 'undefined') {
      log('[DEBUG] window.Telegram:', window.Telegram);
      log('[DEBUG] window.Telegram.WebApp:', window.Telegram?.WebApp);
      log('[DEBUG] window.Telegram.WebApp.initDataUnsafe:', window.Telegram?.WebApp?.initDataUnsafe);
      log('[DEBUG] localStorage:', JSON.stringify(localStorage, null, 2));
    }
    // 1. Инициализация Telegram SDK (как в Eclipse)
    (async () => {
      try {
        const { init } = await import('@telegram-apps/sdk');
        await init();
        log('Telegram Apps SDK инициализирован');
      } catch (e) {
        log('Ошибка инициализации Telegram Apps SDK', e);
      }
      // 2. Проверяем наличие Telegram WebApp
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        log('window.Telegram.WebApp найден');
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        log('tg.platform:', tg.platform);
        log('tg.initDataUnsafe:', tg.initDataUnsafe);
        // fullscreen на всех устройствах отключен по просьбе
        // const isDesktop = ...
        // Получаем пользователя из Telegram WebApp
        const tgUser = tg.initDataUnsafe?.user;
        log('tgUser:', tgUser);
        if (tgUser && onUser) {
          onUser({
            id: tgUser.id,
            name: tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : ''),
            username: tgUser.username,
            photo_url: tgUser.photo_url,
            language_code: tgUser.language_code
          });
        }
      } else {
        log('window.Telegram.WebApp отсутствует');
      }
    })();
  }, [onUser]);
} 