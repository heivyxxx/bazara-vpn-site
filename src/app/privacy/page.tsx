"use client";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider, useLang } from '@/lib/LanguageContext';
import React from 'react';

const privacyTexts = {
  ru: {
    title: 'Политика конфиденциальности BazaraVPN',
    sections: [
      { title: '1. Общие положения', text: 'BazaraVPN создан для вашей свободы, анонимности и безопасности. Мы не собираем и не храним логи вашей активности. Ваша приватность — наш главный приоритет.' },
      { title: '2. Минимум данных', text: 'Для работы сервиса мы не требуем регистрации, не запрашиваем личные данные и не отслеживаем ваши действия. Для авторизации используется только Telegram ID, который не раскрывает вашу личность.' },
      { title: '3. Отсутствие логов', text: 'Мы не ведём журналы подключений, не отслеживаем IP-адреса, не сохраняем историю посещённых сайтов и не анализируем ваш трафик. Всё, что вы делаете с BazaraVPN, остаётся только между вами и интернетом.' },
      { title: '4. Безопасность', text: 'Весь трафик шифруется современными протоколами. Мы защищаем ваши данные от третьих лиц, провайдеров и злоумышленников.' },
      { title: '5. Cookies и аналитика', text: 'Мы не используем сторонние трекеры, рекламные сети и не внедряем куки для отслеживания. Минимальные технические cookies используются только для работы сайта и не содержат персональных данных.' },
      { title: '6. Обратная связь', text: 'Если у вас есть вопросы по приватности — напишите нам на support@bazaravpn.com или в Telegram.' },
      { title: '7. Изменения политики', text: 'Мы можем обновлять эту политику для повышения вашей безопасности. Все изменения будут опубликованы на этой странице.' },
    ],
  },
  en: {
    title: 'BazaraVPN Privacy Policy',
    sections: [
      { title: '1. General Provisions', text: 'BazaraVPN is created for your freedom, anonymity, and security. We do not collect or store logs of your activity. Your privacy is our top priority.' },
      { title: '2. Minimum Data', text: 'To use the service, we do not require registration, do not request personal data, and do not track your actions. Only Telegram ID is used for authorization, which does not reveal your identity.' },
      { title: '3. No Logs', text: 'We do not keep connection logs, do not track IP addresses, do not save browsing history, and do not analyze your traffic. Everything you do with BazaraVPN stays only between you and the internet.' },
      { title: '4. Security', text: 'All traffic is encrypted with modern protocols. We protect your data from third parties, providers, and attackers.' },
      { title: '5. Cookies and Analytics', text: 'We do not use third-party trackers, ad networks, or tracking cookies. Minimal technical cookies are used only for site operation and do not contain personal data.' },
      { title: '6. Feedback', text: 'If you have privacy questions — write to us at support@bazaravpn.com or in Telegram.' },
      { title: '7. Policy Changes', text: 'We may update this policy to improve your security. All changes will be published on this page.' },
    ],
  }
};

function PrivacyContent() {
  const { lang } = useLang();
  const t = privacyTexts[lang];
  return (
    <main className="flex-1 flex flex-col pt-24 items-center w-full min-h-screen bg-[#181818]">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent" style={{WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>{t.title}</h1>
      <div className="bg-[#232323] rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full mb-12">
        {t.sections.map((s, i) => (
          <div className="mb-8 last:mb-0" key={i}>
            <div className="text-xl font-bold mb-2 text-orange-400">{s.title}</div>
            <div className="text-base text-gray-200 leading-relaxed whitespace-pre-line">{s.text}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function PrivacyPage() {
  return (
    <LanguageProvider>
      <Header />
      <PrivacyContent />
      <Footer />
    </LanguageProvider>
  );
} 