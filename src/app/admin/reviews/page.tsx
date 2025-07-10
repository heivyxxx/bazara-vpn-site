"use client";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';

interface Review {
  id: string;
  userId: string;
  text: string;
  rating: number;
  status: string;
  createdAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'moderation')
      .order('createdAt', { ascending: false });
    if (error) setError(error.message);
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    await supabase.from('reviews').update({ status: 'approved' }).eq('id', id);
    fetchReviews();
  };
  const handleDelete = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id);
    fetchReviews();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black py-12">
      <div className="text-3xl text-white font-bold mb-8">Отзывы на модерации</div>
      {loading ? (
        <div className="text-white">Загрузка...</div>
      ) : error ? (
        <div className="text-red-500">Ошибка: {error}</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-400">Нет отзывов на модерации</div>
      ) : (
        <div className="flex flex-col gap-6 w-full max-w-2xl">
          {reviews.map(r => (
            <div key={r.id} className="bg-[#18181b] rounded-2xl p-6 flex flex-col gap-2 border border-[#23232b]">
              <div className="text-white text-lg font-semibold mb-1">{r.text}</div>
              <div className="text-yellow-400 font-bold">Оценка: {r.rating}</div>
              <div className="flex gap-4 mt-2">
                <button onClick={() => handleApprove(r.id)} className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">Одобрить</button>
                <button onClick={() => handleDelete(r.id)} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold">Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 