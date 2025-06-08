"use client";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider, useLang } from '@/lib/LanguageContext';
import Image from 'next/image';
import React from 'react';

const contactsTexts = {
  ru: {
    title: 'Контакты',
    desc: 'Возникли вопросы, нужна помощь или совет?\nНапишите нам — наш саппорт всегда готов помочь!',
    mail: 'Эл. почта',
    mailValue: 'support@bazara.ru',
    tg: 'Телеграм',
    tgValue: '@bazaravpn',
    office: 'Офис',
    officeValue: 'Мы в облаке. Наш офис — это защищённые сервера и стабильный онлайн.',
    btn: 'Связаться',
  },
  en: {
    title: 'Contacts',
    desc: 'Have questions, need help or advice?\nWrite to us — our support is always ready to help!',
    mail: 'Email',
    mailValue: 'support@bazara.ru',
    tg: 'Telegram',
    tgValue: '@bazaravpn',
    office: 'Office',
    officeValue: 'We are in the cloud. Our office is secure servers and stable online presence.',
    btn: 'Contact us',
  }
};

function ContactsContent() {
  const { lang } = useLang();
  const t = contactsTexts[lang];
  return (
    <main className="flex-1 flex flex-col pt-28 items-center w-full min-h-screen bg-[#181818]">
      <Image src="/assets/telephon.png" alt="Телефон" width={288} height={288} className="w-72 h-72 mx-auto mb-8 select-none pointer-events-none" draggable={false} />
      <div className="text-lg md:text-xl text-[#A0A0A0] mb-12 text-center max-w-2xl font-medium whitespace-pre-line">{t.desc}</div>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-5xl justify-center items-stretch mb-8 md:mb-12 px-2">
        <div className="flex-1 bg-[#232323] rounded-2xl shadow-xl flex flex-col items-center py-6 md:py-12 px-4 md:px-6 min-w-[180px] md:min-w-[240px]">
          <Image src="/assets/mail-3d.png" alt="Почта" width={72} height={72} className="w-16 h-16 md:w-32 md:h-32 mb-4 md:mb-5 select-none pointer-events-none" draggable={false} />
          <div className="font-bold text-lg md:text-2xl mb-2 text-center">{t.mail}</div>
          <div className="text-sm md:text-base text-[#ff8800] font-semibold mb-1 text-center">{t.mailValue}</div>
        </div>
        <div className="flex-1 bg-[#232323] rounded-2xl shadow-xl flex flex-col items-center py-6 md:py-12 px-4 md:px-6 min-w-[180px] md:min-w-[240px]">
          <Image src="/assets/telegram.png" alt="Telegram" width={72} height={72} className="w-16 h-16 md:w-32 md:h-32 mb-4 md:mb-5 select-none pointer-events-none" draggable={false} />
          <div className="font-bold text-lg md:text-2xl mb-2 text-center">{t.tg}</div>
          <div className="text-sm md:text-base text-[#ff8800] font-semibold mb-1 text-center">{t.tgValue}</div>
        </div>
        <div className="flex-1 bg-[#232323] rounded-2xl shadow-xl flex flex-col items-center py-6 md:py-12 px-4 md:px-6 min-w-[180px] md:min-w-[240px]">
          <Image src="/assets/ofis.png" alt="Офис" width={72} height={72} className="w-16 h-16 md:w-32 md:h-32 mb-4 md:mb-5 select-none pointer-events-none" draggable={false} />
          <div className="font-bold text-lg md:text-2xl mb-2 text-center">{t.office}</div>
          <div className="text-sm md:text-base text-[#ff8800] font-semibold mb-1 text-center">{t.officeValue}</div>
        </div>
      </div>
      <button className="mt-2 w-full max-w-xs py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg text-white shadow-lg transition-all duration-200 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 mb-8 md:mb-10 opacity-60 cursor-not-allowed">{t.btn}</button>
    </main>
  );
}

export default function ContactsPage() {
  return (
    <LanguageProvider>
      <Header />
      <ContactsContent />
      <Footer />
    </LanguageProvider>
  );
} 