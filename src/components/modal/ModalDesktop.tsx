"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export type ModalDesktopProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  /** Доп. классы на панель (поверх max-width) */
  className?: string;
  contentClassName?: string;
  maxWidthClass?: string;
};

/**
 * Десктоп-модалка как в Bazara: по центру, blur, Escape и клик по фону.
 */
export default function ModalDesktop({
  open,
  onClose,
  title,
  children,
  className,
  contentClassName,
  maxWidthClass = "max-w-[560px]",
}: ModalDesktopProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const scrollY = window.scrollY;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, [open, onClose]);

  if (!open) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999]"
      style={{
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-full w-full items-center justify-center p-4">
        <div
          className={`w-full ${maxWidthClass} overflow-hidden rounded-2xl ${className || ""}`}
          style={{
            background: "rgba(17, 17, 18, 0.85)",
            backdropFilter: "blur(20px) saturate(1.2)",
            WebkitBackdropFilter: "blur(20px) saturate(1.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {title != null && title !== "" && (
            <div className="px-4 py-3 text-center text-lg font-bold text-white">{title}</div>
          )}
          <div className={contentClassName ?? "p-4"}>{children}</div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
