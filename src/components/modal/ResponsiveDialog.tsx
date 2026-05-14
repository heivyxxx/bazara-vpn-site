"use client";

import type { ReactNode } from "react";
import { useIsWide } from "@/hooks/useIsWide";
import ModalBottomSheet from "./ModalBottomSheet";
import ModalDesktop from "./ModalDesktop";

export type ResponsiveDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Нижняя панель действий (на мобиле — как в Bazara `actions`, на ПК — под контентом) */
  footer?: ReactNode;
  hideHeader?: boolean;
  compact?: boolean;
  fullBleedTop?: boolean;
  sheetClassName?: string;
  sheetBg?: string;
  desktopClassName?: string;
  desktopMaxWidthClass?: string;
  desktopContentClassName?: string;
};

/**
 * Как в Bazara: &lt;900px — {@link ModalBottomSheet}, иначе — {@link ModalDesktop}.
 */
export function ResponsiveDialog({
  open,
  onClose,
  title,
  children,
  footer,
  hideHeader,
  compact,
  fullBleedTop,
  sheetClassName,
  sheetBg = "#18181b",
  desktopClassName,
  desktopMaxWidthClass,
  desktopContentClassName,
}: ResponsiveDialogProps) {
  const isWide = useIsWide(900);

  if (isWide) {
    return (
      <ModalDesktop
        open={open}
        onClose={onClose}
        title={title}
        className={desktopClassName}
        maxWidthClass={desktopMaxWidthClass}
        contentClassName={
          desktopContentClassName ??
          "p-0 flex flex-col max-h-[min(85vh,800px)] min-h-0 overflow-hidden"
        }
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3" data-sheet-scroll="1">
            {children}
          </div>
          {footer != null ? (
            <div className="flex shrink-0 gap-3 border-t border-white/10 bg-[#111112]/95 px-4 py-3">
              {footer}
            </div>
          ) : null}
        </div>
      </ModalDesktop>
    );
  }

  return (
    <ModalBottomSheet
      open={open}
      onClose={onClose}
      title={title}
      actions={footer}
      hideHeader={hideHeader}
      compact={compact}
      fullBleedTop={fullBleedTop}
      className={sheetClassName}
      sheetBg={sheetBg}
    >
      {children}
    </ModalBottomSheet>
  );
}
