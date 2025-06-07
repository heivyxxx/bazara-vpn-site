"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function PanelPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [days, setDays] = useState(30);
  const [genLoading, setGenLoading] = useState(false);
  const [genLink, setGenLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [showMonths, setShowMonths] = useState(false);
  const daysInputRef = useRef<HTMLInputElement>(null);
  const [numLinks, setNumLinks] = useState(1);
  const [linksList, setLinksList] = useState<string[]>([]);

  async function handleCleanExpired() {
    setLoading(true);
    setResult("");
    try {
      const resp = await fetch("https://vpn.bazara.app:5001/clean_expired", { method: "POST" });
      const data = await resp.json();
      if (data && typeof data.removed === "number") {
        setResult(`Удалено пользователей: ${data.removed}`);
      } else if (data && data.status === "ok") {
        setResult("Устаревшие пользователи удалены!");
      } else {
        setResult("Готово, но сервер не вернул подробностей.");
      }
    } catch (e) {
      setResult("Ошибка соединения или сервера");
    } finally {
      setLoading(false);
    }
  }

  function handleMonthSelect(m: number): void {
    setDays(m * 30);
    setTimeout(() => daysInputRef.current && daysInputRef.current.focus(), 100);
  }

  async function handleGenerateLinkBatch() {
    if (!days || days < 1 || !numLinks || numLinks < 1) return;
    setGenLoading(true);
    setLinksList([]);
    setGenLink("");
    setCopySuccess(false);
    function genRandomKey(len = 8) {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let out = '';
      for (let i = 0; i < len; ++i) out += chars[Math.floor(Math.random() * chars.length)];
      return out;
    }
    let newLinks = [];
    for (let i = 0; i < numLinks; ++i) {
      const taskId = genRandomKey(8);
      try {
        const resp = await fetch("https://vpn.bazara.app/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task_id: taskId, package_days: days, creator: 'admin' })
        });
        const data = await resp.json();
        if (data && data.status === "ok") {
          newLinks.push(`https://vpn.bazara.app/vless/${taskId}`);
        } else {
          newLinks.push("Ошибка генерации");
        }
        setLinksList([...newLinks]);
      } catch {
        newLinks.push("Ошибка генерации");
        setLinksList([...newLinks]);
      }
    }
    setGenLoading(false);
  }

  function handleCopyLink(link: string): void {
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    });
  }

  return (
    <main className="w-full max-w-2xl mx-auto flex flex-col gap-10 py-16 px-4 items-center">
      <h1 className="text-3xl font-extrabold text-white mb-12">Общая панель</h1>
      <div className="flex flex-col md:flex-row gap-10 w-full justify-center items-center">
        {/* Блок: Удалить устаревших пользователей */}
        <div
          className="bg-[#232323] rounded-3xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer max-w-xs w-full border border-[#333]"
          onClick={handleCleanExpired}
          style={{ minWidth: 260 }}
        >
          <Image src="/assets/old.png" alt="Удалить устаревших" width={120} height={120} className="mb-4" />
          <div className="text-xl font-bold text-white mb-2 text-center">Удалить устаревших пользователей</div>
          <div className="text-base text-gray-400 text-center">Автоматически удаляет пользователей, у которых закончился срок действия подписки.</div>
          {loading && <div className="mt-4 text-orange-400 font-semibold">Удаление...</div>}
          {result && <div className="mt-4 text-orange-400 font-semibold">{result}</div>}
        </div>
        {/* Блок: Посмотреть все ссылки */}
        <div
          className="bg-[#232323] rounded-3xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer max-w-xs w-full border border-[#333]"
          onClick={() => window.location.href = '/admin/links'}
          style={{ minWidth: 260 }}
        >
          <Image src="/assets/link-3d.png" alt="Все ссылки" width={120} height={120} className="mb-4" />
          <div className="text-xl font-bold text-white mb-2 text-center">Посмотреть все ссылки</div>
          <div className="text-base text-gray-400 text-center">Просмотр, фильтрация и удаление всех сгенерированных VPN-ссылок.</div>
        </div>
      </div>
    </main>
  );
} 