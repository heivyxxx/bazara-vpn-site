import React, { useEffect, useRef } from 'react';

interface TelegramAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth?: (user: any) => void;
}

export const TelegramAuthModal: React.FC<TelegramAuthModalProps> = ({ isOpen, onClose, onAuth }) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && widgetRef.current) {
      widgetRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?7';
      script.async = true;
      script.setAttribute('data-telegram-login', 'BazaraVpnLoginBot'); // Заменить на своего бота!
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-userpic', 'false');
      script.setAttribute('data-radius', '14');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.id = 'tg-login-script';
      widgetRef.current.appendChild(script);
      // Глобальный обработчик
      window.onTelegramAuth = async (user: any) => {
        if (resultRef.current) resultRef.current.textContent = '...';
        try {
          const resp = await fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
          });
          const data = await resp.json();
          if (data.success) {
            if (resultRef.current) resultRef.current.textContent = 'Успешно!';
            if (onAuth) onAuth({
              id: user.id,
              name: user.first_name,
              username: user.username,
              photo_url: user.photo_url
            });
            setTimeout(onClose, 1200);
          } else {
            if (resultRef.current) resultRef.current.textContent = data.error || 'Ошибка авторизации';
          }
        } catch {
          if (resultRef.current) resultRef.current.textContent = 'Ошибка соединения с сервером.';
        }
      };
    }
    return () => {
      if (widgetRef.current) widgetRef.current.innerHTML = '';
      if (resultRef.current) resultRef.current.textContent = '';
    };
  }, [isOpen, onClose, onAuth]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300 p-2 sm:p-0">
      <div className="bg-[#232323] rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 w-full max-w-md relative flex flex-col gap-6 animate-fade-in" style={{minWidth:0, minHeight:240}}>
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-[#181818] hover:bg-[#2c2c2c] text-2xl text-gray-400">&times;</button>
        <div className="flex flex-col items-center gap-4">
          <img src="/assets/telegram.png" alt="Telegram" className="w-14 h-14 sm:w-16 sm:h-16 mb-2" />
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 text-center">Авторизация через Telegram</h3>
          <p className="text-white text-center mb-4 text-base sm:text-lg">Войдите через Telegram, чтобы получить доступ к личному кабинету.<br/>Это безопасно и быстро!</p>
          <div ref={widgetRef} className="my-2 w-full flex justify-center" />
          <div ref={resultRef} className="text-white text-center mt-4 min-h-[24px] text-base sm:text-lg" />
        </div>
      </div>
    </div>
  );
}; 