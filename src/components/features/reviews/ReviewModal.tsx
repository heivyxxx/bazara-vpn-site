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
  const [closing, setClosing] = useState(false);

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

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  };

  if (!isOpen && !closing) return null;

  return (
    <div className="fixed inset-0 z-[9999] w-full h-full bg-black/80 flex items-end justify-center">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className={`relative w-full bg-[#18181b] rounded-t-3xl flex flex-col animate-fadeInUp ${closing ? 'animate-slideOutDown' : 'animate-slideInUp'}`}
        style={{ minHeight: '30vh', maxHeight: '65vh', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
      >
        <div className="flex flex-row items-center justify-between px-6 pt-6 pb-2 sticky top-0 z-10 bg-[#18181b] rounded-t-3xl">
          <span className="text-white font-bold text-lg w-full text-center">Оставить отзыв</span>
          <button
            onClick={handleClose}
            className="text-zinc-400 text-2xl p-1 rounded-full ml-2 absolute right-6 top-6"
            aria-label="Закрыть"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        {!user ? null : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 pb-6 pt-2 gap-6 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Оценка</label>
              <div className="flex gap-2">
                {Array(5).fill(0).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className="text-2xl focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${i < rating ? 'text-[#fd6a32]' : 'text-gray-400'}`}
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Ваш отзыв</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-[#181818] border border-[#333] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fd6a32] focus:border-transparent resize-none text-base"
                placeholder="Расскажите о вашем опыте использования BazaraVPN..."
              />
            </div>
            <div className="sticky bottom-0 left-0 w-full flex justify-center gap-4 px-0 pt-2 bg-[#18181b] rounded-b-3xl z-20 mt-auto">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl text-white font-semibold text-base bg-transparent hover:bg-zinc-800 transition"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex-1 py-3 rounded-xl bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-semibold text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отправить
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 