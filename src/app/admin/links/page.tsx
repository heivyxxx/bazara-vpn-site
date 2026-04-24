"use client";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';

export default function AdminLinks() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      setLinks(data || []);
      setLoading(false);
    };
    fetchLinks();
  }, []);

  // Список полей, которые не отображаем
  const hiddenFields = ['id', 'telegram_id'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black py-12">
      <div className="text-3xl text-white font-bold mb-8">Подписки</div>
      {loading ? (
        <div className="text-white">Загрузка...</div>
      ) : error ? (
        <div className="text-red-500">Ошибка: {error}</div>
      ) : links.length === 0 ? (
        <div className="text-gray-400">Нет подписок</div>
      ) : (
        <div className="overflow-x-auto w-full max-w-5xl">
          <table className="w-full text-white border border-[#23232b] rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-[#18181b]">
                {Object.keys(links[0]).filter(k => !hiddenFields.includes(k)).map(key => (
                  <th key={key} className="px-4 py-2 border-b border-[#23232b] text-left font-bold">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {links.map((link, idx) => (
                <tr key={idx} className="bg-[#23232b] hover:bg-[#23232b]/80 transition">
                  {Object.keys(link).filter(k => !hiddenFields.includes(k)).map(key => (
                    <td key={key} className="px-4 py-2 border-b border-[#23232b]">{String(link[key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 