"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// --- Укажи здесь адрес своего Python-бэкенда! ---
const API_URL = "https://vpn.bazara.app";
// Например: const API_URL = "https://vpn.bazara.app:5010";

const MONTHS = [
  { label: "1м+", days: 30 },
  { label: "2м+", days: 60 },
  { label: "3м+", days: 90 },
  { label: "4м+", days: 120 },
  { label: "5м+", days: 150 },
  { label: "6м+", days: 180 },
  { label: "7м+", days: 210 },
  { label: "8м+", days: 240 },
  { label: "9м+", days: 270 },
  { label: "10м+", days: 300 },
  { label: "11м+", days: 330 },
  { label: "12м+", days: 360 },
];

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

interface StatusResult {
  text: string;
  color: string;
}

function getStatus(endDate: string | null | undefined): StatusResult {
  if (!endDate) return { text: "Неизвестно", color: "#888888" };
  const now = new Date();
  const end = new Date(endDate);
  if (now < end) return { text: "Активна", color: "#22d37b" };
  return { text: "Истекла", color: "#ff4444" };
}

function getDaysLeft(endDate: string | null | undefined): string {
  if (!endDate) return "-";
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Истекла";
  return `${diff} дн.`;
}

interface Link {
  key?: string;
  creator?: string;
  days?: number;
  createdAt?: string;
  endDate?: string;
}

