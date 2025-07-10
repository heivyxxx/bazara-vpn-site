"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ReviewModal } from '@/components/features/reviews/ReviewModal';
import { User, Review } from '@/lib/types';
import { useLang, useUser } from '@/lib/LanguageContext';
import { Header } from '@/components/layout/Header';
// import { Footer } from '@/components/layout/Footer';
import { LanguageProvider } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

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

// Новый компонент для строки-отзыва
const ReviewRow = ({ review, avatar }: { review: Review; avatar: string }) => {
  const { lang } = useLang();
  return (
    <div className="review-row bg-[#232323] rounded-2xl shadow-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <Image src={avatar} width={40} height={40} alt={review.userName} className="rounded-full shadow" />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-white text-base truncate">{review.userName}</span>
          <span className="text-xs text-gray-400 mt-0.5">{new Date(review.createdAt).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
        </div>
      </div>
      <div className="flex gap-0.5 items-center min-w-[80px] justify-end">
        {Array(5).fill(0).map((_, i) => (
          <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-orange-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36"/>
          </svg>
        ))}
      </div>
    </div>
  );
};

// Модалка фильтров для отзывов (по образцу Eclipse, только сортировка и цена)
const SORT_OPTIONS = [
  { label: 'Сначала новые', value: 'new' },
  { label: 'Сначала старые', value: 'old' },
  { label: 'Цена: по возрастанию', value: 'price-asc' },
  { label: 'Цена: по убыванию', value: 'price-desc' },
  { label: 'Дата ↑', value: 'date-asc' },
  { label: 'Дата ↓', value: 'date-desc' },
];

const FilterModal = ({ open, onClose, sort, setSort, priceRange, setPriceRange, minPrice, maxPrice, priceInput, setPriceInput, resetAllFilters, resetPrice }: {
  open: boolean;
  onClose: () => void;
  sort: string;
  setSort: (s: string) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
  priceInput: [string, string];
  setPriceInput: (v: [string, string]) => void;
  resetAllFilters: () => void;
  resetPrice: () => void;
}) => {
  const [openSection, setOpenSection] = useState<'sort' | 'price' | null>('sort');
  const [closing, setClosing] = useState(false);

  // Двухсторонний ползунок
  const handleSlider = (idx: 0 | 1, value: number) => {
    let [min, max] = priceRange;
    if (idx === 0) {
      min = Math.min(value, max);
    } else {
      max = Math.max(value, min);
    }
    setPriceRange([min, max]);
    setPriceInput([String(min), String(max)]);
  };

  // Анимация закрытия вниз
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  };

  if (!open && !closing) return null;
  return (
    <div className="fixed inset-0 z-[9999] w-full h-full bg-black/80 flex items-end justify-center">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className={`relative w-full bg-[#18181b] rounded-t-3xl flex flex-col animate-fadeInUp ${closing ? 'animate-slideOutDown' : 'animate-slideInUp'}`}
        style={{ minHeight: '50vh', maxHeight: '70vh', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
      >
        {/* Заголовок и крестик */}
        <div className="flex flex-row items-center justify-between px-6 pt-6 pb-2 sticky top-0 z-10 bg-[#18181b] rounded-t-3xl">
          <span className="text-white font-bold text-lg">Фильтры</span>
          <button className="text-zinc-400 text-2xl p-1 rounded-full ml-2" onClick={handleClose} aria-label="Закрыть">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pb-32 px-6 pt-2">
          {/* Сортировка */}
          <div className="bg-[#23232b] rounded-2xl mb-4 p-0">
            <button className="w-full flex items-center justify-between px-6 py-4 bg-transparent text-white font-semibold text-base rounded-2xl" onClick={() => setOpenSection(openSection === 'sort' ? null : 'sort')}>
              Сортировать по
              <span className={`transition-transform ${openSection === 'sort' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {openSection === 'sort' && (
              <div className="px-6 pb-4 pt-2 flex flex-col gap-2 bg-transparent">
                {SORT_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="radio" name="sortBy" value={opt.value} checked={sort === opt.value} onChange={() => setSort(opt.value)} className="accent-[#fd6a32]" />
                    <span className="text-white text-base">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* Цена */}
          <div className="bg-[#23232b] rounded-2xl mb-4 p-0">
            <div className="flex items-center justify-between">
              <button className="w-full flex items-center justify-between px-6 py-4 bg-transparent text-white font-semibold text-base text-left rounded-2xl" onClick={() => setOpenSection(openSection === 'price' ? null : 'price')}>
                Цена
                <span className={`transition-transform ${openSection === 'price' ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && openSection === 'price' && (
                <button className="text-[#fd6a32] text-sm font-bold absolute right-8 top-4" onClick={resetPrice}>Сбросить</button>
              )}
            </div>
            {openSection === 'price' && (
              <div className="px-6 pb-4 pt-2 flex flex-col gap-2 bg-transparent">
                {/* Двухсторонний ползунок */}
                <div className="relative w-full h-8 flex items-center mb-2">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={e => handleSlider(0, Number(e.target.value))}
                    className="absolute w-full h-2 accent-[#fd6a32] pointer-events-auto z-10"
                    style={{ zIndex: priceRange[0] < priceRange[1] ? 20 : 10 }}
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={e => handleSlider(1, Number(e.target.value))}
                    className="absolute w-full h-2 accent-[#fd6a32] pointer-events-auto z-10"
                    style={{ zIndex: priceRange[1] > priceRange[0] ? 20 : 10 }}
                  />
                  {/* Трек */}
                  <div className="absolute w-full h-2 bg-[#23232b] rounded-full" />
                  <div
                    className="absolute h-2 bg-[#fd6a32] rounded-full"
                    style={{ left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`, width: `${((priceRange[1] - priceRange[0]) / (maxPrice - minPrice)) * 100}%` }}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={minPrice}
                    max={maxPrice}
                    value={priceInput[0]}
                    onChange={e => {
                      let v = e.target.value;
                      if (v === '') v = String(minPrice);
                      setPriceInput([v, priceInput[1]]);
                      setPriceRange([Number(v), priceRange[1]]);
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#18181b] text-white text-base border-none outline-none"
                  />
                  <input
                    type="number"
                    min={minPrice}
                    max={maxPrice}
                    value={priceInput[1]}
                    onChange={e => {
                      let v = e.target.value;
                      if (v === '') v = String(maxPrice);
                      setPriceInput([priceInput[0], v]);
                      setPriceRange([priceRange[0], Number(v)]);
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#18181b] text-white text-base border-none outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Кнопки закреплены внизу */}
        <div className="sticky bottom-0 left-0 w-full flex justify-between gap-4 px-6 pb-6 pt-4 bg-[#18181b] rounded-b-3xl z-20">
          <button className="flex-1 py-3 rounded-xl text-white font-semibold text-base bg-transparent hover:bg-zinc-800 transition" onClick={() => { resetAllFilters(); handleClose(); }}>Сбросить</button>
          <button className="flex-1 py-3 rounded-xl bg-[#fd6a32] text-white font-semibold text-base" onClick={handleClose}>Поиск</button>
        </div>
      </div>
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
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'new' | 'old'>('new');
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'rows'>('cards');
  const [filterOpen, setFilterOpen] = useState(false);
  // состояние для фильтрации по цене
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [priceInput, setPriceInput] = useState<[string, string]>(['0', '10000']);
  const minPrice = 0;
  const maxPrice = 10000;

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
        if (data.success) {
          setReviews(data.reviews);
          // Получаем userId из отзывов
          const userIds = Array.from(new Set(data.reviews.map((r: any) => r.userId)));
          if (userIds.length > 0) {
            const { data: users } = await supabase
              .from('users')
              .select('id, name, username, avatar')
              .in('id', userIds);
            const map: Record<string, User> = {};
            (users || []).forEach((u: User) => { map[u.id] = u; });
            setUsersMap(map);
          }
        }
      } catch (e) {
        setReviews([]);
        setUsersMap({});
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
    ) &&
    (Number(r.price || 0) >= priceRange[0] && Number(r.price || 0) <= priceRange[1])
  );
  if (sort === 'new') filtered = filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  else if (sort === 'old') filtered = filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  else if (sort === 'price-asc') filtered = filtered.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sort === 'price-desc') filtered = filtered.slice().sort((a, b) => (b.price || 0) - (a.price || 0));
  else if (sort === 'date-asc') filtered = filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  else if (sort === 'date-desc') filtered = filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // сброс фильтров
  const resetAllFilters = () => {
    setSort('new');
    setPriceRange([minPrice, maxPrice]);
    setPriceInput([String(minPrice), String(maxPrice)]);
  };
  const resetPrice = () => {
    setPriceRange([minPrice, maxPrice]);
    setPriceInput([String(minPrice), String(maxPrice)]);
  };

  return (
    <LanguageProvider>
      <Header user={user} onLogin={() => setShowAuth(true)} onLogout={() => { setUser(null); if (typeof window !== 'undefined') localStorage.removeItem('bazaraUser'); }} />
      <div className="min-h-screen bg-black pt-32 pb-14 md:pb-16 px-2 sm:px-4">
        <style jsx>{`
          .star-filter-btn:hover .star-icon {
            fill: #fd6a32 !important;
            color: #fd6a32 !important;
            transform: scale(1.12);
          }
          .review-card, .review-row {
            box-shadow: 0 0 0 3px #a259ff33, 0 2px 16px 0 #a259ff44;
            border-radius: 1.2rem;
            transition: box-shadow 0.18s, transform 0.15s;
            border: 2px solid transparent;
          }
          .review-card:hover, .review-row:hover {
            box-shadow: 0 0 0 5px #a259ff88, 0 8px 32px 0 #a259ffcc, 0 2px 8px 0 #fd6a3255;
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
            <div className="text-base md:text-xl text-[#fd6a32] font-semibold mt-1">{t.subtitle}</div>
            <button onClick={() => { user ? setIsModalOpen(true) : setShowAuth(true); }} className="mt-4 bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-bold py-3 px-8 md:px-12 rounded-xl shadow text-base md:text-lg w-full max-w-xs mx-auto transition-all duration-200">{t.leave}</button>
          </div>
          <div className="flex items-center gap-2 w-full mb-8">
            <div className="flex-1 flex items-center bg-[#18181b] rounded-2xl px-4 h-12">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.search}
                className="flex-1 bg-transparent outline-none border-none text-white placeholder-gray-400 text-base"
                style={{height:'2.5rem'}}
              />
            </div>
            <button
              className="ml-2 flex items-center justify-center w-11 h-11 rounded-2xl bg-[#18181b] hover:bg-[#23232b] transition"
              style={{border:'none',padding:0}}
              onClick={() => setViewMode(viewMode === 'cards' ? 'rows' : 'cards')}
              aria-label="Переключить режим отображения"
            >
              <img src={viewMode === 'cards' ? '/assets/mode.png' : '/assets/mode-rows.png'} alt="mode" className="w-6 h-6" />
            </button>
            <button
              className="ml-2 flex items-center justify-center w-11 h-11 rounded-2xl bg-[#18181b] hover:bg-[#23232b] transition"
              style={{border:'none',padding:0}}
              onClick={() => setFilterOpen(true)}
              aria-label="Открыть фильтры"
            >
              <img src="/assets/filter.png" alt="filter" className="w-6 h-6" />
            </button>
          </div>
        </section>
        <main className="w-full max-w-5xl mx-auto flex flex-col gap-4 md:gap-6 py-6 md:py-10 px-2 md:px-4" style={{ minHeight: '60vh' }}>
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {loading ? (
                <div className="text-center text-gray-400 py-12 md:py-16 text-base md:text-xl w-full col-span-2">Загрузка...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center text-gray-400 py-12 md:py-16 text-base md:text-xl w-full col-span-2">{t.noReviews}</div>
              ) : (
                filtered.map((review) => {
                  const u = usersMap[review.userId?.toString?.() || review.userId];
                  return (
                    <ReviewCard key={review.id} review={{...review, userName: u?.name || 'Аноним'}} avatar={u?.avatar || AVATARS[0]} />
                  );
                })
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="text-center text-gray-400 py-12 md:py-16 text-base md:text-xl w-full">Загрузка...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center text-gray-400 py-12 md:py-16 text-base md:text-xl w-full">{t.noReviews}</div>
              ) : (
                filtered.map((review) => {
                  const u = usersMap[review.userId?.toString?.() || review.userId];
                  return (
                    <ReviewRow key={review.id} review={{...review, userName: u?.name || 'Аноним'}} avatar={u?.avatar || AVATARS[0]} />
                  );
                })
              )}
            </div>
          )}
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
        <FilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          sort={sort}
          setSort={setSort}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceInput={priceInput}
          setPriceInput={setPriceInput}
          resetAllFilters={resetAllFilters}
          resetPrice={resetPrice}
        />
      </div>
      {/* <Footer /> */}
    </LanguageProvider>
  );
} 