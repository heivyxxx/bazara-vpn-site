"use client";
import { useState } from "react";

const ADMIN_SECTIONS = [
  { path: "/admin/panel", label: "Общая панель" },
  // { path: "/admin/links", label: "Ссылки" },
  // { path: "/admin/support", label: "Поддержка" },
  { path: "/admin/reviews", label: "Отзывы" },
  // { path: "/admin/referrals", label: "Рефералы" },
  // { path: "/admin/issues", label: "Тикеты" },
];

export default function AdminHome() {
  const [authed, setAuthed] = useState(typeof window !== 'undefined' && sessionStorage.getItem('adminAuthed') === '1');
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem('adminAuthed', '1');
      setAuthed(true);
    } else {
      setError("Неверный пароль");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="bg-[#18181b] p-8 rounded-2xl shadow-lg flex flex-col gap-4 w-full max-w-xs">
          <div className="text-white text-2xl font-bold text-center mb-2">Вход в админку</div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded-xl px-4 py-3 bg-[#23232b] text-white text-lg outline-none border border-[#23232b] focus:border-[#fd6a32]"
            />
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button type="submit" className="py-3 rounded-xl bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-bold text-lg transition">Войти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="text-white text-2xl font-bold mb-8">Админка</div>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {ADMIN_SECTIONS.map(s => (
          <a key={s.path} href={s.path} className="py-4 rounded-xl bg-[#23232b] hover:bg-[#23232b]/80 text-white text-lg font-semibold text-center border border-[#23232b] transition">
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
} 