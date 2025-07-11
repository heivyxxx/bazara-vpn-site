"use client";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';

export default function AdminPromoReferrals() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [viewType, setViewType] = useState<'promo' | 'user'>('promo');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/referral-hit?type=${viewType}`);
      const json = await res.json();
      if (json.error) setError(json.error);
      setLinks(json.data || []);
    } catch (e) {
      setError("Ошибка загрузки ссылок");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
    // eslint-disable-next-line
  }, [viewType]);

  const handleCreate = async () => {
    if (!newName) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/referral-hit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, type: viewType })
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || "Ошибка создания");
      } else {
        setModalOpen(false);
        setNewName("");
        fetchLinks();
      }
    } catch (e) {
      setError("Ошибка создания");
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить эту ссылку?')) return;
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/referral-hit?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || "Ошибка удаления");
      } else {
        fetchLinks();
      }
    } catch (e) {
      setError("Ошибка удаления");
    }
    setDeletingId(null);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Реферальные ссылки</h1>
      <div className="flex gap-4 mb-8">
        <button className={`flex-1 py-3 rounded-xl font-bold text-lg transition ${viewType === 'user' ? 'bg-[#fd6a32] text-white' : 'bg-[#23232b] text-gray-300'}`} onClick={() => setViewType('user')}>Обычные</button>
        <button className={`flex-1 py-3 rounded-xl font-bold text-lg transition ${viewType === 'promo' ? 'bg-[#fd6a32] text-white' : 'bg-[#23232b] text-gray-300'}`} onClick={() => setViewType('promo')}>Рекламные</button>
      </div>
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl px-8 py-4 mb-8 w-full" onClick={() => setModalOpen(true)}>
        Создать {viewType === 'promo' ? 'рекламную' : 'обычную'} ссылку
      </button>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#232323] rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
            <h2 className="text-2xl font-bold mb-2">Создать {viewType === 'promo' ? 'рекламную' : 'обычную'} ссылку</h2>
            <input className="rounded-lg px-4 py-3 text-base text-white font-semibold bg-[#181818] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder={viewType === 'promo' ? "Имя ссылки (например, sanek)" : "Имя ссылки (например, ref_123456)"} value={newName} onChange={e => setNewName(e.target.value)} />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6 py-3" onClick={handleCreate} disabled={creating}>{creating ? "Создание..." : "Создать"}</button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl px-6 py-3" onClick={() => setModalOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6 mt-8">
        {loading ? <div>Загрузка...</div> : links.map(link => (
          <div key={link.id} className="bg-[#232323] rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between shadow">
            <div>
              <div className="text-lg font-bold">{link.name}</div>
              <div className="text-sm text-gray-400 break-all">{link.url}</div>
            </div>
            <div className="mt-2 md:mt-0 flex flex-row items-center gap-4">
              <div className="text-orange-400 font-bold text-lg">Приведено: {link.count}</div>
              <button className="ml-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition" onClick={() => handleDelete(link.id)} disabled={deletingId === link.id}>{deletingId === link.id ? 'Удаление...' : 'Удалить'}</button>
            </div>
          </div>
        ))}
        {!loading && links.length === 0 && <div className="text-gray-400">Нет {viewType === 'promo' ? 'рекламных' : 'обычных'} рефералов</div>}
      </div>
    </div>
  );
} 