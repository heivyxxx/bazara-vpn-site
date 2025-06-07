"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import Image from "next/image";

export default function AdminHome() {
  const [loading, setLoading] = useState(true);
  const [supportCount, setSupportCount] = useState(0);
  const [issuesCount, setIssuesCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/admin/login");
      else setLoading(false);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (loading) return;
    // Получаем количество активных чатов (status == 'new' или 'progress')
    getDocs(query(collection(db, "supportChatStatus"), where("status", "in", ["new", "progress"]))).then(snap => setSupportCount(snap.size));
    // Получаем количество активных проблем (new + pending)
    getDocs(query(collection(db, "issues"), where("status", "in", ["new", "pending"]))).then(snap => setIssuesCount(snap.size));
    // Получаем количество немодерированных отзывов
    getDocs(query(collection(db, "reviews"), where("status", "==", "moderation"))).then(snap => setReviewsCount(snap.size));
  }, [loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Загрузка...</div>;

  return (
    <main className="w-full max-w-3xl mx-auto flex flex-col gap-10 py-16 px-4">
      {/* Верхний блок */}
      <div onClick={() => router.push('/admin/support')} className="admin-card flex items-center justify-between px-8 py-8 mb-4 w-full cursor-pointer group border-2 border-transparent">
        <div className="flex items-center gap-6">
          <div className="bg-[#181818] rounded-full p-4 flex items-center justify-center shadow-lg">
            <Image src="/assets/tp.png" alt="Поддержка" width={48} height={48} className="w-12 h-12" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white mb-1">Поддержка</div>
            <div className="text-lg text-gray-300">Напишите клиенту в чат</div>
          </div>
        </div>
        <span className="badge text-lg">{supportCount}</span>
      </div>
      {/* Нижние два блока */}
      <div className="flex gap-8 w-full">
        <div onClick={() => router.push('/admin/issues')} className="admin-card flex-1 flex items-center justify-between px-7 py-7 cursor-pointer group border-2 border-transparent">
          <div className="flex items-center gap-5">
            <div className="bg-[#181818] rounded-full p-3 flex items-center justify-center shadow-lg">
              <Image src="/assets/problem.png" alt="Проблемы" width={40} height={40} className="w-10 h-10" />
            </div>
            <div>
              <div className="text-xl font-bold text-white mb-1">Решение проблем</div>
              <div className="text-base text-gray-300">Решите проблему клиента</div>
            </div>
          </div>
          <span className="badge">{issuesCount}</span>
        </div>
        <div onClick={() => router.push('/admin/reviews')} className="admin-card flex-1 flex items-center justify-between px-7 py-7 cursor-pointer group border-2 border-transparent">
          <div className="flex items-center gap-5">
            <div className="bg-[#181818] rounded-full p-3 flex items-center justify-center shadow-lg">
              <Image src="/assets/star.png" alt="Отзывы" width={40} height={40} className="w-10 h-10" />
            </div>
            <div>
              <div className="text-xl font-bold text-white mb-1">Отзывы</div>
              <div className="text-base text-gray-300">Проверьте новые отзывы</div>
            </div>
          </div>
          <span className="badge">{reviewsCount}</span>
        </div>
      </div>
      {/* Кнопка Общая панель */}
      <div onClick={() => router.push('/admin/panel')} className="admin-card flex items-center justify-center px-8 py-8 w-full cursor-pointer group border-2 border-transparent mt-2">
        <div className="flex items-center gap-6">
          <div className="bg-[#181818] rounded-full p-4 flex items-center justify-center shadow-lg">
            <Image src="/assets/menu.png" alt="Панель" width={48} height={48} className="w-12 h-12" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white mb-1">Общая панель</div>
            <div className="text-lg text-gray-300">Управление сервисом</div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .admin-card {
          background: #232323;
          border-radius: 1.5rem;
          box-shadow: 0 2px 24px 0 #ff880088;
          transition: box-shadow 0.22s, transform 0.18s, border 0.18s;
          cursor: pointer;
        }
        .admin-card:hover {
          box-shadow: 0 8px 32px 0 #ff8800cc, 0 2px 8px 0 #a259ff88;
          border-color: #ff8800;
          transform: translateY(-4px) scale(1.03);
        }
        .badge {
          background: #ff3b3b;
          color: #fff;
          font-weight: bold;
          border-radius: 9999px;
          padding: 0.3em 0.9em;
          font-size: 1.1rem;
          box-shadow: 0 0 0 2px #232323;
          display: inline-block;
          min-width: 2.2em;
          text-align: center;
        }
      `}</style>
    </main>
  );
} 