interface DeleteAllProgress {
  step: string;
  details: string | null;
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState("all");
  const [minDays, setMinDays] = useState(0);
  const [copySuccess, setCopySuccess] = useState("");
  const [deleting, setDeleting] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [days, setDays] = useState(30);
  const [numLinks, setNumLinks] = useState(1);
  const [genLoading, setGenLoading] = useState(false);
  const [linksList, setLinksList] = useState<string[]>([]);
  const [copySuccessGen, setCopySuccessGen] = useState(false);
  const [showMonths, setShowMonths] = useState(false);
  const daysInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllPassword, setDeleteAllPassword] = useState("");
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [deleteAllProgress, setDeleteAllProgress] = useState<DeleteAllProgress | null>(null);
  const [showDeleteProgress, setShowDeleteProgress] = useState(false);
  const deleteAllInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchLinks() {
      setLoading(true);
      try {
        const resp = await fetch("https://vpn.bazara.app/api/links");
        const data = await resp.json();
        setLinks(data.links || []);
      } catch (e) {
        setLinks([]);
      }
      setLoading(false);
    }
    fetchLinks();
  }, []);

  // Polling статуса удаления
  useEffect(() => {
    if (showDeleteProgress) {
      deleteAllInterval.current = setInterval(async () => {
        const resp = await fetch(`${API_URL}/api/delete-all-users/status`);
        const data = await resp.json();
        setDeleteAllProgress(data);
        if (data.step && data.step.includes("завершено")) {
          if (deleteAllInterval.current) {
            clearInterval(deleteAllInterval.current);
          }
        }
      }, 2000);
      return () => {
        if (deleteAllInterval.current) {
          clearInterval(deleteAllInterval.current);
        }
      };
    }
  }, [showDeleteProgress]);

  function filteredLinks() {
    return links.filter(l => {
      if (creator !== "all" && l.creator !== creator) return false;
      if (minDays > 0 && (!l.days || l.days < minDays)) return false;
      if (search && !(l.key?.toLowerCase().includes(search.toLowerCase()) || (`https://vpn.bazara.app/vless/${l.key}`).toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
  }

  function handleCopy(link: string): void {
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess(link);
      setTimeout(() => setCopySuccess(""), 1500);
    });
  }

  async function handleDelete(key: string): Promise<void> {
    if (!window.confirm("Удалить ссылку? Это действие необратимо.")) return;
    setDeleting(key);
    try {
      await fetch(`${API_URL}/api/delete-user/${key}`, { method: "DELETE" });
      setLinks(links.filter(l => l.key !== key));
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Ошибка при удалении ссылки");
    }
    setDeleting("");
  }

  function handleMonthSelect(m: number): void {
    setDays(m * 30);
    setTimeout(() => daysInputRef.current && daysInputRef.current.focus(), 100);
  }

  async function handleGenerateLinkBatch() {
    if (!days || days < 1 || !numLinks || numLinks < 1) return;
    setGenLoading(true);
    setLinksList([]);
    setCopySuccessGen(false);
    function genRandomKey(len = 8) {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let out = '';
      for (let i = 0; i < len; ++i) out += chars[Math.floor(Math.random() * chars.length)];
      return out;
    }
    const newLinks: string[] = [];
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

  function handleCopyGen(link: string): void {
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccessGen(true);
      setTimeout(() => setCopySuccessGen(false), 1500);
    });
  }

  async function handleDeleteAllUsers() {
    setDeleteAllLoading(true);
    setDeleteAllProgress(null);
    setShowDeleteProgress(true);
    try {
      const resp = await fetch(`${API_URL}/api/delete-all-users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deleteAllPassword })
      });
      const data = await resp.json();
      if (resp.status !== 200) {
        setDeleteAllProgress({ step: data.error || "Ошибка", details: null });
        setDeleteAllLoading(false);
        return;
      }
    } catch (e) {
      setDeleteAllProgress({ step: "Ошибка запуска удаления", details: String(e) });
    }
    setDeleteAllLoading(false);
    setShowDeleteAllModal(false);
  }

  return (
    <main className="w-full max-w-2xl mx-auto flex flex-col gap-10 py-16 px-4 items-center">
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:4,alignSelf:'flex-start',width:'100%'}}>
        <button
          onClick={() => window.location.href = '/admin'}
          style={{background:'none',border:'none',padding:0,marginBottom:2,cursor:'pointer',outline:'none'}}
          title="Назад"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff8800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transition:'stroke 0.2s'}}><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-8">Все ссылки</h1>
      <div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
        <button
          onClick={() => { setShowModal(true); setDays(30); setNumLinks(1); setLinksList([]); setCopySuccessGen(false); }}
          className="flex-1 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold rounded-xl px-6 py-4 text-lg shadow hover:scale-105 transition-transform"
        >
          Создать ссылку
        </button>
        <button
          onClick={() => { setShowDeleteAllModal(true); setDeleteAllPassword(""); setDeleteAllProgress(null); }}
          className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl px-6 py-4 text-lg shadow hover:scale-105 transition-transform"
        >
          Удалить всех пользователей
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#232323] rounded-3xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center animate-fade-in relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-orange-400 font-bold">&times;</button>
            <div className="text-xl font-bold text-white mb-4">Создать тестовые ссылки</div>
            <div className="w-full flex flex-col gap-3 mb-4">
              <label className="text-white text-base font-semibold mb-1">Срок действия (дней):</label>
              <div className="flex gap-2 w-full">
                <input ref={daysInputRef} type="number" min={1} max={9999} value={days} onChange={e => setDays(Number(e.target.value))} className="flex-1 rounded-lg px-4 py-3 text-base text-white font-semibold bg-[#181818] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" style={{textAlign:'center'}} />
                <div className="relative">
                  <button type="button" className="bg-[#444] text-white rounded-lg px-3 py-2 font-semibold hover:bg-orange-500 transition" onClick={e => { e.preventDefault(); e.stopPropagation(); setShowMonths(s => !s); }}>Месяцы ▼</button>
                  {showMonths && (
                    <div className="absolute left-0 top-full mt-1 bg-[#232323] border border-orange-400 rounded-xl shadow-lg z-10 w-32 max-h-64 overflow-y-auto">
                      {[...Array(12)].map((_, i) => (
                        <button key={i+1} className="block w-full text-left px-4 py-2 hover:bg-orange-500 hover:text-white text-white" onClick={() => { handleMonthSelect(i+1); setShowMonths(false); }}>{i+1} мес. ({(i+1)*30} д.)</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <label className="text-white text-base font-semibold mb-1 mt-2">Количество ссылок:</label>
              <input type="number" min={1} max={50} value={numLinks} onChange={e => setNumLinks(Number(e.target.value))} className="w-full rounded-lg px-4 py-3 text-base text-white font-semibold bg-[#181818] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-center" />
            </div>
            <button
              onClick={handleGenerateLinkBatch}
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
                    <button onClick={() => handleCopyGen(link)} className="bg-orange-500 text-white font-bold rounded-xl px-2 py-1 shadow hover:bg-orange-600 transition-transform">Скопировать</button>
                  </div>
                ))}
                {copySuccessGen && <div className="text-green-400 mt-2">Скопировано!</div>}
              </div>
            )}
          </div>
        </div>
      )}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#232323] rounded-3xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center animate-fade-in relative">
            <button onClick={() => setShowDeleteAllModal(false)} className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-orange-400 font-bold">&times;</button>
            <div className="text-xl font-bold text-white mb-4">Удалить всех пользователей</div>
            <div className="text-red-400 text-center mb-4">Это действие <b>необратимо</b>!<br/>Все пользователи и конфиги будут удалены.</div>
            <input
              type="password"
              placeholder="Введите пароль..."
              value={deleteAllPassword}
              onChange={e => setDeleteAllPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-base text-white font-semibold bg-[#181818] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-center mb-4"
              disabled={deleteAllLoading}
            />
            <button
              onClick={handleDeleteAllUsers}
              disabled={deleteAllLoading || !deleteAllPassword}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl px-6 py-3 text-lg shadow hover:scale-105 transition-transform mb-2 disabled:opacity-60"
            >
              {deleteAllLoading ? "Запуск..." : "Удалить всех"}
            </button>
            {deleteAllProgress && <div className="text-red-400 mt-2">{deleteAllProgress.step}</div>}
          </div>
        </div>
      )}
      {showDeleteProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#232323] rounded-3xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center animate-fade-in relative">
            <button onClick={() => { setShowDeleteProgress(false); setDeleteAllProgress(null); }} className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-orange-400 font-bold">&times;</button>
            <div className="text-xl font-bold text-white mb-4">Прогресс удаления</div>
            <div className="w-full text-white text-base mb-2 min-h-[60px]" style={{whiteSpace:'pre-line'}}>
              {deleteAllProgress ? (
                <>
                  <div>{deleteAllProgress.step}</div>
                  {deleteAllProgress.details && <div className="text-orange-400 text-xs mt-2">{deleteAllProgress.details}</div>}
                </>
              ) : "Ожидание..."}
            </div>
            {deleteAllProgress && deleteAllProgress.step && deleteAllProgress.step.includes("завершено") && (
              <button onClick={() => setShowDeleteProgress(false)} className="w-full bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold rounded-xl px-6 py-3 text-lg shadow hover:scale-105 transition-transform mt-4">Закрыть</button>
            )}
          </div>
        </div>
      )}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Поиск по ссылке или ключу..."
        className="w-full mb-6 rounded-xl px-4 py-2 text-lg font-semibold bg-[#181818] text-white border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <div className="flex gap-4 mb-8 w-full justify-center">
        <select value={creator} onChange={e => setCreator(e.target.value)} className="rounded-xl px-4 py-2 text-lg font-semibold bg-[#181818] text-white border border-orange-400">
          <option value="all">Все</option>
          <option value="admin">Админ</option>
          <option value="user">Юзер</option>
        </select>
        <select value={minDays} onChange={e => setMinDays(Number(e.target.value))} className="rounded-xl px-4 py-2 text-lg font-semibold bg-[#181818] text-white border border-orange-400">
          <option value={0}>Любой срок</option>
          {MONTHS.map(m => <option key={m.days} value={m.days}>{m.label}</option>)}
        </select>
      </div>
      {loading ? (
        <div className="text-lg text-gray-300">Загрузка...</div>
      ) : filteredLinks().length === 0 ? (
        <div className="text-lg text-gray-400">Нет ссылок по выбранным фильтрам.</div>
      ) : (
        <div className="w-full flex flex-col gap-6">
          {filteredLinks().map((l, idx) => {
            const created = l.createdAt ? new Date(l.createdAt) : null;
            const end = created && l.days ? new Date(created.getTime() + l.days*24*60*60*1000) : null;
            const status = end ? getStatus(end.toISOString()) : { text: "-", color: "#aaa" };
            const key = l.key || `unknown-${idx}`;
            return (
              <div key={key} className="bg-[#232323] rounded-2xl shadow-xl px-6 py-5 flex flex-col gap-2 border border-[#333] relative">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl select-all font-mono text-white break-all flex-1">https://vpn.bazara.app/vless/{key}</span>
                  <span title={l.creator === 'admin' ? 'Админ' : 'Юзер'} className="ml-2 text-2xl">{l.creator === 'admin' ? '👑' : '👤'}</span>
                  <button onClick={() => handleCopy(`https://vpn.bazara.app/vless/${key}`)} className="ml-2 bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold rounded-xl px-3 py-1 shadow hover:scale-105 transition-transform text-base">
                    Копировать
                  </button>
                  {copySuccess === `https://vpn.bazara.app/vless/${key}` && <span className="text-green-400 ml-2">Скопировано!</span>}
                  <button onClick={() => handleDelete(key)} disabled={deleting===key} className="ml-2 bg-[#2c2c2c] text-red-400 rounded-xl px-2 py-1 shadow hover:bg-red-600 hover:text-white transition-transform text-base disabled:opacity-60">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
                  </button>
                </div>
                <div className="text-lg space-y-1">
                  <div><span className="text-gray-500">Создано:</span> {created ? formatDate(created.toISOString()) : '-'}</div>
                  <div><span className="text-gray-500">Период:</span> {l.days ? `${l.days} дней` : '-'}</div>
                  <div><span className="text-gray-500">Истекает:</span> {end ? formatDate(end.toISOString()) : '-'}</div>
                  <div><span className="text-gray-500">Осталось:</span> {end ? getDaysLeft(end.toISOString()) : '-'}</div>
                  <div className="flex items-center gap-2"><span className="text-gray-500">Статус:</span> <span className="inline-flex items-center gap-1"><span style={{background:status.color, borderRadius:'50%', width:10, height:10, display:'inline-block'}}></span> <span style={{color:status.color}}>{status.text}</span></span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
} 