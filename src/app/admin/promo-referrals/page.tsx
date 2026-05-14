"use client";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';
import { ResponsiveDialog } from "@/components/modal/ResponsiveDialog";

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
      {viewType === 'promo' && (
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl px-8 py-4 mb-8 w-full" onClick={() => setModalOpen(true)}>
          Создать рекламную ссылку
        </button>
      )}
      <ResponsiveDialog
        open={modalOpen && viewType === 'promo'}
        onClose={() => setModalOpen(false)}
        title="Создать рекламную ссылку"
        sheetBg="#232323"
        desktopMaxWidthClass="max-w-md"
        footer={
          <>
            <button
              type="button"
              className="flex-1 rounded-xl bg-gray-600 px-6 py-3 font-bold text-white transition hover:bg-gray-700"
              onClick={() => setModalOpen(false)}
            >
              Отмена
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? "Создание..." : "Создать"}
            </button>
          </>
        }
      >
        <input
          className="w-full rounded-lg bg-[#181818] px-4 py-3 text-base font-semibold text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Имя ссылки (например, sanek)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
      </ResponsiveDialog>
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