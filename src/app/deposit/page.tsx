'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

const paymentTexts = {
  ru: {
    title: 'Пополнение баланса',
    choose: 'Выберите способ оплаты',
    sbp: 'СБП',
    card: 'Карта',
    crypto: 'Крипта',
    amount: 'Сумма (₽)',
    pay: 'Оплатить',
    success: 'Баланс успешно пополнен!',
    error: 'Ошибка оплаты. Попробуйте ещё раз.',
    min: 'Минимум 50₽',
    max: 'Максимум 10000₽',
    enterAmount: 'Введите сумму',
  },
  en: {
    title: 'Top up balance',
    choose: 'Choose payment method',
    sbp: 'SBP',
    card: 'Card',
    crypto: 'Crypto',
    amount: 'Amount (₽)',
    pay: 'Pay',
    success: 'Balance topped up!',
    error: 'Payment error. Try again.',
    min: 'Minimum 50₽',
    max: 'Maximum 10000₽',
    enterAmount: 'Enter amount',
  }
};

export default function DepositPage() {
  const [user, setUser] = useUser();
  const lang = typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'ru') : 'ru';
  const t = paymentTexts[lang as 'ru' | 'en'];
  const [payMethod, setPayMethod] = useState<'sbp' | 'card' | 'crypto' | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const minAmount = 50;
  const maxAmount = 10000;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(() => {
        window.history.back();
      });
    }
    // Скрыть Header
    const style = document.createElement('style');
    style.innerHTML = `header, .Header, .header { display: none !important; }`;
    style.setAttribute('data-hide-header', '1');
    document.head.appendChild(style);
    return () => {
      if (window.Telegram?.WebApp?.BackButton) {
        window.Telegram.WebApp.BackButton.hide();
      }
      const s = document.querySelector('style[data-hide-header="1"]');
      if (s) s.remove();
    };
  }, []);

  const handlePay = async () => {
    setError('');
    setSuccess(false);
    const numAmount = Number(amount);
    if (!payMethod) { setError(t.choose); return; }
    if (!numAmount || numAmount < minAmount) { setError(t.min); return; }
    if (numAmount > maxAmount) { setError(t.max); return; }
    setLoading(true);
    try {
      const order_id = 'deposit_' + Date.now();
      const description = 'Пополнение баланса';
      const requestBody = {
        amount: numAmount,
        order_id,
        description,
        method: payMethod
      };
      const resp = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      const data = await resp.json();
      setLoading(false);
      if (data && data.url) {
        // Ожидаем успешной оплаты через afterpay (как на тарифах)
        if (typeof window !== 'undefined') {
          localStorage.setItem('pay_package_days', '0');
          localStorage.setItem('pay_task_id', order_id);
        }
        window.open(data.url, '_blank');
        // Ждём подтверждения оплаты (polling или ручное обновление)
        // Для MVP — просто покажем успех и обновим баланс через Supabase
        setSuccess(true);
        // Пополняем баланс в Supabase
        if (user?.id) {
          await supabase.from('users').update({ balance: (user.balance || 0) + numAmount }).eq('id', user.id);
          setUser({ ...user, balance: (user.balance || 0) + numAmount });
          // Записываем транзакцию
          await supabase.from('transactions').insert({
            user_id: user.id,
            amount: numAmount,
            type: 'deposit',
            meta: { method: payMethod },
          });
        }
      } else {
        setError(data.error || t.error);
      }
    } catch (e: any) {
      setLoading(false);
      setError(e.message || t.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white px-4 pt-8 pb-8">
      {/* Сверху: аватар, ник, баланс */}
      <div className="flex flex-col items-center mb-8 w-full">
        <Image
          src={user?.avatar || '/assets/avatar1.png'}
          alt="avatar"
          width={96}
          height={96}
          className="rounded-2xl w-24 h-24 object-cover border-4 border-[#232323] mb-3"
        />
        <div className="text-2xl font-bold text-white mb-1">{user?.name || user?.username || '—'}</div>
        <div className="text-lg font-semibold text-[#fd6a32] flex items-center gap-2 mb-1">
          {typeof user?.balance === 'number' ? user.balance.toFixed(2) : '—'}
          <span className="text-gray-400 text-base font-normal">RUB</span>
        </div>
      </div>
      {/* Выберите способ оплаты */}
      <div className="text-center text-white text-xl font-bold mb-4">{t.choose}</div>
      <div className="flex flex-row gap-4 w-full max-w-md mb-6 justify-center">
        <button type="button" onClick={()=>setPayMethod('sbp')} className={`flex-1 py-3 rounded-xl font-semibold text-base transition ${payMethod==='sbp' ? 'bg-[#fd6a32] text-white' : 'bg-[#232323] text-[#fd6a32]'} border border-[#fd6a32]`}>{t.sbp}</button>
        <button type="button" onClick={()=>setPayMethod('card')} className={`flex-1 py-3 rounded-xl font-semibold text-base transition ${payMethod==='card' ? 'bg-[#fd6a32] text-white' : 'bg-[#232323] text-[#fd6a32]'} border border-[#fd6a32]`}>{t.card}</button>
        {/* <button type="button" onClick={()=>setPayMethod('crypto')} className={`flex-1 py-3 rounded-xl font-semibold text-base transition ${payMethod==='crypto' ? 'bg-[#fd6a32] text-white' : 'bg-[#232323] text-[#fd6a32]'} border border-[#fd6a32]`}>{t.crypto}</button> */}
      </div>
      {/* Ввод суммы */}
      {payMethod && (
        <div className="w-full max-w-md flex flex-col items-center mb-4">
          <input
            type="number"
            min={minAmount}
            max={maxAmount}
            step="1"
            className="w-full px-4 py-3 rounded-xl bg-[#18181b] text-white text-base border-none outline-none mb-2"
            placeholder={t.amount}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            disabled={loading}
          />
          <button
            className="w-full py-3 rounded-xl bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-semibold text-base transition disabled:opacity-60"
            onClick={handlePay}
            disabled={loading || !amount || Number(amount) < minAmount || Number(amount) > maxAmount}
          >
            {loading ? '...' : t.pay}
          </button>
        </div>
      )}
      {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
      {success && <div className="text-green-400 text-base text-center mb-2">{t.success}</div>}
    </div>
  );
} 