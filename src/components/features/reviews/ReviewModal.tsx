"use client";

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, rating: number) => void;
  user: User | null;
}

export const ReviewModal = ({ isOpen, onClose, onSubmit, user }: ReviewModalProps) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setText('');
      setRating(5);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text, rating);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#232323] rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-4 sm:p-6 border-b border-[#333]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Оставить отзыв
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition w-10 h-10 flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!user ? null : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Оценка
                </label>
                <div className="flex gap-2">
                  {Array(5).fill(0).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      className="text-2xl focus:outline-none"
                    >
                      <svg 
                        className={`w-8 h-8 ${i < rating ? 'text-orange-400' : 'text-gray-400'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ваш отзыв
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#181818] border border-[#333] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-base"
                  placeholder="Расскажите о вашем опыте использования BazaraVPN..."
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 w-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-300 hover:text-white transition w-full sm:w-auto"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  Отправить
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}; 