"use client";
import React, { useState, useEffect } from 'react';
import { useLang } from '@/lib/LanguageContext';
import Image from 'next/image';
import { useUser } from '@/lib/LanguageContext';

const paymentTexts = {
  ru: {
    account: 'Ваш аккаунт',
    year: 'Тариф "BazaraVPN" — Годовой',
    month: 'Тариф "BazaraVPN" — Месячный',
    feature1: 'Безопасность',
    feature2: 'Безлимит',
    feature3: '5 устройств',
    feature4: 'Доступ к Netflix',
    sbp: 'СБП',
    card: 'Добавить карту',
    crypto: 'Крипта',
    pay: 'Оплатить',
    agree: 'Нажимая кнопку "Оплатить", вы соглашаетесь с условиями лицензии.',
    email: 'Ваш email для получения ссылки',
    close: 'Закрыть',
    error: 'Ошибка. Проверьте email и способ оплаты.',
    loading: 'Создание счёта...',
    success: 'Ссылка на подписку сгенерирована!',
    copy: 'Скопировать',
    copied: 'Скопировано!',
  },
  en: {
    account: 'Your account',
    year: 'BazaraVPN Plan — Yearly',
    month: 'BazaraVPN Plan — Monthly',
    feature1: 'Security',
    feature2: 'Unlimited',
    feature3: '5 devices',
    feature4: 'Netflix access',
    sbp: 'SBP',
    card: 'Add card',
    crypto: 'Crypto',
    pay: 'Pay',
    agree: 'By clicking "Pay", you agree to the license agreement.',
    email: 'Your email to receive the link',
    close: 'Close',
    error: 'Error. Check email and payment method.',
    loading: 'Creating invoice...',
    success: 'Subscription link generated!',
    copy: 'Copy',
    copied: 'Copied!',
  }
};

