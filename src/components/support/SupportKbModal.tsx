import React from 'react';
import { useLang } from '@/lib/LanguageContext';

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

interface SupportKbModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportKbModal: React.FC<SupportKbModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLang();
  const t = kbTexts[lang];
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-end justify-center">
      <div className="bg-[#18181b] rounded-t-3xl rounded-b-none shadow-2xl p-4 sm:p-8 md:p-12 w-full max-w-2xl relative flex flex-col gap-6 sm:gap-8 min-h-[60vh] max-h-[98vh] overflow-y-auto" style={{minWidth:0}}>
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-[#181818] hover:bg-[#2c2c2c] text-2xl text-gray-400">&times;</button>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#fd6a32] mb-4 text-center">{t.title}</h2>
        <div className="text-base md:text-lg text-gray-300 text-center mb-4">{t.desc}</div>
        {t.blocks.map((block, i) => (
          <div key={i} className="bg-[#232323] rounded-2xl border-2 border-[#fd6a32] p-6 md:p-8 mb-4 shadow-lg w-full max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-extrabold text-[#fd6a32] mb-2">{block.title}</h3>
            <div className="text-base text-gray-200 mb-2">{block.desc}</div>
            {block.list && (
              <ul className="list-disc ml-6 text-[#fd6a32]">
                {block.list.map((li, j) => <li key={j} className="text-gray-200">{li}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 