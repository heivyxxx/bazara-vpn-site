"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResponsiveDialog } from "@/components/modal/ResponsiveDialog";

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
        setTimeout(() => setPin(""), 300);
      }
    }
  }, [pin, router, onClose]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleClear = () => {
    setPin("");
  };

  return (
    <ResponsiveDialog open={isOpen} onClose={onClose} title="Вход в админку" sheetBg="#18181b" desktopMaxWidthClass="max-w-sm">
      <div className="flex flex-col items-center px-2 pb-2 pt-2">
        <div className="mb-6 flex flex-col items-center justify-center">
          <span className="text-7xl" aria-hidden>
            🔐
          </span>
        </div>
        <p className="mb-6 text-center text-sm text-zinc-400">Введите 4-значный PIN</p>
        <div className="mb-8 flex gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                i < pin.length ? 'border-white bg-white' : 'border-[#333333] bg-transparent'
              }`}
            />
          ))}
        </div>
        <div className="grid w-full max-w-xs grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num.toString())}
              className="flex items-center justify-center rounded-3xl bg-[#3A3941] py-4 text-3xl font-bold text-white transition-all hover:bg-[#4A4951] active:scale-95"
            >
              {num}
            </button>
          ))}
          <div className="col-start-2">
            <button
              type="button"
              onClick={() => handleKeyPress("0")}
              className="flex w-full items-center justify-center rounded-3xl bg-[#3A3941] py-4 text-3xl font-bold text-white transition-all hover:bg-[#4A4951] active:scale-95"
            >
              0
            </button>
          </div>
          <div className="col-span-3 mt-2 flex justify-center">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl bg-[#2D2D31] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#3D3D41] active:scale-95"
            >
              Очистить
            </button>
          </div>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
