import React, { useState, useEffect } from 'react';
import { useLang } from '@/lib/LanguageContext';
import Image from 'next/image';
import { useUser } from '@/lib/LanguageContext';
import sbpImg from '../../public/assets/sbp.png';
import cryptoImg from '../../public/assets/cryptobot.png';
import starsImg from '../../public/assets/stars.png';

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

  // Выбор метода по умолчанию при открытии
  useEffect(() => {
    if (isOpen && user && typeof user.balance === 'number') {
      const numericPrice = Number(String(price).replace(/[^\d]/g, ''));
      if (user.balance >= numericPrice) {
        setPayMethod('balance');
      } else {
        setPayMethod('sbp');
      }
    }
  }, [isOpen, price, user]);

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
    <div className="fixed inset-0 z-[9999] w-full h-full bg-black/70 backdrop-blur-[6px] flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className={`relative w-full max-w-[340px] bg-[#101014]/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 flex flex-col shadow-[0_15px_50px_rgba(0,0,0,0.6)] ${closing ? 'animate-fadeOutScale' : 'animate-fadeInScale'}`}>
        
        {/* Хедер модалки */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="w-8"></div>
          <span className="text-white font-extrabold text-lg text-center tracking-wide">Подтверждение</span>
          <button onClick={handleClose} className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-[#A2A5B8] transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="text-center mb-6 flex flex-col items-center gap-1">
          <span className="text-[#A2A5B8] text-xs font-bold uppercase tracking-widest">{tariff === 'year' ? t.year : tariff === 'month' ? t.month : tariff}</span>
          <span className="text-[#fe6125] font-black text-3xl">{price}</span>
        </div>

        {(!user || typeof user.balance !== 'number' || user.balance < Number(String(price).replace(/[^\d]/g, ''))) ? (
          <div className="w-full flex flex-col gap-4">
             <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 flex flex-col items-center text-center">
                <span className="text-red-400 font-bold text-sm mb-0.5">Недостаточно средств</span>
                <span className="text-[#A2A5B8] text-xs">Ваш баланс: <span className="text-white">{user?.balance?.toFixed(2)||0} ₽</span></span>
             </div>
             
             <div className="flex flex-col gap-2 w-full mt-2">
               <span className="text-[#6A6D82] text-[10px] uppercase font-bold tracking-wider text-center mb-1">Выберите способ оплаты</span>
               <div className="grid grid-cols-3 gap-2">
                 <button onClick={()=>setPayMethod('sbp')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${payMethod==='sbp' ? 'bg-[#fe6125]/10 border-[#fe6125] shadow-[0_0_15px_rgba(254,97,37,0.15)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                   <img src={sbpImg.src} alt="СБП" className="w-8 h-8 object-contain drop-shadow-md" />
                   <span className="text-white font-bold text-[10px]">СБП</span>
                 </button>
                 <button onClick={()=>setPayMethod('crypto')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${payMethod==='crypto' ? 'bg-[#fe6125]/10 border-[#fe6125] shadow-[0_0_15px_rgba(254,97,37,0.15)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                   <img src={cryptoImg.src} alt="Crypto" className="w-8 h-8 object-contain drop-shadow-md" />
                   <span className="text-white font-bold text-[10px]">Крипта</span>
                 </button>
                 <button onClick={()=>setPayMethod('stars')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${payMethod==='stars' ? 'bg-[#fe6125]/10 border-[#fe6125] shadow-[0_0_15px_rgba(254,97,37,0.15)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                   <img src={starsImg.src} alt="Stars" className="w-8 h-8 object-contain drop-shadow-md" />
                   <span className="text-white font-bold text-[10px]">Stars</span>
                 </button>
               </div>
             </div>

             {error && <div className="text-red-500 text-xs text-center mt-2">{error}</div>}
             
             <button onClick={handlePay} disabled={loading || !payMethod || payMethod === 'balance'} className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-[#fe6125] to-[#ff9e5e] hover:from-[#e04c14] hover:to-[#fe6125] text-white font-bold transition disabled:opacity-50 shadow-[0_0_20px_rgba(254,97,37,0.3)]">
               {loading ? 'Переход к оплате...' : 'Оплатить'}
             </button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex flex-col items-center text-center">
               <span className="text-green-400 font-bold mb-1">Достаточно средств</span>
               <span className="text-[#A2A5B8] text-xs">Ваш баланс: <span className="text-white">{user?.balance?.toFixed(2)} ₽</span></span>
            </div>
            {error && <div className="text-red-500 text-xs text-center mt-2">{error}</div>}
            <button onClick={handlePay} disabled={loading} className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-[#green-500] to-[#green-400] hover:from-[#green-600] hover:to-[#green-500] text-white font-bold transition disabled:opacity-50 shadow-[0_0_20px_rgba(74,222,128,0.3)]" style={{ background: 'linear-gradient(135deg, #fe6125 0%, #ff824f 100%)' }}>
              {loading ? 'Оформление...' : 'Оплатить с баланса'}
            </button>
          </div>
        )}

        {success && (
          <div className="absolute inset-0 bg-[#101014]/90 backdrop-blur-xl rounded-[2rem] flex flex-col items-center justify-center p-6 z-50 animate-fadeInScale">
             <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 text-green-500">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
             </div>
             <span className="text-white font-bold text-xl mb-2">Оплата прошла!</span>
             <span className="text-[#A2A5B8] text-sm text-center mb-6">Ваша подписка успешно оформлена.</span>
             <button onClick={handleClose} className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition">
               Отлично
             </button>
          </div>
        )}

        <div className="text-[10px] text-[#6A6D82] mt-6 text-center leading-relaxed">
          Нажимая кнопку «Оплатить», вы соглашаетесь с условиями <a href="#" className="underline hover:text-white transition">лицензионного соглашения</a>.
        </div>
      </div>
    </div>
  );
}; 