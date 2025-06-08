"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/LanguageContext';

const footerTexts = {
  ru: {
    contacts: 'Контакты',
    privacy: 'Политика',
    copyright: '© 2024 BazaraVPN',
    footerSupport: 'Поддержка',
  },
  en: {
    contacts: 'Contacts',
    privacy: 'Privacy',
    copyright: '© 2024 BazaraVPN',
    footerSupport: 'Support',
  },
};

export const Footer = () => {
  const { lang } = useLang();
  const t = footerTexts[lang];
  return (
    <footer className="w-full bg-[#232323] border-t border-[#333] py-6 px-4 flex flex-col items-center justify-center gap-6 text-gray-200 text-base mt-auto text-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
        <Link href="/contacts" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#181818] transition text-lg font-semibold w-full md:w-auto justify-center">
          <Image src="/assets/mail-3d.png" alt={t.contacts} width={28} height={28} className="w-7 h-7 object-contain" />
          <span>{t.contacts}</span>
        </Link>
        <Link href="/privacy" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#181818] transition text-lg font-semibold w-full md:w-auto justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 8h8v8H8z"/></svg>
          <span>{t.privacy}</span>
        </Link>
        <div className="text-center text-lg font-medium w-full md:w-auto">{t.copyright}</div>
        <div className="flex items-center gap-5 mt-4 md:mt-0 w-full md:w-auto justify-center">
          <a href="https://t.me/bazaraVPN" className="hover:text-orange-400" aria-label="Telegram" target="_blank" rel="noopener">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 4L12 20l-3-7-7-3z"/></svg>
          </a>
          <a href="https://www.instagram.com/bazaravpn/" className="hover:text-orange-400" aria-label="Instagram" target="_blank" rel="noopener">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6"/><circle cx="12" cy="12" r="5"/><circle cx="17" cy="7" r="1.5"/></svg>
          </a>
          <a href="https://www.youtube.com/@BazaraVPN" className="hover:text-orange-400" aria-label="YouTube" target="_blank" rel="noopener">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="4"/><polygon points="10,9 16,12 10,15" fill="currentColor"/></svg>
          </a>
          <a href="https://www.tiktok.com/@bazaravpn1?lang=ru-RU" className="hover:text-orange-400" aria-label="TikTok" target="_blank" rel="noopener">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"><path d="M16.5 3a4.5 4.5 0 0 0 4.5 4.5v2A6.5 6.5 0 0 1 14.5 3h2zm-2 0v12.5a3.5 3.5 0 1 1-3.5-3.5h1.5" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 700px) {
          .flex-col.md\:flex-row { flex-direction: column !important; }
          .w-full.md\:w-auto { width: 100% !important; }
          .justify-center { justify-content: center !important; }
          .gap-8 { gap: 1.2rem !important; }
        }
      `}</style>
    </footer>
  );
}; 