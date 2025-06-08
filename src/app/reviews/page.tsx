"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ReviewModal } from '@/components/features/reviews/ReviewModal';
import { User, Review } from '@/lib/types';
import { useLang, useUser } from '@/lib/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider } from '@/lib/LanguageContext';
import { TelegramAuthModal } from '@/components/features/TelegramAuthModal';

const reviewsTexts = {
  ru: {
    title: 'Отзывы пользователей',
    subtitle: 'Безопасность. Доступ. Контроль.',
    leave: 'Оставить отзыв',
    search: 'Поиск по тексту...',
    sortNew: 'Сначала новые',
    sortOld: 'Сначала старые',
    all: 'Все',
    noReviews: 'Пока нет отзывов',
    stars: ['звезда', 'звезды', 'звёзд'],
  },
  en: {
    title: 'User reviews',
    subtitle: 'Security. Access. Control.',
    leave: 'Leave a review',
    search: 'Search by text...',
    sortNew: 'Newest first',
    sortOld: 'Oldest first',
    all: 'All',
    noReviews: 'No reviews yet',
    stars: ['star', 'stars', 'stars'],
  },
};

const getStarWord = (n: number, lang: string) => {
  if (lang === 'ru') {
    if (n === 1) return 'звезда';
    if (n >= 2 && n <= 4) return 'звезды';
    return 'звёзд';
  }
  return n === 1 ? 'star' : 'stars';
};

const AVATARS = [
  '/assets/avatar1.png',
  '/assets/avatar2.png',
  '/assets/avatar3.png',
];

const ReviewCard = ({ review, avatar }: { review: Review; avatar: string }) => {
  const { lang } = useLang();
  return (
    <div className="review-card bg-[#232323] rounded-2xl shadow-xl p-8 flex flex-col gap-2">
      <div className="flex items-center gap-3 mb-2">
        <Image src={avatar} width={48} height={48} alt={review.userName} className="rounded-full shadow" />
        <div>
          <div className="font-semibold text-white text-lg">{review.userName}</div>
          <div className="flex gap-0.5 mt-1">
            {Array(5).fill(0).map((_, i) => (
              <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-orange-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36"/>
              </svg>
            ))}
          </div>
        </div>
      </div>
      <div className="text-gray-300 text-base mt-2">{review.text}</div>
      <div className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  );
};

