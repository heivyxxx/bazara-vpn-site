"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ReviewModal } from './ReviewModal';
import { User, Review } from '@/lib/types';
import { useLang } from '@/lib/LanguageContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface ReviewCardProps {
  avatar: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

const ReviewCard = ({ avatar, name, rating, text, date }: ReviewCardProps) => (
  <div className="bg-[#232323] rounded-2xl shadow-xl p-8 flex flex-col items-start min-w-[320px] max-w-[370px] mx-auto review-card-3d-anim">
    <div className="flex items-center gap-3 mb-2">
      <Image 
        src={avatar} 
        width={48} 
        height={48} 
        alt={name} 
        className="rounded-full shadow"
      />
      <div>
        <div className="font-semibold text-white text-lg">{name}</div>
        <div className="flex gap-0.5 mt-1">
          {Array(5).fill(0).map((_, i) => (
            <svg 
              key={i} 
              className={`w-5 h-5 ${i < rating ? 'text-orange-400' : 'text-gray-400'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36"/>
            </svg>
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-300 text-base mt-2">{text}</p>
    <div className="text-xs text-gray-400 mt-1">{date}</div>
  </div>
);

const reviewsTexts = {
  ru: {
    title: 'Отзывы пользователей',
    leave: 'Оставить отзыв',
    noReviews: 'Пока нет отзывов',
    all: 'Все отзывы',
  },
  en: {
    title: 'User reviews',
    leave: 'Leave a review',
    noReviews: 'No reviews yet',
    all: 'All reviews',
  },
};

export const Reviews = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();
  const t = reviewsTexts[lang];
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

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

  const handleSubmitReview = async (text: string, rating: number) => {
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
  };

  return (
    <section className="max-w-5xl mx-auto my-16 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-orange-400">
          {t.title}
        </h2>
        <div className="flex gap-4">
          <Link 
            href="/reviews" 
            className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg text-lg transition-all"
          >
            {t.all}
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg text-lg transition-all flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5Z"/>
            </svg>
            {t.leave}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-16 text-xl">Загрузка...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-gray-400 py-16 text-xl">{t.noReviews}</div>
      ) : (
        <div className="relative reviews-carousel-3d">
          <Swiper
            modules={[Navigation, A11y]}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onInit={swiper => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              700: { slidesPerView: 2 },
              1000: { slidesPerView: 3 },
            }}
            className="reviews-track-3d"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={review.id}>
                <ReviewCard
                  avatar={`/assets/avatar${(index % 3) + 1}.png`}
                  name={review.userName}
                  rating={review.rating}
                  text={review.text}
                  date={new Date(review.createdAt).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                />
              </SwiperSlide>
            ))}
            <button ref={prevRef} className="absolute left-[-32px] top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 shadow-lg flex items-center justify-center text-white text-3xl transition hover:scale-110 border-4 border-[#181818]" style={{boxShadow:'0 4px 24px #ff880055'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button ref={nextRef} className="absolute right-[-32px] top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 shadow-lg flex items-center justify-center text-white text-3xl transition hover:scale-110 border-4 border-[#181818]" style={{boxShadow:'0 4px 24px #ff880055'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </Swiper>
        </div>
      )}

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitReview}
        user={user}
      />
    </section>
  );
}; 