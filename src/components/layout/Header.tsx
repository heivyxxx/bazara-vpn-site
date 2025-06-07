"use client";

import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-lg border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/assets/logo.png" 
            alt="BazaraVPN" 
            width={40} 
            height={40} 
            className="w-10 h-10"
          />
          <span className="text-2xl font-bold text-white">
            BazaraVPN
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/pricing" 
            className="text-white hover:text-orange-400 transition"
          >
            Цены
          </Link>
          <Link 
            href="/reviews" 
            className="text-white hover:text-orange-400 transition"
          >
            Отзывы
          </Link>
          <Link 
            href="/support" 
            className="text-white hover:text-orange-400 transition"
          >
            Поддержка
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-white hover:text-orange-400 transition hidden md:block"
          >
            Войти
          </Link>
          <Link 
            href="/download" 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition"
          >
            Скачать
          </Link>
        </div>
      </div>
    </header>
  );
}; 