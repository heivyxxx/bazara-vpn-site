"use client";
import React, { useEffect, useRef, useState } from 'react';
import { db } from '@/firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useLang } from '@/lib/LanguageContext';
import Image from 'next/image';

const chatTexts = {
  ru: {
    title: 'Чат поддержки',
    online: 'Онлайн',
    greeting: 'Здравствуйте! Чем можем помочь?',
    placeholder: 'Введите сообщение...',
    send: 'Отправить',
    init: 'Пожалуйста, подождите, идёт инициализация чата...'
  },
  en: {
    title: 'Support Chat',
    online: 'Online',
    greeting: 'Hello! How can we help you?',
    placeholder: 'Type your message...',
    send: 'Send',
    init: 'Please wait, chat is initializing...'
  }
};

function getOrCreateChatId() {
  if (typeof window === 'undefined') return '';
  let chatId = localStorage.getItem('supportChatId');
  if (!chatId) {
    chatId = uuidv4();
    localStorage.setItem('supportChatId', chatId);
  }
  return chatId;
}

export const SupportChatModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { lang } = useLang();
  const t = chatTexts[lang];
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatId = getOrCreateChatId();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const q = query(collection(db, 'supportChats'), orderBy('createdAt'));
    const unsub = onSnapshot(q, (snap) => {
      const arr: any[] = [];
      snap.forEach(docu => {
        const d = docu.data();
        if (d.chatId === chatId) arr.push(d);
      });
      setMessages(arr);
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsub();
  }, [isOpen, chatId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'supportChats'), {
        chatId,
        author: 'user',
        message: input.trim(),
        createdAt: serverTimestamp(),
        status: 'new'
      });
      await setDoc(doc(db, 'supportChatStatus', chatId), { status: 'new' }, { merge: true });
      setInput('');
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err) {
      alert('Ошибка отправки сообщения. Попробуйте позже.');
    }
    setSending(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center transition-all duration-300">
      <div className="bg-gradient-to-br from-[#232323] via-[#181818] to-[#2d1a00] rounded-3xl shadow-2xl max-w-3xl w-full h-[80vh] relative animate-fade-in flex flex-col border-4 border-orange-500/30" style={{boxShadow:'0 8px 48px 0 #ff880022,0 2px 0 #a259ff'}}>
        <button onClick={onClose} className="absolute top-5 right-7 text-gray-400 hover:text-orange-400 text-4xl font-bold transition-all">&times;</button>
        <div className="flex items-center gap-3 px-10 pt-8 pb-4 border-b border-orange-700">
          <Image src="/assets/trader.gif" alt="Support" width={48} height={48} className="w-12 h-12 rounded-full" />
          <span className="text-3xl font-extrabold text-orange-400">{t.title}</span>
          <span className="ml-auto text-base text-gray-400 font-semibold">{t.online}</span>
        </div>
        <div className="flex-1 overflow-y-auto px-10 py-6 space-y-4 bg-[#181818] rounded-b-3xl flex flex-col" style={{minHeight:0}}>
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-purple-700 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg">S</div>
            <div className="bg-[#232323] rounded-2xl px-5 py-3 text-white max-w-[70%] shadow border border-orange-500 text-base">{t.greeting}</div>
          </div>
          {loading ? <div className="text-gray-400 text-center py-8">{t.init}</div> : null}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}>
              {msg.author === 'user' ? null : <div className="bg-gradient-to-br from-orange-500 to-purple-700 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-lg shadow-lg">S</div>}
              <div className={`rounded-2xl px-5 py-3 text-base shadow border ${msg.author === 'user' ? 'bg-[#232323] text-white border-orange-700' : 'bg-[#232323] text-white border-orange-500'}`}>{msg.message}</div>
              {msg.author === 'user' ? <div className="bg-[#a259ff] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-lg shadow-lg">U</div> : null}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={sendMessage} className="flex gap-3 p-8 border-t border-orange-700 bg-[#232323] rounded-b-3xl">
          <input
            type="text"
            className="flex-1 bg-[#181818] border border-gray-700 rounded-xl p-4 text-white text-lg"
            placeholder={t.placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            autoComplete="off"
            required
            disabled={sending}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-purple-700 hover:from-orange-600 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all shadow-lg"
            disabled={sending || !input.trim()}
          >
            {t.send}
          </button>
        </form>
      </div>
    </div>
  );
}; 