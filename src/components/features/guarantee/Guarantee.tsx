"use client";

export const Guarantee = () => {
  return (
    <div className="w-full max-w-2xl mx-auto flex items-center gap-4 bg-gradient-to-r from-orange-500 to-orange-400 border border-orange-700 text-white rounded-2xl shadow-lg px-6 py-4 mb-12 mt-2">
      <svg 
        className="w-8 h-8 flex-shrink-0" 
        fill="none" 
        stroke="#fff" 
        strokeWidth="2.5" 
        viewBox="0 0 24 24"
      >
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="#fff" 
          strokeWidth="2.5" 
          fill="none"
        />
        <path 
          d="M8 12l2 2 4-4" 
          stroke="#fff" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <div className="text-lg font-semibold">
        30-дневная гарантия возврата денег на годовую подписку
      </div>
    </div>
  );
}; 