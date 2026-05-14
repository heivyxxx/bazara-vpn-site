"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const NAV_BASE = "/assets/bazara-nav";

const items = [
  { href: "/", label: "Главная", match: (p: string) => p === "/", icon: "home.svg", iconActive: "homeactive.svg" },
  {
    href: "/tariffs",
    label: "Тарифы",
    match: (p: string) => p.startsWith("/tariffs"),
    icon: "bag.svg",
    iconActive: "bagactive.svg",
  },
  {
    href: "/support",
    label: "Поддержка",
    match: (p: string) => p.startsWith("/support"),
    icon: "chat.svg",
    iconActive: "chatactive.svg",
  },
];

function hapticSoft() {
  try {
    if (localStorage.getItem("vibration") === "off") return;
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("soft");
  } catch {
    /* empty */
  }
}

export default function BottomNav() {
  const pathname = usePathname() || "";
  const navRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [floating, setFloating] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const pickFloating = () => {
      try {
        const tg = !!(window as any).Telegram?.WebApp?.initDataUnsafe?.user;
        setFloating(!tg && window.innerWidth < 640);
      } catch {
        setFloating(false);
      }
    };
    pickFloating();
    window.addEventListener("resize", pickFloating);
    return () => window.removeEventListener("resize", pickFloating);
  }, []);

  useLayoutEffect(() => {
    const setH = (h: number) => {
      try {
        document.documentElement.style.setProperty("--bottom_nav_h", `${Math.max(0, Math.round(h))}px`);
      } catch {
        /* empty */
      }
    };
    const el = navRef.current;
    if (!el) {
      setH(0);
      return;
    }
    const update = () => {
      try {
        const extra = floating ? 24 : 8;
        setH((el.getBoundingClientRect().height || 0) + extra);
      } catch {
        setH(72);
      }
    };
    update();
    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(() => update());
      ro.observe(el);
    } catch {
      /* empty */
    }
    window.addEventListener("resize", update);
    return () => {
      try {
        ro?.disconnect();
      } catch {
        /* empty */
      }
      window.removeEventListener("resize", update);
      setH(0);
    };
  }, [mounted, floating, pathname]);

  const nav = (
    <nav
      ref={navRef as React.RefObject<HTMLElement>}
      data-bottom-panel="1"
      className={`fixed z-[120] backdrop-blur-md flex justify-around items-center ${
        floating ? "rounded-2xl border border-zinc-700/40" : "border-t border-[#232323] min-w-full"
      }`}
      style={{
        left: floating ? 12 : 0,
        right: floating ? 12 : 0,
        bottom: floating ? 12 : 0,
        paddingTop: 8,
        paddingBottom: floating ? 10 : "calc(env(safe-area-inset-bottom, 0px) + 10px)",
        background: "#0E0E11",
        borderTopLeftRadius: floating ? 16 : 0,
        borderTopRightRadius: floating ? 16 : 0,
        boxShadow: floating ? "0 8px 28px rgba(0,0,0,0.45)" : "0 -8px 32px 0 rgba(0,0,0,0.5)",
      }}
    >
      {items.map((it) => {
        const active = it.match(pathname);
        const src = `${NAV_BASE}/${active ? it.iconActive : it.icon}`;
        return (
          <Link
            key={it.href}
            href={it.href}
            className="flex flex-col items-center flex-1 select-none min-w-0"
            onClick={hapticSoft}
          >
            <span className="w-7 h-7 flex items-center justify-center rounded-full relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" width={28} height={28} className="w-7 h-7" />
            </span>
            <span
              className="text-xs mt-1 font-medium truncate max-w-full px-0.5"
              style={{ color: active ? "#fe6125" : "#9ca3af" }}
            >
              {it.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  if (!mounted || typeof document === "undefined" || !document.body) {
    return null;
  }
  return createPortal(nav, document.body);
}
