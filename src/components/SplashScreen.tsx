"use client";

import React from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { ungzip } from "pako";

/** Как в Bazara: загрузка .tgs (gzip JSON) для Lottie */
export async function loadTgs(path: string): Promise<any | null> {
  try {
    const resp = await fetch(path, { cache: "no-store" });
    if (!resp.ok) return null;
    const buf = new Uint8Array(await resp.arrayBuffer());
    try {
      const jsonStr = new TextDecoder("utf-8").decode(ungzip(buf));
      return JSON.parse(jsonStr);
    } catch {
      try {
        const text = new TextDecoder("utf-8").decode(buf);
        return JSON.parse(text);
      } catch {
        return null;
      }
    }
  } catch {
    return null;
  }
}

async function loadJson(path: string): Promise<any | null> {
  try {
    const r = await fetch(path, { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

type SplashProps = {
  show: boolean;
  onComplete?: () => void;
  forceBan?: { reason?: string; until?: string } | null;
  progress?: number;
};

/** 1:1 с Bazara/src/components/Splash.tsx */
function Splash({
  show,
  onComplete,
  forceBan,
  progress,
}: SplashProps) {
  /** Нельзя вычислять «браузер» на уровне модуля: в Mini App user/initData часто появляются после первого тика. */
  const [inMiniApp, setInMiniApp] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    try {
      (window as any).Telegram?.WebApp?.ready?.();
    } catch {}
    setInMiniApp(!!(window as any).Telegram?.WebApp);
  }, []);
  const showRocketUi = inMiniApp !== false;

  const [internalProgress, setInternalProgress] = React.useState(0);
  const prog = typeof progress === "number" ? progress : internalProgress;
  const [anim, setAnim] = React.useState<any>(null);
  const [barAnim, setBarAnim] = React.useState<any>(null);
  const [fade, setFade] = React.useState(1);
  const [rocketEnter, setRocketEnter] = React.useState(false);
  const mountedAtRef = React.useRef<number | null>(null);
  const barRef = React.useRef<LottieRefCurrentProps | null>(null);
  const FADE_MS = 300;

  React.useEffect(() => {
    if (typeof progress === "number") return;
    if (!show || !!forceBan) return;
    let raf = 0;
    const start = performance.now();
    const duration1 = 1900;
    const duration2 = 500;
    const total = duration1 + duration2;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < duration1) {
        const t = easeOutCubic(elapsed / duration1);
        setInternalProgress(5 + (96 - 5) * t);
        raf = requestAnimationFrame(tick);
      } else if (elapsed < duration1 + duration2) {
        const t = easeOutCubic((elapsed - duration1) / duration2);
        setInternalProgress(96 + (100 - 96) * t);
        raf = requestAnimationFrame(tick);
      } else {
        setInternalProgress(100);
        try {
          window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.("success");
        } catch {}
        onComplete && onComplete();
      }

      if (elapsed >= total - FADE_MS && elapsed <= total) {
        const tf = Math.min(
          1,
          Math.max(0, (elapsed - (total - FADE_MS)) / FADE_MS)
        );
        const next = 1 - 0.7 * tf;
        setFade(next);
      } else if (elapsed < total - FADE_MS) {
        setFade(1);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [show, onComplete, forceBan, progress]);

  React.useEffect(() => {
    if (typeof progress !== "number") return;
    if (!show) return;
    if (prog >= 100) {
      try {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.("success");
      } catch {}
      const t = setTimeout(() => {
        onComplete && onComplete();
      }, 120);
      setFade(0.3);
      return () => clearTimeout(t);
    } else {
      setFade(1);
    }
  }, [prog, progress, show, onComplete]);

  React.useEffect(() => {
    if (!barAnim || !barRef.current) return;
    const totalFrames =
      typeof barAnim?.op === "number" ? barAnim.op : 100;
    const frame = Math.max(
      0,
      Math.min(totalFrames, (prog / 100) * totalFrames)
    );
    try {
      barRef.current.goToAndStop(frame, true);
    } catch {}
  }, [prog, barAnim]);

  React.useEffect(() => {
    (async () => {
      const data = await loadTgs("/assets/rocket.tgs");
      if (data) setAnim(data);
    })();
  }, []);

  React.useEffect(() => {
    if (!showRocketUi || !anim) return;
    if (!mountedAtRef.current) mountedAtRef.current = performance.now();
    const MIN_DELAY = 300;
    const elapsed = performance.now() - (mountedAtRef.current || 0);
    if (elapsed >= MIN_DELAY) {
      setRocketEnter(true);
    } else {
      const t = setTimeout(() => setRocketEnter(true), MIN_DELAY - elapsed);
      return () => clearTimeout(t);
    }
  }, [anim, showRocketUi]);

  React.useEffect(() => {
    (async () => {
      const a = await loadJson("/assets/Loading%20bar.json");
      if (a) setBarAnim(a);
    })();
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9998] bg-black flex flex-col items-center justify-center">
      {forceBan ? (
        <div className="flex flex-col items-center justify-center">
          <BanAnim />
          <div className="text-white text-center mt-4">
            <div className="font-extrabold text-lg mb-1">
              Упс... Видимо пока зайти не получится.
            </div>
            {forceBan?.until && (
              <div className="text-sm text-zinc-300">
                Срок блокировки:{" "}
                {new Date(forceBan.until).toLocaleString()}
              </div>
            )}
            {forceBan?.reason && (
              <div className="text-sm text-zinc-300 mt-1">
                Причина: {forceBan.reason}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {showRocketUi && (
            <div
              className="w-28 h-28 mb-6 select-none flex items-center justify-center"
              style={{
                position: "relative",
                zIndex: 2,
                opacity: rocketEnter ? fade : 0,
                transform: rocketEnter
                  ? "translate3d(0,0,0) rotate(0deg) scale(1)"
                  : "translate3d(-45vw,22vh,0) rotate(-22deg) scale(0.92)",
                transition:
                  "opacity 220ms ease-out, transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform, opacity",
                pointerEvents: "none",
              }}
            >
              {anim && (
                <Lottie
                  animationData={anim}
                  loop
                  autoplay
                  style={{ width: 112, height: 112 }}
                />
              )}
            </div>
          )}
          <div
            className="mt-2 select-none w-full flex items-center justify-center"
            style={{
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 0 8px rgba(254,97,37,0.25))",
              opacity: barAnim ? fade : 0,
              transition: "opacity 120ms ease-out",
            }}
          >
            {barAnim && (
              <Lottie
                lottieRef={barRef}
                animationData={barAnim}
                loop={false}
                autoplay={false}
                style={{ width: 1024, height: 192 }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

const BanAnim: React.FC = () => {
  const [data, setData] = React.useState<any | null>(null);
  React.useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("/assets/ban.tgs");
        if (!resp.ok) return;
        const buf = new Uint8Array(await resp.arrayBuffer());
        const jsonStr = new TextDecoder("utf-8").decode(ungzip(buf));
        setData(JSON.parse(jsonStr));
      } catch {}
    })();
  }, []);
  if (!data) return null;
  return (
    <Lottie animationData={data} loop autoplay style={{ width: 220, height: 220 }} />
  );
};

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 5000
): Promise<Response | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") return null;
    throw err;
  }
}

/** Как GlobalSplash в Bazara/src/main.tsx */
const GlobalSplash: React.FC = () => {
  const [show, setShow] = React.useState(true);
  const [ban, setBan] = React.useState<{
    reason?: string;
    until?: string;
  } | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const tgUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;
        if (!tgUser?.id) return;
        const res = await fetchWithTimeout(
          "/api/get-user",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telegram_id: String(tgUser.id) }),
          },
          5000
        );
        if (res && res.ok) {
          const json = await res.json().catch(() => ({}));
          const u = json?.user;
          if (
            u?.banned_until &&
            new Date(u.banned_until).getTime() > Date.now()
          ) {
            setBan({
              reason: u.banned_reason || undefined,
              until: u.banned_until,
            });
          }
        }
      } catch {}
    })();
  }, []);

  return (
    <Splash
      show={!!ban || show}
      onComplete={() => setShow(false)}
      forceBan={ban}
    />
  );
};

export function SplashScreen() {
  return <GlobalSplash />;
}
