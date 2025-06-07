import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#232323] border-t border-[#333] py-6 px-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-12 text-gray-200 text-base mt-auto text-center md:text-left">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 w-full justify-center md:justify-start">
        <Link href="/contacts" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#181818] transition text-lg font-semibold">
          <img src="/assets/mail-3d.png" alt="Контакты" className="w-7 h-7" style={{objectFit:'contain'}} />
          <span>Контакты</span>
        </Link>
        <Link href="/privacy" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#181818] transition text-lg font-semibold">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 8h8v8H8z"/></svg>
          <span>Политика</span>
        </Link>
      </div>
      <div className="text-center text-lg font-medium w-full md:w-auto">© 2024 BazaraVPN</div>
      <div className="flex items-center justify-center gap-5 w-full md:w-auto mt-4 md:mt-0">
        <a href="https://t.me/bazaraVPN" className="hover:text-orange-400" aria-label="Telegram" target="_blank" rel="noopener"><img src="/assets/telegram.png" alt="Telegram" className="w-7 h-7" /></a>
        <a href="https://www.instagram.com/bazaravpn/" className="hover:text-orange-400" aria-label="Instagram" target="_blank" rel="noopener"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6"/><circle cx="12" cy="12" r="5"/><circle cx="17" cy="7" r="1.5"/></svg></a>
        <a href="https://www.youtube.com/@BazaraVPN" className="hover:text-orange-400" aria-label="YouTube" target="_blank" rel="noopener"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="4"/><polygon points="10,9 16,12 10,15" fill="currentColor"/></svg></a>
        <a href="https://www.tiktok.com/@bazaravpn1?lang=ru-RU" className="hover:text-orange-400" aria-label="TikTok" target="_blank" rel="noopener"><svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"><path d="M16.5 3a4.5 4.5 0 0 0 4.5 4.5v2A6.5 6.5 0 0 1 14.5 3h2zm-2 0v12.5a3.5 3.5 0 1 1-3.5-3.5h1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
      </div>
    </footer>
  );
} 