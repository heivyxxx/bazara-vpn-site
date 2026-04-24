"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type TabId = 'orders' | 'chats' | 'blocks' | 'balances';

interface TabDef {
  id: TabId;
  title: string;
  desc: string;
}

interface AdminUserSearchItem {
  id: string;
  telegram_id?: string | null;
  name?: string | null;
  username?: string | null;
  balance?: number | null;
}

interface AdminOrderItem {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  package_days: number;
  method: string;
  status: string;
  link?: string | null;
  created_at: string;
  error_message?: string | null;
}

const TABS: TabDef[] = [
  { id: 'orders', title: 'Заказы', desc: 'Управление заказами' },
  { id: 'chats', title: 'Чаты', desc: 'Чат с пользователями' },
  { id: 'blocks', title: 'Блокировка', desc: 'Поиск и бан пользователей' },
  { id: 'balances', title: 'Балансы', desc: 'Управление балансами' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const [search, setSearch] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [users, setUsers] = useState<AdminUserSearchItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserSearchItem | null>(null);
  const [amount, setAmount] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== 'orders') return;
    const timeout = setTimeout(async () => {
      setOrdersLoading(true);
      try {
        const url = search.trim()
          ? `/api/admin-orders?q=${encodeURIComponent(search.trim())}`
          : '/api/admin-orders';
        const res = await fetch(url);
        const data = await res.json();
        setOrders(Array.isArray(data?.orders) ? data.orders : []);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    }, 180);
    return () => clearTimeout(timeout);
  }, [activeTab, search]);

  useEffect(() => {
    if (activeTab !== 'balances') return;
    const q = userQuery.trim();
    if (!q) {
      setUsers([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setUsersLoading(true);
      try {
        const res = await fetch(`/api/admin-users-search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setUsers(Array.isArray(data?.users) ? data.users : []);
      } catch {
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    }, 180);
    return () => clearTimeout(timeout);
  }, [userQuery, activeTab]);

  const handleAdjustBalance = async (action: 'credit' | 'debit') => {
    if (!selectedUser) {
      setMessage('Сначала выберите пользователя из списка.');
      return;
    }
    const parsedAmount = Number(amount.replace(',', '.'));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setMessage('Введите корректную сумму больше 0.');
      return;
    }
    setAdjusting(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin-balance-adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser.id,
          action,
          amount: parsedAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setMessage(data?.error || 'Не удалось выполнить операцию.');
        return;
      }
      setSelectedUser((prev) => (prev ? { ...prev, balance: data.balance } : prev));
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, balance: data.balance } : u)));
      setAmount("");
      setMessage(action === 'credit' ? 'Баланс успешно начислен.' : 'Баланс успешно списан.');
    } catch {
      setMessage('Ошибка сети. Повторите попытку.');
    } finally {
      setAdjusting(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="flex flex-col gap-4 mt-6 animate-fade-in">
            <div className="flex items-center bg-[#151515] rounded-xl px-4 py-3 border border-white/5">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                type="text" 
                placeholder="Поиск по order_id / user_id / методу / статусу" 
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            </div>
            {ordersLoading ? (
              <div className="text-sm text-gray-400 px-1">Загрузка заказов...</div>
            ) : orders.length === 0 ? (
              <div className="text-sm text-gray-500 px-1">Заказов пока нет</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                {orders.map((o) => (
                  <div key={o.id} className="bg-[#151515] rounded-xl border border-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-white font-bold text-sm truncate">{o.order_id}</div>
                        <div className="text-gray-500 text-xs mt-0.5">user_id: {o.user_id}</div>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-lg whitespace-nowrap ${o.status === 'completed' ? 'bg-green-500/10 text-green-400' : o.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-white/10 text-gray-300'}`}>
                        {o.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                      <div className="text-gray-400">Сумма: <span className="text-white font-semibold">{Number(o.amount || 0).toFixed(2)} ₽</span></div>
                      <div className="text-gray-400">Дней: <span className="text-white font-semibold">{o.package_days || 0}</span></div>
                      <div className="text-gray-400">Метод: <span className="text-white font-semibold">{o.method || '—'}</span></div>
                      <div className="text-gray-400">Дата: <span className="text-white font-semibold">{new Date(o.created_at).toLocaleDateString('ru-RU')}</span></div>
                    </div>
                    {o.error_message ? (
                      <div className="mt-2 text-xs text-red-400 line-clamp-2">{o.error_message}</div>
                    ) : null}
                    {o.link ? (
                      <a href={o.link} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-[#fe6125] hover:underline">
                        Открыть ссылку подписки
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'balances':
        return (
          <div className="flex flex-col gap-4 mt-6 animate-fade-in">
            <div className="relative">
              <div className="flex items-center bg-[#151515] rounded-xl px-4 py-3 border border-[#fe6125]/60">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => {
                    setUserQuery(e.target.value);
                    setMessage('');
                  }}
                  placeholder="Поиск по username/name/telegram_id"
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500"
                />
              </div>
              {userQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-[110%] z-20 bg-[#141418] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                  {usersLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-400">Поиск...</div>
                  ) : users.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">Ничего не найдено</div>
                  ) : (
                    users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setSelectedUser(u);
                          setUserQuery(u.username ? `@${u.username}` : (u.name || u.id));
                          setUsers([]);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-white/5 border-b border-white/5 last:border-0"
                      >
                        <div className="text-sm text-white font-semibold">{u.name || 'Без имени'} {u.username ? <span className="text-gray-400 font-normal">@{u.username}</span> : null}</div>
                        <div className="text-xs text-gray-500 mt-0.5">ID: {u.id} | Баланс: {Number(u.balance || 0).toFixed(2)} ₽</div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="bg-[#151515] rounded-xl px-4 py-3 border border-white/5">
              <div className="text-gray-400 text-sm mb-1">Сумма</div>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Введите сумму"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ''))}
                className="w-full bg-transparent outline-none text-white text-lg font-semibold placeholder:text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={adjusting}
                onClick={() => handleAdjustBalance('credit')}
                className="bg-[#fe6125] hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-2xl font-bold text-lg transition"
              >
                Начислить
              </button>
              <button
                disabled={adjusting}
                onClick={() => handleAdjustBalance('debit')}
                className="bg-[#22242d] hover:bg-[#2b2e39] disabled:opacity-50 text-white py-3 rounded-2xl font-bold text-lg transition border border-white/10"
              >
                Списать
              </button>
            </div>

            {selectedUser && (
              <div className="text-sm text-gray-300">
                Выбран: <span className="text-white font-semibold">{selectedUser.name || selectedUser.id}</span>{' '}
                <span className="text-gray-500">({selectedUser.username ? `@${selectedUser.username}` : selectedUser.id})</span> | Баланс:{' '}
                <span className="text-[#fe6125] font-bold">{Number(selectedUser.balance || 0).toFixed(2)} ₽</span>
              </div>
            )}
            {message && <div className="text-sm text-gray-300">{message}</div>}
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
      <div className="flex items-center px-4 py-4 border-b border-white/5 bg-[#0A0A0F] sticky top-0 z-40">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
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