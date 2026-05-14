"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useDragControls } from "framer-motion";

interface ModalBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
  fullBleedTop?: boolean;
  compact?: boolean;
  sheetBg?: string;
}

/**
 * Мобильная модалка как в Bazara: bottom sheet с drag-down, портал, блокировка скролла.
 */
export default function ModalBottomSheet({
  open,
  onClose,
  title,
  children,
  actions,
  className,
  hideHeader,
  fullBleedTop,
  compact,
  sheetBg = "#0E0E11",
}: ModalBottomSheetProps) {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const dragControls = useDragControls();
  const [dragLimit, setDragLimit] = useState(800);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const dragPendingRef = useRef<{
    active: boolean;
    started: boolean;
    pointerId: number | null;
    startX: number;
    startY: number;
    downEvent: React.PointerEvent | null;
    scrollEl: HTMLElement | null;
    pointerType: string | null;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      try {
        const h = Math.max(0, window.innerHeight || 0);
        setDragLimit(Math.max(240, Math.floor(h * 0.9)));
      } catch {
        setDragLimit(800);
      }
    };
    update();
    window.addEventListener("resize", update);
    try {
      (window as unknown as { visualViewport?: VisualViewport }).visualViewport?.addEventListener?.(
        "resize",
        update
      );
    } catch {
      /* noop */
    }
    return () => {
      window.removeEventListener("resize", update);
      try {
        (window as unknown as { visualViewport?: VisualViewport }).visualViewport?.removeEventListener?.(
          "resize",
          update
        );
      } catch {
        /* noop */
      }
    };
  }, [open]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
    setPortalEl(root);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const g = ((window as unknown as { __modalScrollLock?: { count: number; origOverflow: string; origBodyOverflow: string } }).__modalScrollLock ??= {
      count: 0,
      origOverflow: "",
      origBodyOverflow: "",
    });

    if (g.count === 0) {
      g.origOverflow = document.documentElement.style.overflow;
      g.origBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    g.count++;

    return () => {
      g.count = Math.max(0, g.count - 1);
      if (g.count === 0) {
        document.documentElement.style.overflow = g.origOverflow;
        document.body.style.overflow = g.origBodyOverflow;
      }
    };
  }, [open]);

  const content = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] w-full h-full flex items-end justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px) saturate(1.2)",
            WebkitBackdropFilter: "blur(8px) saturate(1.2)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0" onClick={onClose} aria-hidden />
          <motion.div
            ref={sheetRef}
            className={`relative w-full flex flex-col rounded-t-2xl overflow-hidden ${className || ""}`}
            style={{
              backgroundColor: sheetBg,
              minHeight: fullBleedTop ? undefined : compact ? undefined : "40vh",
              maxHeight: fullBleedTop ? undefined : compact ? "40vh" : "77vh",
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)",
              borderTopLeftRadius: "1.5rem",
              borderTopRightRadius: "1.5rem",
              padding: fullBleedTop ? 0 : undefined,
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              duration: 0.26,
              ease: [0.16, 1, 0.3, 1],
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: dragLimit }}
            dragElastic={0.12}
            dragMomentum={false}
            dragSnapToOrigin
            onPointerDownCapture={(e) => {
              try {
                const t = e.target as HTMLElement | null;
                if (!t) return;
                if ((e as React.PointerEvent).button != null && (e as React.PointerEvent).button !== 0) return;
                const tag = (t.tagName || "").toUpperCase();
                if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON") return;
                if (t.closest?.("a")) return;
                if (t.closest?.('[contenteditable="true"]')) return;
                if (t.closest?.("[data-no-sheet-drag=\"1\"]")) return;

                const handle = t.closest?.('[data-sheet-handle="1"]') as HTMLElement | null;
                const root = sheetRef.current;
                const scrollEl =
                  (root?.querySelector?.('[data-sheet-scroll="1"]') as HTMLElement | null) || null;

                if (handle) {
                  dragControls.start(e);
                  return;
                }

                dragPendingRef.current = {
                  active: true,
                  started: false,
                  pointerId: typeof (e as React.PointerEvent).pointerId === "number" ? (e as React.PointerEvent).pointerId : null,
                  startX: e.clientX,
                  startY: e.clientY,
                  downEvent: e,
                  scrollEl,
                  pointerType: String((e as React.PointerEvent).pointerType || ""),
                };
              } catch {
                /* noop */
              }
            }}
            onPointerMoveCapture={(e) => {
              try {
                const p = dragPendingRef.current;
                if (!p || !p.active || p.started) return;
                if (p.pointerId != null && typeof (e as React.PointerEvent).pointerId === "number" && (e as React.PointerEvent).pointerId !== p.pointerId) return;
                const dx = e.clientX - p.startX;
                const dy = e.clientY - p.startY;

                const START_PX = 6;
                const DOMINANCE = 1.1;
                if (dy <= START_PX) return;
                if (Math.abs(dy) <= Math.abs(dx) * DOMINANCE) return;

                const scrollTop = p.scrollEl ? p.scrollEl.scrollTop || 0 : 0;
                if (scrollTop > 0) return;

                p.started = true;
                if (p.downEvent) dragControls.start(p.downEvent);
              } catch {
                /* noop */
              }
            }}
            onPointerUp={() => {
              dragPendingRef.current = null;
            }}
            onPointerCancel={() => {
              dragPendingRef.current = null;
            }}
            onDragEnd={(_e, info) => {
              try {
                const dy = info?.offset?.y ?? 0;
                const vy = info?.velocity?.y ?? 0;
                if (dy > 120 || vy > 900) {
                  onClose();
                }
              } catch {
                /* noop */
              }
            }}
          >
            <div
              data-sheet-handle="1"
              className="mx-auto mt-2 mb-1 h-1 w-12 shrink-0 rounded-full bg-zinc-600"
              aria-hidden
            />
            {!hideHeader && (
              <>
                <div
                  className="sticky top-0 z-10 flex flex-row items-center justify-between rounded-t-3xl px-6 pb-2 pt-4"
                  style={{ backgroundColor: sheetBg }}
                >
                  <div className="relative flex flex-1 items-center justify-center">
                    {title && <span className="w-full text-center text-lg font-bold text-white">{title}</span>}
                    <button
                      type="button"
                      className="absolute right-0 ml-2 rounded-full p-1 text-2xl text-zinc-400 transition hover:text-white"
                      onClick={onClose}
                      aria-label="Закрыть"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mb-2 h-px w-full bg-zinc-700" />
              </>
            )}
            {fullBleedTop ? (
              <div className="flex-1 overflow-y-auto" data-sheet-scroll="1" style={{ padding: 0 }}>
                {children}
              </div>
            ) : (
              <div
                className={`flex-1 overflow-y-auto px-6 pt-2${hideHeader ? " pt-4" : ""} ${actions ? "pb-4" : compact ? "pb-4" : "pb-6"}`}
                data-sheet-scroll="1"
              >
                {children}
              </div>
            )}
            {actions && (
              <div
                className="sticky bottom-0 left-0 z-20 flex w-full gap-4 rounded-b-3xl px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
                style={{ backgroundColor: sheetBg }}
              >
                {actions}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return mounted && portalEl ? createPortal(content, portalEl) : null;
}
