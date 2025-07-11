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

export type TariffType = 'year' | 'month';

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
  const [payMethod, setPayMethod] = useState<'sbp' | 'card' | 'crypto' | 'balance' | null>(null);
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
    const amount = Number(String(price).replace(/[^\d]/g, ''));
    const package_days = tariff === 'year' ? 365 : 30;
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
    <div className="fixed inset-0 z-[9999] w-full h-full bg-black/80 flex items-end justify-center">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className={`relative w-full bg-[#18181b] rounded-t-3xl flex flex-col animate-fadeInUp ${closing ? 'animate-slideOutDown' : 'animate-slideInUp'}`}
        style={{ minHeight: '30vh', maxHeight: '65vh', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
      >
        <div className="flex flex-row items-center justify-between px-6 pt-6 pb-2 sticky top-0 z-10 bg-[#18181b] rounded-t-3xl">
          <span className="text-white font-bold text-lg w-full text-center">Оплата</span>
          <button
            onClick={handleClose}
            className="text-zinc-400 text-2xl p-1 rounded-full ml-2 absolute right-6 top-6"
            aria-label="Закрыть"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="flex flex-col items-center px-6 pb-6 pt-2 gap-6 overflow-y-auto">
          <div className="font-extrabold text-xl sm:text-2xl text-white text-center">{tariff === 'year' ? t.year : t.month}</div>
          <div className="w-full flex justify-center my-2">
            <Image
              src={tariff === 'year' ? '/assets/1year.png' : '/assets/1month.png'}
              alt={tariff === 'year' ? 'Годовой тариф' : 'Месячный тариф'}
              width={140}
              height={140}
              className="w-[140px] h-[140px] object-contain my-2"
              priority
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
            <button type="button" onClick={()=>setPayMethod('sbp')} className={`flex-1 pay-method${payMethod==='sbp'?' selected':''} min-w-0`}>{t.sbp}</button>
            <button type="button" onClick={()=>setPayMethod('card')} className={`flex-1 pay-method${payMethod==='card'?' selected':''} min-w-0`}>{t.card}</button>
            {/* <button type="button" onClick={()=>setPayMethod('crypto')} className={`flex-1 pay-method${payMethod==='crypto'?' selected':''} min-w-0`}>{t.crypto}</button> */}
            <button type="button" onClick={()=>setPayMethod('balance')} className={`flex-1 pay-method${payMethod==='balance'?' selected':''} min-w-0`}>Баланс {user && typeof user.balance === 'number' ? `(${user.balance.toFixed(2)}₽)` : ''}</button>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="sticky bottom-0 left-0 w-full flex justify-center gap-4 px-0 pt-2 bg-[#18181b] rounded-b-3xl z-20 mt-auto">
            {polling && !link ? (
              <div className="flex-1 py-3 rounded-xl bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-semibold text-base transition disabled:opacity-50 disabled:cursor-not-allowed">
                {t.loading}
              </div>
            ) : (
              <button
                type="button"
                className="flex-1 py-3 rounded-xl bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-semibold text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || (payMethod === 'balance' && (!user || typeof user.balance !== 'number' || user.balance < Number(String(price).replace(/[^\d]/g, ''))))}
                onClick={handlePay}
              >
                {t.pay} <span className="ml-2 font-bold">{price}</span>
              </button>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">Нажимая кнопку "Оплатить", вы соглашаетесь с условиями <a href="#" className="underline">лицензионного соглашения</a>.</div>
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