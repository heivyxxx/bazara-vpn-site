"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { User } from "@/lib/types";
import { AdminPinModal } from "@/components/AdminPinModal";

interface HeaderProps {
  onLogin?: () => void;
  user?: User | null;
  onLogout?: () => void;
}

/** Баланс в шапке как в Bazara: `displayBalance.toFixed(2)` */
function formatHeaderBalance(balance: number | undefined): string {
  if (typeof balance !== "number" || Number.isNaN(balance)) return "0.00";
  return balance.toFixed(2);
}

export const Header = ({ user }: HeaderProps) => {
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const displayBalance = formatHeaderBalance(user?.balance);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#232323] bg-black/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
      <div
        className="wide-shell box-border flex w-full max-w-full items-center justify-between px-4"
        style={{
          minHeight: 56,
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)",
          paddingBottom: 8,
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 flex-shrink-0 cursor-pointer select-none items-center justify-center"
            style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
            onClick={(e) => {
              if (String(user?.id) === "980466532") {
                e.preventDefault();
                setAdminModalOpen(true);
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo-bazara.png"
              alt="BazaraVPN"
              className="h-9 w-9 cursor-pointer select-none object-contain"
              draggable={false}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </Link>
        </div>

        <div className="flex flex-shrink-0 items-center gap-3">
          <Link
            href="/deposit"
            className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-xl bg-[#fe6125] px-2 py-1 shadow-sm transition-transform duration-200 ease-out active:scale-95"
            style={{ borderRadius: 8 }}
          >
            <span className="mr-2 flex h-7 w-7 items-center justify-center">
              <span className="relative h-4 w-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/bazara-nav/koshel.svg"
                  alt=""
                  className="absolute inset-0 h-4 w-4 opacity-95"
                  width={16}
                  height={16}
                />
              </span>
            </span>
            <span className="mr-1 text-base font-bold text-white">{displayBalance}</span>
            <span className="text-base font-bold text-white">₽</span>
          </Link>
        </div>
      </div>

      {isMounted
        ? createPortal(
            <AdminPinModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />,
            document.body
          )
        : null}
    </header>
  );
};
