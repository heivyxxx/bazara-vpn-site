"use client";

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { ResponsiveDialog } from '@/components/modal/ResponsiveDialog';

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

  return (
    <ResponsiveDialog
      open={isOpen}
      onClose={onClose}
      title="Оставить отзыв"
      sheetBg="#18181b"
      desktopMaxWidthClass="max-w-md"
      footer={
        user ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-transparent py-3 text-base font-semibold text-white transition hover:bg-zinc-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              form="review-modal-form"
              disabled={!text.trim()}
              className="flex-1 rounded-xl bg-[#fd6a32] py-3 text-base font-semibold text-white transition hover:bg-[#e65a1e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Отправить
            </button>
          </>
        ) : null
      }
    >
      {!user ? null : (
        <form id="review-modal-form" onSubmit={handleSubmit} className="flex flex-col gap-6 pb-1">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Оценка</label>
            <div className="flex gap-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className="text-2xl focus:outline-none"
                  >
                    <svg
                      className={`h-8 w-8 ${i < rating ? 'text-[#fd6a32]' : 'text-gray-400'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                    </svg>
                  </button>
                ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Ваш отзыв</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-[#333] bg-[#181818] px-4 py-3 text-base text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#fd6a32]"
              placeholder="Расскажите о вашем опыте использования BazaraVPN..."
            />
          </div>
        </form>
      )}
    </ResponsiveDialog>
  );
};
