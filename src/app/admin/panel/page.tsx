"use client";
import { useState, useRef } from "react";
import Image from "next/image";

async function generateAdminLinks(days: number, count: number, user_id: string) {
  const links: string[] = [];
  for (let i = 0; i < count; ++i) {
    const resp = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, package_days: days, is_admin: true })
    });
    const data = await resp.json();
    if (data && data.success && data.link) {
      links.push(data.link);
    } else {
      links.push("Ошибка генерации");
    }
  }
  return links;
}

export default function AdminPanel() {
  const [showModal, setShowModal] = useState(false);
  const [days, setDays] = useState(30);
  const [numLinks, setNumLinks] = useState(1);
  const [genLoading, setGenLoading] = useState(false);
  const [linksList, setLinksList] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const daysInputRef = useRef<HTMLInputElement>(null);
  const user_id = "admin";

  const handleGenerate = async () => {
    setGenLoading(true);
    setLinksList([]);
    setCopySuccess(false);
    const links = await generateAdminLinks(days, numLinks, user_id);
    setLinksList(links);
    setGenLoading(false);
  };

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1200);
    });
  };

  return (
    <main className="w-full max-w-2xl mx-auto flex flex-col gap-10 py-16 px-4 items-center">
      <h1 className="text-3xl font-extrabold text-white mb-12">Общая панель</h1>
      <div className="flex flex-col md:flex-row gap-10 w-full justify-center items-center">
        {/* Блок: Генерация ссылок */}
        <div
          className="bg-[#232323] rounded-3xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer max-w-xs w-full border border-[#333]"
          onClick={() => setShowModal(true)}
          style={{ minWidth: 260 }}
        >
          <Image src="/assets/link-3d.png" alt="Генерация ссылок" width={120} height={120} className="mb-4" />
          <div className="text-xl font-bold text-white mb-2 text-center">Создать ссылки</div>
          <div className="text-base text-gray-400 text-center">Быстрая генерация VPN-ссылок на любой срок и количество.</div>
        </div>
        {/* Блок: Удалить устаревших пользователей */}
        <div
          className="bg-[#232323] rounded-3xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer max-w-xs w-full border border-[#333]"
          onClick={() => alert('Функция удаления устаревших пользователей реализуется отдельно.')}
          style={{ minWidth: 260 }}
        >
          <Image src="/assets/old.png" alt="Удалить устаревших" width={120} height={120} className="mb-4" />
          <div className="text-xl font-bold text-white mb-2 text-center">Удалить устаревших пользователей</div>
          <div className="text-base text-gray-400 text-center">Автоматически удаляет пользователей, у которых закончился срок действия подписки.</div>
        </div>
      </div>
      {/* Модалка генерации ссылок */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#232323] rounded-3xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center animate-fade-in relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-orange-400 font-bold">&times;</button>
            <div className="text-xl font-bold text-white mb-4">Создать ссылки</div>
            <div className="w-full flex flex-col gap-3 mb-4">
              <label className="text-white text-base font-semibold mb-1">Срок действия (дней):</label>
              <input ref={daysInputRef} type="number" min={1} max={9999} value={days} onChange={e => setDays(Number(e.target.value))} className="w-full rounded-lg px-4 py-3 text-base text-white font-semibold bg-[#181818] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-center" />
              <label className="text-white text-base font-semibold mb-1 mt-2">Количество ссылок:</label>
              <input type="number" min={1} max={50} value={numLinks} onChange={e => setNumLinks(Number(e.target.value))} className="w-full rounded-lg px-4 py-3 text-base text-white font-semibold bg-[#181818] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-center" />
            </div>
            <button
              onClick={handleGenerate}
              disabled={genLoading || !days || days < 1 || !numLinks || numLinks < 1}
              className="w-full bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold rounded-xl px-6 py-3 text-lg shadow hover:scale-105 transition-transform mb-2 disabled:opacity-60"
            >
              {genLoading ? `Генерация... (${linksList.length}/${numLinks})` : "Создать"}
            </button>
            {linksList.length > 0 && (
              <div className="w-full mt-4 flex flex-col items-center gap-2 max-h-60 overflow-y-auto">
                {linksList.map((link, idx) => (
                  <div key={idx} className="w-full flex gap-2 items-center mb-1">
                    <input type="text" readOnly value={link} className="flex-1 rounded-lg px-2 py-1 text-base text-white bg-[#181818] select-all" />
                    <button onClick={() => handleCopy(link)} className="bg-orange-500 text-white font-bold rounded-xl px-2 py-1 shadow hover:bg-orange-600 transition-transform">Скопировать</button>
                  </div>
                ))}
                {copySuccess && <div className="text-green-400 mt-2">Скопировано!</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
} 