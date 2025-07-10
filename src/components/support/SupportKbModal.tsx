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
  const [closing, setClosing] = React.useState(false);
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  };
  if (!isOpen && !closing) return null;
  return (
    <div className="fixed inset-0 z-[9999] w-full h-full bg-black/80 flex items-end justify-center">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className={`relative w-full bg-[#18181b] rounded-t-3xl flex flex-col animate-fadeInUp ${closing ? 'animate-slideOutDown' : 'animate-slideInUp'}`}
        style={{ minHeight: '30vh', maxHeight: '65vh', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
      >
        <div className="flex flex-row items-center justify-between px-6 pt-6 pb-2 sticky top-0 z-10 bg-[#18181b] rounded-t-3xl">
          <span className="text-white font-bold text-lg w-full text-center">{t.title}</span>
          <button
            onClick={handleClose}
            className="text-zinc-400 text-2xl p-1 rounded-full ml-2 absolute right-6 top-6"
            aria-label="Закрыть"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="flex flex-col items-center px-6 pb-6 pt-2 gap-6 overflow-y-auto">
          <div className="text-base md:text-lg text-gray-100 text-left w-full max-w-2xl mx-auto mb-2">{t.desc}</div>
          <div className="w-full max-w-2xl mx-auto text-left">
            {t.blocks.map((block, i) => (
              <div key={i} className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{block.title}</h3>
                <div className="text-base text-gray-100 mb-2">{block.desc}</div>
                {block.list && (
                  <ul className="list-disc ml-6 text-gray-100">
                    {block.list.map((li, j) => <li key={j}>{li}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 