export default function ReviewsPage() {
  const { lang } = useLang();
  const t = reviewsTexts[lang];
  const [user, setUser] = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'new' | 'old'>('new');
  const [starFilter, setStarFilter] = useState<number | null>(null);

  // Для каждого отзыва выбираем случайный аватар (один раз на рендер)
  const [avatarMap, setAvatarMap] = useState<{[id: string]: string}>({});
  useEffect(() => {
    if (reviews.length) {
      const map: {[id: string]: string} = {};
      reviews.forEach(r => {
        if (!avatarMap[r.id]) {
          map[r.id] = AVATARS[Math.floor(Math.random() * AVATARS.length)];
        } else {
          map[r.id] = avatarMap[r.id];
        }
      });
      setAvatarMap(map);
    }
    // eslint-disable-next-line
  }, [reviews.length]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (data.success) setReviews(data.reviews);
      } catch (e) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Поиск по имени и тексту
  let filtered = reviews.filter(r =>
    (!starFilter || r.rating === starFilter) &&
    (search.trim() === '' ||
      r.text.toLowerCase().includes(search.trim().toLowerCase()) ||
      (r.userName || '').toLowerCase().includes(search.trim().toLowerCase())
    )
  );
  if (sort === 'new') filtered = filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  else filtered = filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return (
    <LanguageProvider>
      <Header user={user} onLogin={() => setShowAuth(true)} onLogout={() => { setUser(null); if (typeof window !== 'undefined') localStorage.removeItem('bazaraUser'); }} />
      <TelegramAuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onAuth={u => { setUser(u); if (typeof window !== 'undefined') localStorage.setItem('bazaraUser', JSON.stringify(u)); setShowAuth(false); setIsModalOpen(true); }} />
      <div className="min-h-screen bg-[#181818] pt-24 pb-8 md:pb-10 px-2 sm:px-4">
        <style jsx>{`
          .star-filter-btn:hover .star-icon {
            fill: #ff8800 !important;
            color: #ff8800 !important;
            transform: scale(1.12);
          }
          .review-card {
            box-shadow: 0 0 0 3px #a259ff33, 0 2px 16px 0 #a259ff44;
            border-radius: 1.2rem;
            transition: box-shadow 0.18s, transform 0.15s;
            border: 2px solid transparent;
          }
          .review-card:hover {
            box-shadow: 0 0 0 5px #a259ff88, 0 8px 32px 0 #a259ffcc, 0 2px 8px 0 #ff880088;
            border-color: #a259ff;
            transform: translateY(-2px) scale(1.01);
          }
        `}</style>
        <section className="max-w-6xl mx-auto flex flex-col items-center gap-4 md:gap-6">
          <div className="flex flex-col items-center gap-2">
            <Image src="/assets/logo-bazara.png" alt="BazaraVPN Logo" width={64} height={64} className="h-12 w-12 md:h-20 md:w-20 mx-auto" />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl md:text-4xl font-extrabold text-white">BazaraVPN</span>
            </div>
            <div className="text-base md:text-xl text-orange-400 font-semibold mt-1">{t.subtitle}</div>
            <button onClick={() => { user ? setIsModalOpen(true) : setShowAuth(true); }} className="mt-4 bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-bold py-3 px-8 md:px-12 rounded-xl shadow-lg text-base md:text-lg w-full max-w-xs mx-auto transition-all duration-200">{t.leave}</button>
          </div>
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mt-4">
            <div className="flex gap-1 mb-2 md:mb-0">
              {[1,2,3,4,5].map(n => (
                <button key={n} className={`star-filter-btn ${starFilter === n ? 'selected' : ''}`} onClick={() => setStarFilter(starFilter === n ? null : n)} aria-label={`${n} ${getStarWord(n, lang)}`}>
                  <svg className="w-6 h-6 md:w-7 md:h-7 star-icon" fill={starFilter === n ? '#ff8800' : '#444'} viewBox="0 0 20 20"><polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36"/></svg>
                </button>
              ))}
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder={t.search} className="w-full md:w-auto ml-0 md:ml-4 px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base md:text-lg" />
            <div className="relative w-full md:w-auto ml-0 md:ml-4">
              <select value={sort} onChange={e => setSort(e.target.value as 'new' | 'old')} className="sort-btn bg-[#232323] text-white font-bold px-4 md:px-6 py-2 rounded-xl flex items-center w-full md:w-auto text-base md:text-lg">
                <option value="new">{t.sortNew}</option>
                <option value="old">{t.sortOld}</option>
              </select>
            </div>
          </div>
          <div className="text-gray-400 text-base mt-2 flex items-center justify-center gap-2">
            <span className="inline-block bg-[#232323] text-orange-400 font-bold rounded-full px-4 py-1 text-base md:text-lg">{filtered.length}</span>
          </div>
        </section>
        <main className="w-full max-w-5xl mx-auto flex flex-col gap-4 md:gap-6 py-6 md:py-10 px-2 md:px-4" style={{ minHeight: '60vh' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {loading ? (
              <div className="text-center text-gray-400 py-12 md:py-16 text-base md:text-xl w-full col-span-2">Загрузка...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-gray-400 py-12 md:py-16 text-base md:text-xl w-full col-span-2">{t.noReviews}</div>
            ) : (
              filtered.map((review) => (
                <ReviewCard key={review.id} review={review} avatar={avatarMap[review.id] || AVATARS[0]} />
              ))
            )}
          </div>
        </main>
        <ReviewModal
          isOpen={isModalOpen && !!user}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (text, rating) => {
            if (!user) return;
            try {
              const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user.id,
                  text,
                  rating,
                  userName: user.name,
                  userUsername: user.username
                })
              });
              const data = await response.json();
              if (data.success) {
                setIsModalOpen(false);
                // После отправки — обновить отзывы
                const res = await fetch('/api/reviews');
                const d = await res.json();
                if (d.success) setReviews(d.reviews);
              }
            } catch (error) {
              // TODO: Показать ошибку
            }
          }}
          user={user}
        />
      </div>
      <Footer />
    </LanguageProvider>
  );
} 