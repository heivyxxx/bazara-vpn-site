"use client";

import React, { useState } from "react";
import Link from "next/link";

type TabId = 'orders' | 'moderation' | 'invoices' | 'maintenance' | 'keyboard' | 'products' | 'chats' | 'blocks' | 'balances' | 'vibrations' | 'users';

interface TabDef {
  id: TabId;
  title: string;
  desc: string;
}

const TABS: TabDef[] = [
  { id: 'orders', title: 'Заказы', desc: 'Управление заказами' },
  { id: 'chats', title: 'Чаты', desc: 'Чат с пользователями' },
  { id: 'moderation', title: 'Модерация', desc: 'Модерация товаров' },
  { id: 'blocks', title: 'Блокировка', desc: 'Поиск и бан пользователей' },
  { id: 'invoices', title: 'Инвойсы', desc: 'Управление инвойсами' },
  { id: 'balances', title: 'Балансы', desc: 'Управление балансами' },
  { id: 'maintenance', title: 'Техработы', desc: 'Экран отключения' },
  { id: 'vibrations', title: 'Вибрации', desc: 'Тест типов вибрации' },
  { id: 'keyboard', title: 'Клавиатура', desc: 'Тест поведения на iPhone' },
  { id: 'users', title: 'Кастом пользователей', desc: 'Модерация, комиссия, сделки' },
  { id: 'products', title: 'Товары', desc: 'Поиск и удаление' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const [search, setSearch] = useState("");

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="flex flex-col gap-4 mt-6 animate-fade-in">
            <div className="flex items-center bg-[#151515] rounded-xl px-4 py-3 border border-white/5">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                type="text" 
                placeholder="Поиск по названию" 
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            </div>
            
            {/* Example Orders Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="bg-[#151515] rounded-xl flex flex-col overflow-hidden border border-white/5 relative group cursor-pointer hover:border-white/10 transition-colors">
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-[10px] font-bold">T</div>
                       <div className="text-xs font-bold truncate">telegram <span className="font-normal text-gray-400">звезды</span></div>
                    </div>
                    <div className="bg-[#2a2a2a] h-20 rounded-lg flex items-center justify-center mb-2">
                      <span className="font-black text-2xl italic tracking-tighter shadow-sm text-white">50 STARS</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400 font-bold text-sm">73 ₽</span>
                      <span className="text-gray-500 text-xs line-through">164 ₽</span>
                    </div>
                    <div className="text-[10px] font-bold leading-tight mb-2 uppercase">★ 50 STARS | АВТО-ВЫДАЧА | ПО</div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white">S</div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-green-500 font-bold">Завершён</span>
                          <span className="text-[9px] text-gray-400 truncate w-12">User</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-[#1e1e1e] hover:bg-[#252525] py-2.5 text-xs font-bold border-t border-white/5 transition-colors">
                    Чат сделки
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="p-10 flex items-center justify-center text-gray-500">
            Контент вкладки "{TABS.find(t => t.id === activeTab)?.title}" в разработке
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0F] pt-[env(safe-area-inset-top,0px)] pb-16">
      {/* Admin Header */}
      <div className="flex items-center px-4 py-4 border-b border-white/5 bg-[#0A0A0F] sticky top-0 z-40">
        <Link href="/" className="mr-4 text-gray-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </Link>
        <h1 className="text-xl font-bold text-white flex-1">Bazara Admin</h1>
        <button className="text-gray-400 hover:text-white mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
        </button>
        <Link href="/" className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </Link>
      </div>

      <div className="p-4">
        {/* Tabs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {TABS.map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-start px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#fe6125] text-white shadow-lg' 
                    : 'bg-[#1e1e1e] hover:bg-[#252525] text-gray-300 border border-white/5'
                }`}
             >
                <div className="text-sm font-bold mb-0.5">{tab.title}</div>
                <div className={`text-[10px] ${activeTab === tab.id ? 'text-white/80' : 'text-gray-500'}`}>{tab.desc}</div>
             </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="border-t border-white/5 pt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}