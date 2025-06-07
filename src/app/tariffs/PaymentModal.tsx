import React, { useState, useEffect } from 'react';
import { useLang } from '@/lib/LanguageContext';

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
  const [payMethod, setPayMethod] = useState<'sbp' | 'card' | 'crypto' | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [afterPay, setAfterPay] = useState(false);

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

  if (!isOpen) return null;

  const handlePay = async () => {
    setError('');
    if (!payMethod || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError(t.error);
      return;
    }
    setLoading(true);
    try {
      const amount = tariff === 'year' ? (lang === 'ru' ? 2290 : 2290) : (lang === 'ru' ? 399 : 399);
      const package_days = tariff === 'year' ? 365 : 30;
      const order_id = 'bazara_' + Math.floor(Math.random()*1000000);
      const description = tariff === 'year' ? t.year : t.month;
      const resp = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          order_id,
          description,
          method: payMethod,
          email,
          package_days
        })
      });
      const data = await resp.json();
      setLoading(false);
      if (data && data.url) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('pay_email', email);
          localStorage.setItem('pay_package_days', String(package_days));
          localStorage.setItem('pay_task_id', order_id);
        }
        window.open(data.url, '_blank');
        setSuccess(true);
        setLink('');
      } else {
        setError(data.error || 'Ошибка оплаты');
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
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-[#232323] rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-2xl relative flex flex-col gap-8 animate-fade-in" style={{minWidth:340, minHeight:340}}>
        <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-[#181818] hover:bg-[#2c2c2c] text-2xl text-gray-400">&times;</button>
        {!afterPay ? (
          <>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-full bg-[#181818] flex items-center justify-center text-2xl font-bold text-orange-500">BV</div>
              <div>
                <div className="font-bold text-lg text-white">{t.account}</div>
                <div className="text-gray-400 text-sm">user@bazaravpn.ru</div>
              </div>
            </div>
            <div className="font-extrabold text-2xl text-white mb-2">{tariff === 'year' ? t.year : t.month}</div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 bg-[#181818] rounded-xl px-5 py-4 text-lg text-white font-semibold shadow">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path d="M12 3C17 5 21 5 21 10C21 19 12 21 12 21C12 21 3 19 3 10C3 5 7 5 12 3Z"/></svg>
                <span>{t.feature1}</span>
              </div>
              <div className="flex items-center gap-3 bg-[#181818] rounded-xl px-5 py-4 text-lg text-white font-semibold shadow">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path d="M12 6v12M6 12h12"/></svg>
                <span>{t.feature2}</span>
              </div>
              <div className="flex items-center gap-3 bg-[#181818] rounded-xl px-5 py-4 text-lg text-white font-semibold shadow">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M8 21h8"/></svg>
                <span>{t.feature3}</span>
              </div>
              <div className="flex items-center gap-3 bg-[#181818] rounded-xl px-5 py-4 text-lg text-white font-semibold shadow">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12l2.5 2.5L16 9"/></svg>
                <span>{t.feature4}</span>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className={`flex-1 pay-method ${payMethod==='sbp'?'selected':''}`} onClick={()=>setPayMethod('sbp')}>{t.sbp}</div>
              <div className={`flex-1 pay-method ${payMethod==='card'?'selected':''}`} onClick={()=>setPayMethod('card')}>{t.card}</div>
              <div className={`flex-1 pay-method ${payMethod==='crypto'?'selected':''}`} onClick={()=>setPayMethod('crypto')}>{t.crypto}</div>
            </div>
            <div className="mb-4 w-full">
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder={t.email} className="w-full max-w-xs mx-auto rounded-lg px-4 py-3 text-base text-white font-semibold bg-[#181818] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" style={{marginBottom:8, display:'block'}} />
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button onClick={handlePay} className="relative w-full py-4 rounded-xl font-bold text-lg text-white bg-[#444] flex justify-center items-center px-8 hover:bg-orange-500 transition-colors duration-200 cursor-pointer" disabled={loading}>
              {loading ? t.loading : <span className="mx-auto">{t.pay}</span>}
              <span className="absolute right-8">{price}</span>
            </button>
            <div className="text-xs text-gray-400 mt-2">{t.agree}</div>
            {success && (
              <div className="flex flex-col items-center gap-4 mt-6">
                <div className="text-lg text-white text-center">После оплаты вернитесь на сайт — ссылка на подписку появится автоматически.</div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 mt-6">
            {loading ? (
              <div className="text-2xl font-extrabold text-white mb-3 text-center">Генерация вашей подписки...</div>
            ) : link ? (
              <>
                <div className="text-2xl font-extrabold text-white mb-3 text-center">{t.success}</div>
                <div className="bg-[#232323] rounded-xl px-6 py-4 text-white font-mono text-lg mb-4 select-all text-center" style={{wordBreak:'break-all', maxWidth:'100%'}}>{link}</div>
                <button onClick={handleCopy} className="w-full max-w-xs bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold rounded-xl px-8 py-4 text-xl shadow hover:scale-105 transition-transform mb-2">{copied ? t.copied : t.copy}</button>
                <button onClick={onClose} className="w-full max-w-xs bg-[#444] text-white font-semibold rounded-xl px-8 py-4 text-xl shadow hover:bg-[#222] transition mb-2">{t.close}</button>
              </>
            ) : (
              <>
                {error && <div className="text-red-500 text-center text-lg mb-2">{error}</div>}
                <button onClick={onClose} className="w-full max-w-xs bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold rounded-xl px-8 py-4 text-xl shadow hover:scale-105 transition-transform mb-2">{t.close}</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 