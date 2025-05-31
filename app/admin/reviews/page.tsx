"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, query } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

interface Review {
  id: string;
  userId: string;
  text: string;
  stars: number;
  status: string;
  createdAt: number;
}

export default function ReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const router = useRouter();

  // Auth protection
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/admin/login");
      else setLoading(false);
    });
    return () => unsub();
  }, [router]);

  // Fetch reviews
  const fetchReviews = async () => {
    const q = query(collection(db, "reviews"));
    const snap = await getDocs(q);
    const arr: Review[] = [];
    snap.forEach(docu => {
      const d = docu.data();
      if (d.status === "moderation") {
        arr.push({
          id: docu.id,
          userId: d.userId,
          text: d.text,
          stars: d.stars,
          status: d.status,
          createdAt: d.createdAt
        });
      }
    });
    // Сортировка: свежие сверху
    arr.sort((a, b) => b.createdAt - a.createdAt);
    setReviews(arr);
  };

  useEffect(() => {
    if (!loading) fetchReviews();
  }, [loading]);

  // Действия
  const setStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "reviews", id), { status });
    await fetchReviews();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Загрузка...</div>;

  return (
    <main className="w-full max-w-3xl mx-auto flex flex-col gap-6 py-12 px-4 min-h-screen">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-2xl font-bold text-purple-400">Новые отзывы</span>
        <span className="badge">{reviews.length}</span>
        <button onClick={fetchReviews} className="ml-2 text-sm text-purple-400 hover:text-purple-300">⟳</button>
      </div>
      {reviews.length === 0 && (
        <div className="text-gray-400 text-center mt-10">Нет отзывов на модерации</div>
      )}
      {reviews.map((review) => (
        <div key={review.id} className="review-card flex flex-col gap-3">
          <div className="flex items-center gap-4 mb-1">
            <div className="font-bold text-lg text-purple-400 flex-1">{review.userId || "Аноним"}</div>
            <div className="stars">{'★'.repeat(review.stars)}{'☆'.repeat(5-review.stars)}</div>
            <div className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleString()}</div>
          </div>
          <div className="text-base mb-2">{review.text}</div>
          <div className="flex gap-2">
            <button className="review-btn" onClick={() => setStatus(review.id, "published")}>✅ Утвердить</button>
            <button className="review-btn" onClick={() => setStatus(review.id, "deleted")}>❌ Удалить</button>
          </div>
        </div>
      ))}
      <style jsx global>{`
        .review-card {
          background: #232323;
          border-radius: 1.2rem;
          box-shadow: 0 2px 16px 0 #a259ff44;
          padding: 1.5rem 2rem;
          margin-bottom: 1.5rem;
          transition: box-shadow 0.18s, transform 0.15s;
          border: 2px solid transparent;
        }
        .review-card:hover {
          box-shadow: 0 8px 32px 0 #a259ffcc, 0 2px 8px 0 #ff880088;
          border-color: #a259ff;
          transform: translateY(-2px) scale(1.01);
        }
        .review-btn {
          background: #232323;
          color: #a259ff;
          border: 1.5px solid #a259ff;
          border-radius: 0.7em;
          padding: 0.4em 1.2em;
          margin-right: 0.7em;
          margin-bottom: 0.5em;
          cursor: pointer;
          font-size: 1em;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
        }
        .review-btn:hover {
          background: #a259ff;
          color: #fff;
        }
        .review-btn:last-child { margin-right: 0; }
        .badge {
          background: #ff3b3b;
          color: #fff;
          font-weight: bold;
          border-radius: 9999px;
          padding: 0.2em 0.8em;
          font-size: 1.1rem;
          min-width: 2em;
          text-align: center;
          margin-left: 0.7em;
        }
        .stars {
          display: inline-block;
          font-size: 1.3em;
          color: #ffbb00;
          letter-spacing: 0.1em;
          margin-bottom: 0.2em;
        }
      `}</style>
    </main>
  );
} 