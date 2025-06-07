"use client";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider, useLang } from '@/lib/LanguageContext';
import React from 'react';

const kbTexts = {
  ru: {
    title: 'База знаний BazaraVPN',
    desc: 'Добро пожаловать в базу знаний BazaraVPN! Здесь вы найдёте инструкции, советы по безопасности, ответы на вопросы и полезные статьи о нашем сервисе.',
    blocks: [
      {title: 'Обзор BazaraVPN', desc: 'BazaraVPN — это современный VPN-сервис для защиты ваших данных, обхода блокировок и анонимности в интернете. Мы предлагаем приложения для всех популярных платформ, высокую скорость и надёжную поддержку.'},
      {title: 'Установка и настройка', desc: 'Скачайте приложение BazaraVPN для вашей платформы (Windows, macOS, Android, iOS, Linux) с официального сайта. Следуйте простым шагам мастера установки, войдите в аккаунт и подключитесь к серверу одним кликом.', list: ['Поддержка всех популярных устройств','Пошаговые инструкции внутри приложения','Автоматическое подключение при запуске']},
      {title: 'Безопасность и анонимность', desc: 'Ваши данные защищены современным шифрованием. Мы не храним логи, не отслеживаем активность и не передаём информацию третьим лицам. Используйте VPN для анонимного и безопасного доступа к интернету.', list: ['Сильное шифрование трафика','Скрытие реального IP-адреса','Защита в публичных Wi-Fi сетях']},
      {title: 'Тарифы и оплата', desc: 'Выберите подходящий тариф: бесплатный с базовыми возможностями или премиум с максимальной скоростью и расширенными функциями. Оплата возможна картой, криптовалютой и другими способами.', list: ['Гибкая система тарифов','Безопасная оплата','Пробный период для новых пользователей']},
      {title: 'Техническая поддержка', desc: 'Если возникли вопросы или проблемы — наша команда поддержки всегда готова помочь. Напишите нам через чат на сайте или по email, и мы быстро решим ваш вопрос.', list: ['Круглосуточная поддержка','Ответы на email и в чате','Быстрая помощь по любым вопросам']},
    ],
  },
  en: {
    title: 'BazaraVPN Knowledge Base',
    desc: 'Welcome to the BazaraVPN knowledge base! Here you will find instructions, security tips, answers to questions, and useful articles about our service.',
    blocks: [
      {title: 'BazaraVPN Overview', desc: 'BazaraVPN is a modern VPN service for protecting your data, bypassing blocks, and anonymity online. We offer apps for all popular platforms, high speed, and reliable support.'},
      {title: 'Installation and Setup', desc: 'Download the BazaraVPN app for your platform (Windows, macOS, Android, iOS, Linux) from the official website. Follow the simple setup steps, log in to your account, and connect to a server with one click.', list: ['Support for all popular devices','Step-by-step instructions in the app','Automatic connection on startup']},
      {title: 'Security and Anonymity', desc: 'Your data is protected with modern encryption. We do not store logs, track activity, or share information with third parties. Use VPN for anonymous and secure internet access.', list: ['Strong traffic encryption','Hiding real IP address','Protection in public Wi-Fi networks']},
      {title: 'Tariffs and Payment', desc: 'Choose the right plan: free with basic features or premium with maximum speed and advanced features. Payment is possible by card, cryptocurrency, and other methods.', list: ['Flexible tariff system','Secure payment','Trial period for new users']},
      {title: 'Technical Support', desc: 'If you have questions or problems — our support team is always ready to help. Write to us via chat on the site or by email, and we will quickly solve your issue.', list: ['24/7 support','Answers by email and chat','Fast help with any questions']},
    ],
  }
};

function KbContent() {
  const { lang } = useLang();
  const t = kbTexts[lang];
  return (
    <main className="flex-1 flex flex-col items-center pt-24 pb-16 min-h-screen bg-[#181818]">
      <h2 className="text-4xl font-extrabold text-orange-400 mb-10 text-center">{t.title}</h2>
      <div className="text-lg mb-10 text-gray-300 text-center max-w-2xl">{t.desc}</div>
      {t.blocks.map((block, i) => (
        <div key={i} className="bg-[#232323] rounded-2xl border-2 border-orange-500 p-10 mb-10 shadow-lg w-full max-w-2xl">
          <h3 className="text-2xl font-extrabold text-orange-400 mb-4">{block.title}</h3>
          <div className="text-base text-gray-200 mb-4">{block.desc}</div>
          {block.list && (
            <ul className="list-disc ml-6 text-orange-400">
              {block.list.map((li, j) => <li key={j} className="text-gray-200">{li}</li>)}
            </ul>
          )}
        </div>
      ))}
    </main>
  );
}

export default function KbPage() {
  return (
    <LanguageProvider>
      <Header />
      <KbContent />
      <Footer />
    </LanguageProvider>
  );
} 