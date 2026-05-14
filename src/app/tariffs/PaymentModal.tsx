"use client";
import React, { useState, useEffect } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { useUser } from '@/lib/LanguageContext';
import { ResponsiveDialog } from '@/components/modal/ResponsiveDialog';

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
  const [errorDebug, setErrorDebug] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [afterPay, setAfterPay] = useState(false);
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
    onClose();
  };

  // 2. handlePay теперь для sbp/card только создаёт заказ и paymentUrl, а не вызывает /api/pay
  const handlePay = async () => {
    setError('');
    setErrorDebug('');
    if (!payMethod) {
      setError(t.error);
      return;
    }
    const normalizedUserId = user?.id != null ? String(user.id) : '';
    if (!user || !normalizedUserId) {
      setError('Пользователь не найден');
      setErrorDebug(JSON.stringify({
        stage: 'client_precheck',
        reason: 'user_id_missing',
        user_snapshot: user || null
      }, null, 2));
      return;
    }
    const amount = currentPrice;
    const package_days = finalPackageDays;
    const order_id = `${payMethod}_${normalizedUserId}_${Date.now()}`;
    setLoading(true);
    if (payMethod === 'balance') {
      // Баланс — всё как было
      try {
        const resp = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: normalizedUserId,
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
          setUser({
            ...user,
            balance:
              typeof data.balance === "number"
                ? data.balance
                : (user.balance ?? 0) - amount
          });
        } else {
          setError(data.error || 'Ошибка оплаты');
          setErrorDebug(JSON.stringify({
            http_status: resp.status,
            response: data,
            request: {
              user_id: normalizedUserId,
              package_days,
              order_id,
              method: payMethod,
              amount
            }
          }, null, 2));
        }
      } catch (e: any) {
        setLoading(false);
        setError(e.message || 'Ошибка соединения');
        setErrorDebug(JSON.stringify({
          network_error: e?.message || 'unknown_error',
          request: {
            user_id: normalizedUserId,
            package_days,
            order_id,
            method: payMethod,
            amount
          }
        }, null, 2));
      }
      return;
    }
    // Для sbp/card — создаём заказ, получаем ссылку на оплату
    try {
      const resp = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: normalizedUserId,
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
        setErrorDebug(JSON.stringify({
          http_status: resp.status,
          response: data
        }, null, 2));
      }
    } catch (e: any) {
      setLoading(false);
      setError(e.message || 'Ошибка соединения');
      setErrorDebug(JSON.stringify({
        network_error: e?.message || 'unknown_error'
      }, null, 2));
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
    <ResponsiveDialog
      open={isOpen}
      onClose={handleClose}
      title="Оплата"
      sheetBg="#18181b"
      desktopMaxWidthClass="max-w-[440px]"
      footer={
        success ? undefined : (
          <>
            {polling && !link ? (
              <div className="flex flex-1 items-center justify-center rounded-xl bg-[#fd6a32] py-3.5 text-[15px] font-semibold text-white opacity-70 transition disabled:opacity-50">
                {t.loading}
              </div>
            ) : (
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-[#fe6125] to-[#f98055] py-3.5 text-[15px] font-bold text-white shadow-[0_4px_15px_rgba(254,97,37,0.3)] transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
                disabled={loading || currentPrice <= 0}
                onClick={() => {
                  if (user && typeof user.balance === 'number' && user.balance < currentPrice) {
                    window.location.href = '/deposit';
                  } else {
                    handlePay();
                  }
                }}
              >
                {loading ? 'Обработка...' : (
                  <span className="flex w-full items-center justify-center">
                    {(!user || (typeof user.balance === 'number' && user.balance < currentPrice))
                      ? 'Пополнить баланс'
                      : t.pay}
                  </span>
                )}
              </button>
            )}
          </>
        )
      }
    >
        <div className="flex flex-col items-center gap-5 pb-1 pt-1">
          <div className="w-full text-center text-xl font-extrabold text-white">
            {isCustom ? 'Тариф — Свои дни' : tariff === 'year' ? t.year : tariff === 'month' ? t.month : `Тариф — ${tariff}`}
          </div>

          {isCustom ? (
            <div className="my-1 flex w-full flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <span className="text-sm font-bold text-white">Укажите количество дней:</span>
              <div className="flex w-full items-center gap-3">
                <div className="flex h-12 flex-1 items-center rounded-xl border border-white/10 bg-black/40 px-4 transition-colors focus-within:border-[#fe6125]/50">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={customDays === 0 ? '' : customDays}
                    onChange={(e) => setCustomDays(Math.max(0, parseInt(e.target.value.replace(/\D/g, ''), 10) || 0))}
                    className="w-full bg-transparent text-lg font-bold text-white outline-none"
                    placeholder="Введите дни..."
                  />
                </div>
                <span className="font-bold text-[#A2A5B8]">дней</span>
              </div>
              <span className="mt-1 text-sm font-semibold text-[#fe6125]">1 день = 2.3 ₽</span>
            </div>
          ) : (
            <div className="my-4 flex w-full flex-col items-center justify-center">
              <span className="text-[44px] font-black tracking-tight text-transparent drop-shadow-[0_4px_12px_rgba(254,97,37,0.3)] bg-gradient-to-r from-[#fe6125] to-[#f98055] bg-clip-text">
                {currentPrice} ₽
              </span>
            </div>
          )}

          <div className={`w-full rounded-xl border py-3.5 text-center text-sm font-medium ${user && typeof user.balance === 'number' && user.balance < currentPrice ? 'border-red-500/20 text-red-400' : 'border-white/5 text-[#A2A5B8]'}`}>
            {user && typeof user.balance === 'number' && user.balance < currentPrice ? (
              <>Недостаточно средств. Баланс: <span className="ml-1 font-bold">{user.balance.toFixed(2)}₽</span></>
            ) : (
              <>
                Спишется с баланса:
                {user && typeof user.balance === 'number' && (
                  <span className="ml-1 font-bold text-white">{user.balance.toFixed(2)}₽</span>
                )}
              </>
            )}
          </div>
          {error && !success && (
            <div className="flex w-full flex-col gap-2">
              <div className="text-center text-sm text-red-500">{error}</div>
              {errorDebug && (
                <pre className="max-h-40 w-full overflow-auto whitespace-pre-wrap break-all rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-[10px] leading-relaxed text-red-300">
                  {errorDebug}
                </pre>
              )}
            </div>
          )}
          {success ? (
            <div className="flex w-full flex-col items-center gap-4 animate-fadeIn">
              <div className="text-center text-[15px] font-bold text-green-500">{t.success}</div>
              <div className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-black/40 p-4 shadow-inner">
                <span className="mr-4 truncate font-mono text-sm text-white/80">{link}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="whitespace-nowrap rounded-xl bg-white/10 px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-white/20 active:bg-white/10"
                >
                  {copied ? t.copied : t.copy}
                </button>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 w-full rounded-xl bg-white/5 py-3.5 font-bold text-white shadow-sm transition hover:bg-white/10"
              >
                {t.close}
              </button>
            </div>
          ) : (
            <div className="mt-1 text-center text-[11px] text-[#A2A5B8]">
              Нажимая кнопку &quot;Оплатить&quot;, вы соглашаетесь с условиями{' '}
              <a href="#" className="underline transition hover:text-white/60">
                лицензионного соглашения
              </a>
              .
            </div>
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
    </ResponsiveDialog>
  );
}; 