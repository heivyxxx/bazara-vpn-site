"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, arrayUnion, query, orderBy } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

interface Message {
  sender: string;
  text: string;
  timestamp: number;
}
interface Chat {
  id: string;
  userId: string;
  messages: Message[];
  status: string;
}

export default function SupportPage() {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selected, setSelected] = useState<number>(0);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const msgEndRef = useRef<HTMLDivElement>(null);

  // Auth protection
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/admin/login");
      else setLoading(false);
    });
    return () => unsub();
  }, [router]);

  // Fetch chats
  const fetchChats = async () => {
    setRefreshing(true);
    const q = query(collection(db, "supportChats"));
    const snap = await getDocs(q);
    const arr: Chat[] = [];
    snap.forEach(docu => {
      const d = docu.data();
      arr.push({
        id: docu.id,
        userId: d.userId,
        messages: d.messages || [],
        status: d.status || "read"
      });
    });
    // Сортируем по времени последнего сообщения (новые сверху)
    arr.sort((a, b) => {
      const t1 = a.messages.length ? a.messages[a.messages.length-1].timestamp : 0;
      const t2 = b.messages.length ? b.messages[b.messages.length-1].timestamp : 0;
      return t2 - t1;
    });
    setChats(arr);
    setRefreshing(false);
  };

  useEffect(() => {
    if (!loading) fetchChats();
    // Polling
    if (!loading && !intervalRef.current) {
      intervalRef.current = setInterval(fetchChats, 10000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading]);

  // Scroll to bottom on new message
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, selected]);

  // Отправка сообщения
  const sendMessage = async () => {
    if (!msg.trim() || sending || !chats[selected]) return;
    setSending(true);
    const chat = chats[selected];
    const ref = doc(db, "supportChats", chat.id);
    const newMsg: Message = {
      sender: "admin",
      text: msg,
      timestamp: Date.now()
    };
    await updateDoc(ref, {
      messages: arrayUnion(newMsg),
      status: "read"
    });
    setMsg("");
    await fetchChats();
    setSending(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Загрузка...</div>;

  return (
    <div className="min-h-screen flex flex-col text-white bg-dark">
      <main className="flex flex-1 w-full h-screen max-h-screen">
        {/* Список чатов */}
        <aside className="w-80 bg-[#1a1a1a] border-r border-[#232323] flex flex-col overflow-y-auto">
          <div className="p-6 pb-2 text-2xl font-bold text-orange-400 flex items-center justify-between">
            Чаты
            <button onClick={fetchChats} className="ml-2 text-sm text-orange-400 hover:text-orange-300">⟳</button>
          </div>
          <div className="flex-1 flex flex-col gap-2 p-2 pr-0 overflow-y-auto">
            {chats.length === 0 && (
              <div className="text-gray-400 text-center mt-10">Нет новых чатов</div>
            )}
            {chats.map((chat, idx) => {
              const last = chat.messages[chat.messages.length-1];
              return (
                <div
                  key={chat.id}
                  className={`chat-card flex items-center justify-between px-4 py-3 mb-1 ${selected===idx?"selected":""}`}
                  onClick={() => setSelected(idx)}
                >
                  <div>
                    <div className="font-semibold">{chat.userId}</div>
                    <div className="text-sm text-gray-400 truncate max-w-[140px]">
                      {last ? last.text : <span className="italic text-gray-500">Нет сообщений</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">
                      {last ? new Date(last.timestamp).toLocaleTimeString().slice(0,5) : "--:--"}
                    </span>
                    {chat.status === "unread" && <span className="w-3 h-3 bg-red-500 rounded-full mt-1"></span>}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
        {/* Окно чата */}
        <section className="flex-1 flex flex-col h-full">
          {/* Инфо о пользователе */}
          <div className="flex items-center gap-6 px-8 py-6 border-b border-[#232323] bg-[#232323]">
            <div className="bg-[#181818] rounded-full p-4 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 15c1.333-1 2.667-1 4 0"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/></svg>
            </div>
            <div>
              <div className="text-lg font-bold">{chats[selected]?.userId || "-"}</div>
              <div className="text-sm text-gray-400">ID: {chats[selected]?.id}</div>
            </div>
          </div>
          {/* Переписка */}
          <div className="flex-1 flex flex-col gap-1 px-8 py-6 overflow-y-auto" style={{background:'#1a1a1a'}}>
            {chats[selected]?.messages?.length ? (
              chats[selected].messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender === "admin" ? "items-end" : "items-start"}`}>
                  <div className={`msg-bubble ${m.sender === "admin" ? "msg-admin" : "msg-user"}`}>{m.text}</div>
                  <div className="msg-time" style={{textAlign: m.sender === "admin" ? "right" : "left"}}>
                    {new Date(m.timestamp).toLocaleTimeString().slice(0,5)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center mt-10">Нет сообщений</div>
            )}
            <div ref={msgEndRef}></div>
          </div>
          {/* Поле ввода */}
          <div className="px-8 py-5 bg-[#232323] border-t border-[#232323] flex gap-3">
            <input
              type="text"
              className="flex-1 rounded-xl px-4 py-3 bg-[#181818] text-white border border-[#333] focus:outline-none focus:border-orange-400"
              placeholder="Введите сообщение..."
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              disabled={sending || !chats[selected]}
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold px-7 py-3 rounded-xl shadow hover:scale-105 transition-transform"
              disabled={sending || !chats[selected] || !msg.trim()}
            >
              {sending ? "Отправка..." : "Отправить"}
            </button>
          </div>
        </section>
      </main>
      <style jsx global>{`
        .chat-card {
          background: #232323;
          border-radius: 1.2rem;
          transition: background 0.18s, box-shadow 0.18s;
          cursor: pointer;
        }
        .chat-card.selected {
          background: #2d1e3a;
          box-shadow: 0 0 0 2px #a259ff;
        }
        .chat-card:hover {
          background: #282828;
        }
        .msg-bubble {
          max-width: 70%;
          padding: 0.8em 1.2em;
          border-radius: 1.2em;
          margin-bottom: 0.5em;
          font-size: 1.08rem;
          word-break: break-word;
        }
        .msg-user {
          background: #232323;
          color: #fff;
          border-bottom-left-radius: 0.3em;
          align-self: flex-start;
        }
        .msg-admin {
          background: linear-gradient(90deg,#ff8800,#a259ff);
          color: #fff;
          border-bottom-right-radius: 0.3em;
          align-self: flex-end;
        }
        .msg-time {
          font-size: 0.85em;
          color: #aaa;
          margin-top: 0.1em;
          margin-bottom: 0.5em;
        }
        ::-webkit-scrollbar { width: 8px; background: #232323; }
        ::-webkit-scrollbar-thumb { background: #a259ff; border-radius: 8px; }
      `}</style>
    </div>
  );
} 