export type TariffType = string;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tariff: TariffType;
  price: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, tariff, price }) => {
  const { lang } = useLang();
  const t = paymentTexts[lang];
  const [user, setUser] = useUser();
  const [payMethod, setPayMethod] = useState<'sbp' | 'card' | 'crypto' | 'balance' | null>('balance');
  // Удаляю email
  // const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [afterPay, setAfterPay] = useState(false);
  const [closing, setClosing] = useState(false);
  // 1. Добавляю состояние для ссылки на оплату и polling
  const [paymentUrl, setPaymentUrl] = useState('');
  const [polling, setPolling] = useState(false);
  let pollingInterval: NodeJS.Timeout | null = null;

  const isCustom = tariff === 'Продление' || tariff === 'Свои дни' || tariff === 'custom';
  const [customDays, setCustomDays] = useState<number | ''>(30);
  
  const currentPrice = isCustom 
    ? (customDays === '' ? 0 : Math.ceil(customDays * 2.3)) 
    : Number(String(price).replace(/[^\d]/g, ''));

  const finalPackageDays = isCustom ? (customDays || 30) : (tariff === 'year' ? 365 : 30);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('afterpay') === '1') {
        setAfterPay(true);
        const email = localStorage.getItem('pay_email');
        const package_days = localStorage.getItem('pay_package_days');
        const task_id = localStorage.getItem('pay_task_id');
        if (email && package_days && task_id) {
          setLoading(true);
          fetch('/api/afterpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, package_days, task_id })
          })
            .then(r => r.json())
            .then(data => {
              setLoading(false);
              if (data && data.status === 'ok') {
                const link = `https://vpn.bazara.app/vless/${task_id}`;
                setLink(link);
              } else {
                setError('Ошибка генерации ссылки. Попробуйте позже.');
              }
            })
            .catch(() => {
              setLoading(false);
              setError('Ошибка соединения с сервером.');
            });
        } else {
          setError('Не найдены данные для генерации ссылки.');
        }
      }
    }
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  };

  if (!isOpen && !closing) return null;

  // 2. handlePay теперь для sbp/card только создаёт заказ и paymentUrl, а не вызывает /api/pay
  const handlePay = async () => {
    setError('');
    if (!payMethod) {
      setError(t.error);
      return;
    }
    if (!user || typeof user.id !== 'string') {
      setError('Пользователь не найден');
      return;
    }
    const amount = currentPrice;
    const package_days = finalPackageDays;
    const order_id = `${payMethod}_${user.id}_${Date.now()}`;
    setLoading(true);
    if (payMethod === 'balance') {
      // Баланс — всё как было
      try {
        const resp = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            package_days,
            order_id,
            method: payMethod,
            amount
          })
        });
        const data = await resp.json();
        setLoading(false);
        if (data && data.success && data.link) {
          setLink(data.link);
          setSuccess(true);
          setUser({ ...user, balance: user.balance - amount });
        } else {
          setError(data.error || 'Ошибка оплаты');
        }
      } catch (e: any) {
        setLoading(false);
        setError(e.message || 'Ошибка соединения');
      }
      return;
    }
    // Для sbp/card — создаём заказ, получаем ссылку на оплату
    try {
      const resp = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          package_days,
          order_id,
          method: payMethod,
          amount
        })
      });
      const data = await resp.json();
      setLoading(false);
      if (data && data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      } else {
        setError(data.error || 'Ошибка создания заказа');
      }
    } catch (e: any) {
      setLoading(false);
      setError(e.message || 'Ошибка соединения');
    }
  };

  const handleCopy = () => {
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] w-full h-full bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className={`relative w-full max-w-[360px] bg-[#18181b] rounded-[28px] flex flex-col shadow-[0_12px_45px_rgba(0,0,0,0.5)] ${closing ? 'animate-modal-out' : 'animate-modal-in'}`}
        style={{ maxHeight: '85vh' }}
      >
        <div className="flex flex-row items-center justify-between px-6 pt-5 pb-2 sticky top-0 z-10 bg-[#18181b] rounded-t-[28px]">
           <span className="text-white font-bold text-lg">Оплата</span>
           <button onClick={handleClose} className="text-[#6A6D82] hover:text-white bg-white/5 hover:bg-white/10 transition-colors w-8 h-8 rounded-full flex items-center justify-center">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
           </button>
        </div>
        <div className="flex flex-col items-center px-6 pb-6 pt-1 gap-5 overflow-y-auto w-full">
          <div className="font-extrabold text-xl text-white text-center w-full">
            {isCustom ? "Тариф — Свои дни" : (tariff === 'year' ? t.year : tariff === 'month' ? t.month : `Тариф — ${tariff}`)}
          </div>
          
          {isCustom ? (
            <div className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 my-1">
               <span className="text-white font-bold text-sm">Укажите количество дней:</span>
               <div className="flex items-center gap-3 w-full">
                 <div className="flex-1 bg-black/40 border border-white/10 rounded-xl h-12 flex items-center px-4 focus-within:border-[#fe6125]/50 transition-colors">
                   <input 
                     type="text"
                     inputMode="numeric"
                     value={customDays === 0 ? '' : customDays} 
                     onChange={(e) => setCustomDays(Math.max(0, parseInt(e.target.value.replace(/\D/g, '')) || 0))}
                     className="bg-transparent text-white w-full outline-none font-bold text-lg"
                     placeholder="Введите дни..."
                   />
                 </div>
                 <span className="text-[#A2A5B8] font-bold">дней</span>
               </div>
               <span className="text-[#fe6125] text-sm font-semibold mt-1">1 день = 2.3 ₽</span>
            </div>
          ) : (
            <div className="w-full flex justify-center my-4 items-center flex-col">
              <span className="text-[44px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fe6125] to-[#f98055] tracking-tight drop-shadow-[0_4px_12px_rgba(254,97,37,0.3)]">
                 {currentPrice} ₽
              </span>
            </div>
          )}

          <div className={`w-full text-center text-sm font-medium bg-white/[0.03] rounded-xl py-3.5 px-4 border ${user && typeof user.balance === 'number' && user.balance < currentPrice ? 'border-red-500/20 text-red-400' : 'border-white/5 text-[#A2A5B8]'}`}>
            {user && typeof user.balance === 'number' && user.balance < currentPrice ? (
              <>Недостаточно средств. Баланс: <span className="font-bold ml-1">{user.balance.toFixed(2)}₽</span></>
            ) : (
              <>
                Спишется с баланса: 
                {user && typeof user.balance === 'number' && (
                  <span className="text-white font-bold ml-1">{user.balance.toFixed(2)}₽</span>
                )}
              </>
            )}
          </div>
          {error && !success && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success ? (
             <div className="flex flex-col w-full items-center gap-4 animate-fadeIn">
                <div className="text-green-500 font-bold text-center text-[15px]">{t.success}</div>
                <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                   <span className="text-white/80 text-sm font-mono truncate mr-4">{link}</span>
                   <button 
                      onClick={handleCopy} 
                      className="bg-white/10 hover:bg-white/20 active:bg-white/10 transition-colors px-4 py-2 rounded-xl text-white font-bold text-[13px] whitespace-nowrap shadow-sm"
                   >
                     {copied ? t.copied : t.copy}
                   </button>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full py-3.5 mt-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition shadow-sm"
                >
                  {t.close}
                </button>
             </div>
          ) : (
            <>
              <div className="sticky bottom-0 left-0 w-full flex justify-center gap-4 px-0 pt-2 bg-[#18181b] rounded-b-3xl z-20 mt-auto">
                {polling && !link ? (
                  <div className="flex-1 py-3.5 rounded-xl bg-[#fd6a32] text-white font-semibold text-[15px] transition disabled:opacity-50 flex items-center justify-center opacity-70">
                    {t.loading}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#fe6125] to-[#f98055] hover:opacity-90 active:scale-[0.98] text-white font-bold text-[15px] flex justify-center items-center shadow-[0_4px_15px_rgba(254,97,37,0.3)] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                    disabled={loading || currentPrice <= 0}
                    onClick={() => {
                       if (user && typeof user.balance === 'number' && user.balance < currentPrice) {
                         window.location.href = '/deposit';
                       } else {
                         handlePay();
                       }
                    }}
                  >
                    {loading ? "Обработка..." : (
                      <span className="flex items-center justify-center w-full">
                        {(!user || (typeof user.balance === 'number' && user.balance < currentPrice)) 
                          ? "Пополнить баланс" 
                          : t.pay}
                      </span>
                    )}
                  </button>
                )}
              </div>
              <div className="text-[11px] text-[#A2A5B8] mt-3 text-center">
                Нажимая кнопку "Оплатить", вы соглашаетесь с условиями <a href="#" className="underline hover:text-white/60 transition">лицензионного соглашения</a>.
              </div>
            </>
          )}
        </div>
        <style jsx>{`
          .pay-method {
            background: #181818;
            color: #fff;
            border-radius: 1rem;
            padding: 1.25rem 0;
            font-weight: 600;
            font-size: 1.1rem;
            text-align: center;
            transition: background 0.18s, box-shadow 0.18s, border 0.18s;
            border: 2.5px solid transparent;
            cursor: pointer;
          }
          .pay-method:hover {
            background: #333;
          }
          .pay-method.selected {
            border: 2.5px solid;
            border-image: linear-gradient(90deg, #fd6a32 0%, #a259ff 100%) 1;
            box-shadow: 0 0 0 2px #fd6a3255;
            border-radius: 1rem !important;
          }
        `}</style>
      </div>
    </div>
  );
}; 