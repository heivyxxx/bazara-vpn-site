"use client";
import React, { useState } from 'react';

// Заглушка для списка рефералов (заменить на реальный fetch из БД)
const initialLinks = [
  { name: 'booster', url: 'https://bazara-vpn-site.vercel.app/?ref=booster', count: 12 },
  { name: 'test', url: 'https://bazara-vpn-site.vercel.app/?ref=test', count: 3 },
];

export default function ReferralsPage() {
  const [links, setLinks] = useState(initialLinks);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (!newName) return;
    const url = `https://bazara-vpn-site.vercel.app/?ref=${encodeURIComponent(newName)}`;
    setLinks([{ name: newName, url, count: 0 }, ...links]);
    setModalOpen(false);
    setNewName('');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Реферальные ссылки</h1>
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl px-8 py-4 mb-8 w-full" onClick={() => setModalOpen(true)}>
        Создать реферальную ссылку
      </button>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#232323] rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
            <h2 className="text-2xl font-bold mb-2">Создать реферальную ссылку</h2>
            <input className="rounded-lg px-4 py-3 text-base text-white font-semibold bg-[#181818] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Имя ссылки (например, booster)" value={newName} onChange={e => setNewName(e.target.value)} />
            <div className="flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6 py-3" onClick={handleCreate}>Создать</button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl px-6 py-3" onClick={() => setModalOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6 mt-8">
        {links.map(link => (
          <div key={link.name} className="bg-[#232323] rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between shadow">
            <div>
              <div className="text-lg font-bold">{link.name}</div>
              <div className="text-sm text-gray-400 break-all">{link.url}</div>
            </div>
            <div className="mt-2 md:mt-0 text-orange-400 font-bold text-lg">Приведено: {link.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 