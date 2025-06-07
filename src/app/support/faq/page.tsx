"use client";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider, useLang } from '@/lib/LanguageContext';
import React from 'react';

const faqTexts = {
  ru: {
    title: 'Часто задаваемые вопросы',
    items: [
      {q: 'Как работает BazaraVPN?', a: 'BazaraVPN защищает вашу конфиденциальность в Интернете, скрывая ваш настоящий IP-адрес. Когда ваше виртуальное местоположение скрыто, отслеживать, ограничивать или продавать вашу онлайн-активность становится намного сложнее.'},
      {q: 'Как установить BazaraVPN?', a: 'Чтобы установить BazaraVPN, скачайте приложение для вашего устройства и следуйте нашему руководству по настройке. Затем просто войдите в свой аккаунт, и вы будете готовы к подключению.'},
      {q: 'Можно ли пользоваться бесплатно?', a: 'Да, у нас есть бесплатный пробный период и базовые функции без оплаты.'},
      {q: 'Какие устройства поддерживаются?', a: 'Windows, macOS, Android, iOS, роутеры и другие.'},
      {q: 'Можно ли смотреть Netflix и другие стриминги?', a: 'Да, BazaraVPN позволяет обходить блокировки и смотреть любые стриминговые сервисы.'},
      {q: 'Сколько устройств можно подключить?', a: 'До 5 устройств одновременно на одном аккаунте.'},
      {q: 'Как оплатить подписку?', a: 'Мы принимаем карты, криптовалюту и другие способы оплаты.'},
      {q: 'Законно ли использовать VPN?', a: 'В большинстве стран — да. Но проверьте законы вашей страны.'},
    ],
  },
  en: {
    title: 'Frequently Asked Questions',
    items: [
      {q: 'How does BazaraVPN work?', a: 'BazaraVPN protects your privacy online by hiding your real IP address. When your virtual location is hidden, it becomes much harder to track, restrict, or sell your online activity.'},
      {q: 'How to install BazaraVPN?', a: 'To install BazaraVPN, download the app for your device and follow our setup guide. Then just log in to your account and you are ready to connect.'},
      {q: 'Is it free to use?', a: 'Yes, we offer a free trial and basic features at no cost.'},
      {q: 'Which devices are supported?', a: 'Windows, macOS, Android, iOS, routers, and more.'},
      {q: 'Can I watch Netflix and other streaming services?', a: 'Yes, BazaraVPN allows you to bypass blocks and watch any streaming services.'},
      {q: 'How many devices can I connect?', a: 'Up to 5 devices simultaneously on one account.'},
      {q: 'How do I pay for a subscription?', a: 'We accept cards, cryptocurrency, and other payment methods.'},
      {q: 'Is it legal to use a VPN?', a: 'In most countries — yes. But check the laws of your country.'},
    ],
  }
};

function FaqContent() {
  const { lang } = useLang();
  const t = faqTexts[lang];
  const [open, setOpen] = React.useState<number|null>(null);
  return (
    <main className="flex-1 flex flex-col items-center pt-24 pb-16 min-h-screen bg-[#181818]">
      <h2 className="text-4xl font-extrabold text-orange-400 mb-10 text-center">{t.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {t.items.map((item, i) => (
          <div key={i} className="bg-[#232323] rounded-2xl border border-orange-700 shadow-lg">
            <button
              className="w-full flex justify-between items-center px-8 py-6 text-xl font-bold text-left text-white focus:outline-none"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {item.q}
              <span className="text-3xl text-orange-400">{open === i ? '–' : '+'}</span>
            </button>
            <div className={`px-8 pb-6 text-gray-200 text-lg transition-all duration-300 ${open === i ? '' : 'hidden'}`}>{item.a}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function FaqPage() {
  return (
    <LanguageProvider>
      <Header />
      <FaqContent />
      <Footer />
    </LanguageProvider>
  );
} 