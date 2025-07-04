"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { ReviewModal } from './ReviewModal';
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
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0 mb-8">
        <h2 className="text-3xl font-bold text-orange-400 w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">
          {t.title}
        </h2>
        <div className="flex w-full sm:w-auto justify-center sm:justify-start">
          <Link 
            href="/reviews" 
            className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg text-lg transition-all w-full sm:w-auto text-center"
            style={{minWidth:'180px'}}
          >
            {t.all}
          </Link>
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
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              700: { slidesPerView: 2, spaceBetween: 24 },
              1000: { slidesPerView: 3, spaceBetween: 32 },
            }}
            className="reviews-track-3d flex gap-4 sm:gap-8"
            style={{alignItems:'center', minHeight:320}}
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={review.id} style={{display:'flex',justifyContent:'center'}}>
                <ReviewCard
                  avatar={`/assets/avatar${(index % 3) + 1}.png`}
                  name={review.userName}
                  rating={review.rating}
                  text={review.text}
                  date={new Date(review.createdAt).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                />
              </SwiperSlide>
            ))}
            <button ref={prevRef} className="carousel-arrow left" aria-label="Назад">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button ref={nextRef} className="carousel-arrow right" aria-label="Вперёд">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </Swiper>
        </div>
      )}

      <style jsx global>{`
      .carousel-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 52px;
        height: 52px;
        background: rgba(60,60,60,0.7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #bbb;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10;
        border: 2px solid #444;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.12);
        user-select: none;
      }
      .carousel-arrow:hover {
        background: #ff8800;
        color: #fff;
        box-shadow: 0 4px 16px 0 rgba(255,136,0,0.18);
      }
      .carousel-arrow.left { left: 0; }
      .carousel-arrow.right { right: 0; }
      @media (max-width: 900px) { .carousel-arrow.left { left: 0; } .carousel-arrow.right { right: 0; } }
      @media (max-width: 600px) {
        .carousel-arrow { width: 44px; height: 44px; font-size: 1.3rem; }
        .reviews-track-3d { gap: 0.5rem !important; }
      }
      `}</style>
    </section>
  );
}; 