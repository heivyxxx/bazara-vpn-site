"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      setError("Неверный email или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <form
        onSubmit={handleLogin}
        className="bg-card rounded-2xl shadow-orange px-8 py-10 w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-3xl font-extrabold text-orange-400 mb-2 text-center">Вход в админку</h1>
        <input
          type="email"
          placeholder="Email"
          className="rounded-xl px-4 py-3 bg-[#181818] text-white border border-[#333] focus:outline-none focus:border-orange-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="rounded-xl px-4 py-3 bg-[#181818] text-white border border-[#333] focus:outline-none focus:border-orange-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-400 text-center">{error}</div>}
        <button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold px-7 py-3 rounded-xl shadow hover:scale-105 transition-transform"
          disabled={loading}
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
} 