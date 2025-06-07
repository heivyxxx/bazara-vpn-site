"use client";

import Link from 'next/link';

interface DownloadItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
}

const DownloadItem = ({ href, icon, text }: DownloadItemProps) => (
  <Link 
    href={href}
    className="flex items-center gap-3 text-white text-xl font-semibold hover:text-orange-400 transition"
  >
    <span className="inline-block w-7 h-7">
      {icon}
    </span>
    {text}
  </Link>
);

export const DownloadMenu = () => {
  const downloadItems = [
    {
      href: "/install-windows",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      text: "Windows"
    },
    {
      href: "/install-macos",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M16 13c2.667-2.667 2.667-7 0-9-2.667-2.667-7-2.667-9 0-2.667 2.667-2.667 7 0 9 2.667 2.667 7 2.667 9 0z"/>
          <path d="M12 12v7"/>
        </svg>
      ),
      text: "macOS"
    },
    {
      href: "/install-linux",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 16c1.333-2 6.667-2 8 0"/>
        </svg>
      ),
      text: "Linux"
    },
    {
      href: "/install-android",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="4" y="8" width="16" height="12" rx="2"/>
          <path d="M8 8V6a4 4 0 0 1 8 0v2"/>
        </svg>
      ),
      text: "Android"
    },
    {
      href: "/install-ios",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="6" y="2" width="12" height="20" rx="4"/>
          <circle cx="12" cy="18" r="1"/>
        </svg>
      ),
      text: "iPhone / iPad"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-[#232323] rounded-2xl shadow-lg border border-orange-700 max-w-3xl mx-auto">
      {downloadItems.map((item, index) => (
        <DownloadItem
          key={index}
          href={item.href}
          icon={item.icon}
          text={item.text}
        />
      ))}
    </div>
  );
}; 