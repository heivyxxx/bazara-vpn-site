"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, arrayUnion, query, orderBy, addDoc, onSnapshot, setDoc, deleteDoc, writeBatch, where } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";

interface Message {
  author: string;
  message: string;
  createdAt: any;
}
interface Chat {
  chatId: string;
  messages: Message[];
}

interface ChatStatusMap {
  [chatId: string]: 'new' | 'progress' | 'done';
}

// Список имён для пользователей
const userNames = [
  "Александр В.",
  "Ксения М.",
  "Виталий К.",
  "Мария С.",
  "Игорь П.",
  "Екатерина Л.",
  "Дмитрий Т."
];

export default function SupportPage() {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selected, setSelected] = useState<number>(0);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const msgEndRef = useRef<HTMLDivElement>(null);
  const [statusMap, setStatusMap] = useState<ChatStatusMap>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayRef = useRef<number>(0);
  const prevChatsCount = useRef<number>(0);
  const prevMsgsCount = useRef<number>(0);
  const [readMap, setReadMap] = useState<{[chatId: string]: number}>({});
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Auth protection
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/admin/login");
      else setLoading(false);
    });
    return () => unsub();
  }, [router]);

  // Получение статусов чатов
  useEffect(() => {
    if (loading) return;
    const unsub = onSnapshot(collection(db, "supportChatStatus"), (snap) => {
      const map: ChatStatusMap = {};
      snap.forEach(docu => {
        const d = docu.data();
        map[docu.id] = d.status;
      });
      setStatusMap(map);
    });
    return () => unsub();
  }, [loading]);

  // Subscribe to all messages in real time
  useEffect(() => {
    if (loading) return;
    const q = query(collection(db, "supportChats"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snap) => {
      const allMsgs: any[] = [];
      snap.forEach(docu => {
        allMsgs.push({ id: docu.id, ...docu.data() });
      });
      // Группируем по chatId
      const chatMap: Record<string, Message[]> = {};
      allMsgs.forEach(m => {
        if (!m.chatId) return;
        if (!chatMap[m.chatId]) chatMap[m.chatId] = [];
        chatMap[m.chatId].push({
          author: m.author,
          message: m.message,
          createdAt: m.createdAt && m.createdAt.seconds ? m.createdAt.seconds * 1000 : Date.now()
        });
      });
      // Преобразуем в массив чатов
      const chatArr: Chat[] = Object.entries(chatMap).map(([chatId, messages]) => ({
        chatId,
        messages: messages.sort((a, b) => a.createdAt - b.createdAt)
      }));
      // Сортируем чаты по времени последнего сообщения
      chatArr.sort((a, b) => {
        const t1 = a.messages.length ? a.messages[a.messages.length-1].createdAt : 0;
        const t2 = b.messages.length ? b.messages[b.messages.length-1].createdAt : 0;
        return t2 - t1;
      });
      setChats(chatArr);
    });
    return () => unsub();
  }, [loading]);

  // Scroll to bottom on new message
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, selected]);

  // Инициализация Audio
  useEffect(() => {
    audioRef.current = new Audio("/sound.mp3");
    audioRef.current.volume = 0.8;
  }, []);

  // Звук при новых чатах/сообщениях (антиспам 2 сек)
  useEffect(() => {
    if (loading) return;
    const now = Date.now();
    let totalMsgs = 0;
    chats.forEach(chat => { totalMsgs += chat.messages.length; });
    // Новый чат или новое сообщение (от пользователя)
    const isNewChat = chats.length > prevChatsCount.current;
    let isNewUserMsg = false;
    if (!isNewChat && chats.length === prevChatsCount.current) {
      // Проверяем новые сообщения пользователя
      let prev = prevMsgsCount.current;
      for (let chat of chats) {
        for (let msg of chat.messages) {
          if (msg.author === 'user') prev--;
        }
      }
      if (prev < 0) isNewUserMsg = true;
    }
    if ((isNewChat || isNewUserMsg) && now - lastPlayRef.current > 2000) {
      audioRef.current?.pause();
      audioRef.current!.currentTime = 0;
      audioRef.current?.play();
      lastPlayRef.current = now;
    }
    prevChatsCount.current = chats.length;
    prevMsgsCount.current = 0;
    chats.forEach(chat => {
      prevMsgsCount.current += chat.messages.filter(m => m.author === 'user').length;
    });
  }, [chats, loading]);

  // Сброс непрочитанных при просмотре чата и прокрутке вниз
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.target as HTMLDivElement;
    if (!chats[selected]) return;
    // Если прокручено до самого низа
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 10) {
      const chatId = chats[selected].chatId;
      const userMsgs = chats[selected].messages.filter(m => m.author === 'user').length;
      setReadMap(prev => ({ ...prev, [chatId]: userMsgs }));
    }
  }, [chats, selected]);

  // При выборе чата сразу помечаем все сообщения как прочитанные, если уже внизу
  useEffect(() => {
    if (!chats[selected]) return;
    setTimeout(() => {
      const container = document.getElementById('chat-messages-container');
      if (container && container.scrollHeight - container.scrollTop - container.clientHeight < 10) {
        const chatId = chats[selected].chatId;
        const userMsgs = chats[selected].messages.filter(m => m.author === 'user').length;
        setReadMap(prev => ({ ...prev, [chatId]: userMsgs }));
      }
    }, 100);
  }, [selected, chats]);

  // Отправка сообщения
  const sendMessage = async () => {
    if (!msg.trim() || sending || !chats[selected]) return;
    setSending(true);
    const chatId = chats[selected].chatId;
    await addDoc(collection(db, "supportChats"), {
      chatId,
      author: "admin",
      message: msg,
      createdAt: new Date()
    });
    setMsg("");
    setSending(false);
  };

  // Установка статуса чата
  const setChatStatus = async (chatId: string, status: 'new' | 'progress' | 'done') => {
    await setDoc(doc(db, "supportChatStatus", chatId), { status }, { merge: true });
  };

  // Удаление чата (все сообщения и статус)
  const deleteChat = async (chatId: string) => {
    // Удаляем все сообщения с этим chatId
    const q = query(collection(db, "supportChats"), where("chatId", "==", chatId));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.forEach(docu => batch.delete(docu.ref));
    // Удаляем статус
    batch.delete(doc(db, "supportChatStatus", chatId));
    await batch.commit();
    // Сброс selected, если удалённый чат был выбран
    setChats(prev => {
      const idx = prev.findIndex(c => c.chatId === chatId);
      let newSelected = selected;
      if (idx === selected) {
        newSelected = 0;
      } else if (selected > idx) {
        newSelected = selected - 1;
      }
      setSelected(Math.max(0, Math.min(newSelected, prev.length - 2)));
      return prev;
    });
  };

  // Быстрые ответы
  const quickReplies = [
    "Здравствуйте! Чем можем помочь?",
    "Ваш вопрос принят, ожидайте ответа.",
    "Проблема решена, хорошего дня!",
    "Пожалуйста, уточните детали проблемы.",
    "Спасибо за обращение!"
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Загрузка...</div>;

  // Цвета статусов
  const statusColors = {
    new: '#22c55e',        // зелёный
    progress: '#ff8800',   // оранжевый
    done: '#ef4444'        // красный
  };
  const statusLabels = {
    new: 'Новый',
    progress: 'В процессе',
    done: 'Завершён'
  };

  const selectedChat = chats[selected];
  const selectedStatus = selectedChat ? (statusMap[selectedChat.chatId] || 'new') : 'new';

  return (
    <div className="min-h-screen flex flex-col text-white bg-dark">
      <main className="flex flex-1 w-full h-screen max-h-screen">
        {/* Список чатов */}
        <aside className="w-80 bg-[#1a1a1a] border-r border-[#232323] flex flex-col overflow-y-auto">
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:4}}>
            <button
              onClick={() => router.push('/admin')}
              style={{background:'none',border:'none',padding:0,marginBottom:2,cursor:'pointer',outline:'none'}}
              title="Назад"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff8800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transition:'stroke 0.2s'}}><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div className="p-6 pb-2 text-2xl font-bold text-orange-400 flex items-center justify-between" style={{paddingTop:0}}>Чаты</div>
          </div>
          <div className="flex-1 flex flex-col gap-2 p-2 pr-0 overflow-y-auto">
            {chats.length === 0 && (
              <div className="text-gray-400 text-center mt-10">Нет новых чатов</div>
            )}
            {chats.map((chat, idx) => {
              const last = chat.messages[chat.messages.length-1];
              const status = statusMap[chat.chatId] || 'new';
              const userMsgs = chat.messages.filter(m => m.author === 'user').length;
              const unread = Math.max(0, userMsgs - (readMap[chat.chatId] || 0));
              return (
                <div
                  key={chat.chatId}
                  className={`chat-card flex items-center justify-between px-4 py-3 mb-1 ${selected===idx?"selected":""}`}
                  onClick={() => setSelected(idx)}
                >
                  <div>
                    <div className="font-semibold">{chat.chatId}</div>
                    <div className="text-sm text-gray-400 truncate max-w-[140px]">
                      {last ? last.message : <span className="italic text-gray-500">Нет сообщений</span>}
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {last ? new Date(last.createdAt).toLocaleTimeString().slice(0,5) : "--:--"}
                    </span>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: statusColors[status], display: 'inline-block', border: '2px solid #232323', position: 'relative' }}>
                    </span>
                    {unread > 0 && (
                      <span style={{
                        minWidth: 24,
                        height: 24,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 12,
                        background: 'linear-gradient(90deg,#ff8800,#a259ff)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 15,
                        marginLeft: 8,
                        boxShadow: '0 2px 8px #a259ff55',
                        padding: '0 8px',
                      }}>{unread}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
        {/* Окно чата */}
        <section className="flex-1 flex flex-col h-full">
          {/* Инфо о чате и кнопка статуса */}
          <div className="flex items-center gap-6 px-8 py-6 border-b border-[#232323] bg-[#232323] justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-[#181818] rounded-full p-4 flex items-center justify-center shadow-lg">
                <img src="/trader.png" alt="avatar" style={{width:48,height:48,borderRadius:'50%',objectFit:'cover',boxShadow:'0 2px 8px #a259ff55',border:'2px solid #a259ff'}} onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/trader.gif'}} />
              </div>
              <div>
                <div className="text-lg font-bold">{chats[selected]?.chatId || "-"}</div>
              </div>
            </div>
            {/* Кнопка смены статуса */}
            {(() => {
              const chatId = chats[selected]?.chatId;
              const status = statusMap[chatId] || 'new';
              if (status === 'new') {
                return <button onClick={() => setChatStatus(chatId, 'progress')} style={{background: statusColors.progress, color: '#232323', fontWeight: 700, borderRadius: 12, padding: '10px 22px', fontSize: 18, boxShadow: '0 2px 8px #facc1555', border: 'none', cursor: 'pointer'}}>Выполняю</button>;
              } else if (status === 'progress') {
                return <button onClick={() => setChatStatus(chatId, 'done')} style={{background: statusColors.done, color: '#fff', fontWeight: 700, borderRadius: 12, padding: '10px 22px', fontSize: 18, boxShadow: '0 2px 8px #22c55e55', border: 'none', cursor: 'pointer'}}>Завершено</button>;
              } else if (status === 'done') {
                return <div style={{display:'flex',gap:16,alignItems:'center'}}>
                  <button
                    onClick={()=>setShowUnlockModal(true)}
                    style={{background: statusColors.done, color: '#fff', fontWeight: 700, borderRadius: 12, padding: '10px 22px', fontSize: 18, boxShadow: '0 2px 8px #22c55e55', border: 'none', display: 'inline-block', cursor:'pointer'}}
                  >&#10003; Завершён</button>
                  <button onClick={()=>setShowDeleteModal(true)} style={{background:'#ef4444',color:'#fff',fontWeight:700,borderRadius:12,padding:'10px 22px',fontSize:18,border:'none',boxShadow:'0 2px 8px #ef444488',cursor:'pointer'}}>Удалить</button>
                </div>;
              }
              return null;
            })()}
          </div>
          {/* Переписка */}
          <div className="flex-1 flex flex-col gap-1 px-8 py-6 overflow-y-auto" style={{background:'#1a1a1a', position:'relative'}} id="chat-messages-container" onScroll={handleScroll}>
            <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',minHeight:'100%',height:'100%',flex:1,filter: selectedStatus === 'done' ? 'blur(4px)' : 'none', pointerEvents: selectedStatus === 'done' ? 'none' : 'auto'}}>
              {chats[selected]?.messages?.length ? (
                chats[selected].messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.author === "admin" ? "items-end" : "items-start"}`} style={{position:'relative'}}>
                    {m.author === 'user' && (
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                        <img src="/trader.png" alt="avatar" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',boxShadow:'0 2px 8px #a259ff55',border:'2px solid #a259ff'}} onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/trader.gif'}} />
                        <span style={{fontWeight:600,color:'#fff',fontSize:15}}>Аноним</span>
                      </div>
                    )}
                    <div className={`msg-bubble ${m.author === "admin" ? "msg-admin" : "msg-user"}`}>{m.message}</div>
                    <div className="msg-time" style={{textAlign: m.author === "admin" ? "right" : "left"}}>
                      {new Date(m.createdAt).toLocaleTimeString().slice(0,5)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center mt-10">Нет сообщений</div>
              )}
              <div ref={msgEndRef}></div>
            </div>
            {selectedStatus === 'done' && (
              <div style={{position:'absolute',left:0,top:0,width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10}}>
                <div style={{background:'rgba(30,30,30,0.55)',borderRadius:24,padding:32,display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="8" rx="4"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>
                  <div style={{color:'#bbb',fontWeight:600,fontSize:18,marginTop:12}}>Чат завершён</div>
                </div>
              </div>
            )}
          </div>
          {/* Поле ввода и быстрые ответы (закреплено снизу) */}
          <div className="px-8 py-5 bg-[#232323] border-t border-[#232323] flex flex-col gap-2 sticky bottom-0 z-10">
            <div className="flex gap-2 mb-2 flex-wrap">
              {quickReplies.map((txt, i) => (
                <button key={i} type="button" style={{background:'#181818',color:'#ff8800',border:'1.5px solid #ff8800',borderRadius:8,padding:'6px 16px',fontWeight:600,fontSize:15,cursor:'pointer'}} onClick={() => setMsg(txt)} disabled={selectedStatus === 'done'}>{txt}</button>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 rounded-xl px-4 py-3 bg-[#181818] text-white border border-[#333] focus:outline-none focus:border-orange-400"
                placeholder="Введите сообщение..."
                value={msg}
                onChange={e => setMsg(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                disabled={sending || !chats[selected] || selectedStatus === 'done'}
              />
              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold px-7 py-3 rounded-xl shadow hover:scale-105 transition-transform"
                disabled={sending || !chats[selected] || !msg.trim() || selectedStatus === 'done'}
              >
                {sending ? "Отправка..." : "Отправить"}
              </button>
            </div>
          </div>
        </section>
      </main>
      {/* Модалка подтверждения разблокировки */}
      {showUnlockModal && (
        <div style={{position:'fixed',left:0,top:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#232323',borderRadius:20,padding:'36px 32px',boxShadow:'0 8px 32px #0008',minWidth:320,display:'flex',flexDirection:'column',alignItems:'center',gap:24}}>
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#ff8800" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="8" rx="4"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>
            <div style={{fontWeight:700,fontSize:20,marginBottom:8}}>Подтвердите разблокировку чата</div>
            <div style={{color:'#bbb',fontSize:15,marginBottom:8}}>Чат снова станет активным, пользователь сможет продолжить диалог.</div>
            <div style={{display:'flex',gap:16,marginTop:8}}>
              <button onClick={async()=>{
                setShowUnlockModal(false);
                await setChatStatus(chats[selected].chatId, 'progress');
              }} style={{background:'linear-gradient(90deg,#ff8800,#a259ff)',color:'#fff',fontWeight:700,border:'none',borderRadius:10,padding:'10px 28px',fontSize:17,cursor:'pointer',boxShadow:'0 2px 8px #a259ff55'}}>Разблокировать</button>
              <button onClick={()=>setShowUnlockModal(false)} style={{background:'#181818',color:'#ff8800',fontWeight:700,border:'1.5px solid #ff8800',borderRadius:10,padding:'10px 22px',fontSize:17,cursor:'pointer'}}>Отмена</button>
            </div>
          </div>
        </div>
      )}
      {/* Модалка подтверждения удаления */}
      {showDeleteModal && (
        <div style={{position:'fixed',left:0,top:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#232323',borderRadius:20,padding:'36px 32px',boxShadow:'0 8px 32px #0008',minWidth:320,display:'flex',flexDirection:'column',alignItems:'center',gap:24}}>
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="7" width="14" height="12" rx="2"/><path d="M10 11v4M14 11v4"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
            <div style={{fontWeight:700,fontSize:20,marginBottom:8}}>Подтвердите удаление чата</div>
            <div style={{color:'#bbb',fontSize:15,marginBottom:8}}>Чат и вся переписка будут удалены безвозвратно.</div>
            <div style={{display:'flex',gap:16,marginTop:8}}>
              <button onClick={async()=>{
                setShowDeleteModal(false);
                await deleteChat(chats[selected].chatId);
              }} style={{background:'#ef4444',color:'#fff',fontWeight:700,border:'none',borderRadius:10,padding:'10px 28px',fontSize:17,cursor:'pointer',boxShadow:'0 2px 8px #ef444488'}}>Удалить</button>
              <button onClick={()=>setShowDeleteModal(false)} style={{background:'#181818',color:'#ff8800',fontWeight:700,border:'1.5px solid #ff8800',borderRadius:10,padding:'10px 22px',fontSize:17,cursor:'pointer'}}>Отмена</button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`        .chat-card {
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
        ::-webkit-scrollbar-thumb { background: #232323; border-radius: 8px; }
      `}</style>
    </div>
  );
} 
