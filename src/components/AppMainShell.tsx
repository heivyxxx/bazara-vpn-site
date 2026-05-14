"use client";

import type { ReactNode } from "react";

const shell =
  "wide-shell w-full max-w-full box-border px-3 flex flex-1 flex-col min-h-0";

/**
 * Как Bazara: main на всю высоту, внутри — wide-shell (на ≥900px max-width 1400px по центру) и боковые отступы 12px.
 */
export function AppMainShell({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  /** Доп. классы на main (например items-center) */
  className?: string;
  /** Доп. классы на внутренний wide-shell (например items-center) */
  innerClassName?: string;
}) {
  return (
    <main
      className={`min-h-screen w-full flex flex-col box-border pt-[calc(env(safe-area-inset-top,0px)+72px)] pb-[calc(env(safe-area-inset-bottom,0px)+var(--bottom_nav_h,88px)+4px)] ${className}`.trim()}
    >
      <div className={`${shell} ${innerClassName}`.trim()}>{children}</div>
    </main>
  );
}
