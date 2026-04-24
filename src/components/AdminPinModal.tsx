"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CORRECT_PIN = "2528";

export function AdminPinModal({ isOpen, onClose }: AdminPinModalProps) {
  const [pin, setPin] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setPin("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        onClose();
        router.push("/admin");
      } else {
        // Simple shake animation or just reset here
        setTimeout(() => setPin(""), 300);
      }
    }
  }, [pin, router, onClose]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleClear = () => {
    setPin("");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex flex-col items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm px-6 py-8 flex flex-col items-center">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Lock Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 flex flex-col items-center justify-center relative">
            <span className="text-7xl">🔐</span>
          </div>
        </div>

        <h2 className="text-white font-bold mb-6 text-center">Введите текущий PIN-код</h2>

        {/* Pin Dots */}
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                i < pin.length 
                  ? 'border-white bg-white' 
                  : 'border-[#333333] bg-transparent'
              }`}
            ></div>
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="bg-[#3A3941] hover:bg-[#4A4951] active:scale-95 transition-all text-white text-3xl font-bold py-4 rounded-3xl flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div className="col-start-2">
            <button
              onClick={() => handleKeyPress("0")}
              className="bg-[#3A3941] hover:bg-[#4A4951] active:scale-95 transition-all text-white text-3xl font-bold py-4 w-full rounded-3xl flex items-center justify-center"
            >
              0
            </button>
          </div>
          <div className="col-start-2 mt-2">
            <button
              onClick={handleClear}
              className="bg-[#2D2D31] hover:bg-[#3D3D41] active:scale-95 transition-all text-white font-semibold py-3 w-full rounded-xl flex items-center justify-center text-sm"
            >
              Очистить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
