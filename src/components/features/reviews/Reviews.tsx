"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ReviewModal } from './ReviewModal';
import { User } from '@/lib/types';

interface ReviewCardProps {
  avatar: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

const ReviewCard = ({ avatar, name, rating, text, date }: ReviewCardProps) => (
  <div className="bg-[#232323] rounded-2xl shadow-xl p-8 flex flex-col items-start">
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

export const Reviews = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Демо отзывы (в реальности будут загружаться из Firebase)
  const reviews = [
    {
      avatar: "/assets/avatar1.png",
      name: "Аноним",
      rating: 5,
      text: "VPN работает отлично, скорость высокая, всё просто и удобно!",
      date: "12.06.24 14:32"
    },
    {
      avatar: "/assets/avatar2.png",
      name: "Иван",
      rating: 5,
      text: "Очень доволен сервисом, поддержка отвечает быстро.",
      date: "10.06.24 09:18"
    },
    {
      avatar: "/assets/avatar3.png",
      name: "Мария",
      rating: 5,
      text: "Пользуюсь на всех устройствах, всё супер!",
      date: "08.06.24 21:05"
    }
  ];

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
        // TODO: Показать сообщение об успехе и обновить список отзывов
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      // TODO: Показать ошибку
    }
  };

  return (
    <section className="max-w-5xl mx-auto my-16 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-orange-400">
          Отзывы пользователей
        </h2>
        <div className="flex gap-4">
          <Link 
            href="/reviews" 
            className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg text-lg transition-all"
          >
            Все отзывы
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg text-lg transition-all flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5Z"/>
            </svg>
            Оставить отзыв
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitReview}
        user={user}
      />
    </section>
  );
}; 