"use client";

import { useState, useLayoutEffect } from "react";

/** Совпадает с Bazara: десктоп от 900px. */
export function useIsWide(breakpointPx = 900): boolean {
  const [wide, setWide] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= breakpointPx : false
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    const fn = () => setWide(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [breakpointPx]);

  return wide;
}
