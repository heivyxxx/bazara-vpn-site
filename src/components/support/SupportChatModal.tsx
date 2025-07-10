"use client";
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLang } from '@/lib/LanguageContext';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

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
  const [closing, setClosing] = React.useState(false);
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  };
  if (!isOpen && !closing) return null;

  useEffect(() => {
    let sub: any = null;
    let mounted = true;
    async function initChat() {
      setLoading(true);
      // Проверяем, есть ли чат
      let { data: chat } = await supabase.from('chats').select('*').eq('chat_id', chatId).single();
      if (!chat) {
        // Создаём чат
        await supabase.from('chats').insert({ chat_id: chatId, status: 'new', last_message_at: new Date().toISOString() });
      }
      // Загружаем сообщения
      const { data: msgs } = await supabase.from('chat_messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
      if (mounted) setMessages(msgs || []);
      setLoading(false);
      // Подписка на новые сообщения
      sub = supabase.channel('chat_'+chatId)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${chatId}` }, payload => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();
    }
    if (chatId) initChat();
    return () => { mounted = false; if (sub) supabase.removeChannel(sub); };
  }, [chatId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      await supabase.from('chat_messages').insert({
        chat_id: chatId,
        author: 'user',
        message: input
      });
      await supabase.from('chats').update({ last_message_at: new Date().toISOString() }).eq('chat_id', chatId);
      setInput('');
    } catch {}
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] w-full h-full bg-black/80 flex items-end justify-center">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className={`relative w-full bg-[#18181b] rounded-t-3xl flex flex-col animate-fadeInUp ${closing ? 'animate-slideOutDown' : 'animate-slideInUp'}`}
        style={{ minHeight: '30vh', maxHeight: '65vh', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
      >
        <div className="flex flex-row items-center justify-between px-6 pt-6 pb-2 sticky top-0 z-10 bg-[#18181b] rounded-t-3xl">
          <span className="text-white font-bold text-lg w-full text-center">{t.title}</span>
          <button
            onClick={handleClose}
            className="text-zinc-400 text-2xl p-1 rounded-full ml-2 absolute right-6 top-6"
            aria-label="Закрыть"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="flex flex-col flex-1 px-6 pb-6 pt-2 gap-4 overflow-y-auto">
          <div className="flex items-center gap-3 pb-2">
            <Image src="/assets/trader.gif" alt="Support" width={48} height={48} className="w-12 h-12 rounded-full" />
            <span className="text-xl md:text-2xl font-extrabold text-[#FE6125]">{t.title}</span>
            <span className="ml-auto text-base text-gray-400 font-semibold">{t.online}</span>
          </div>
          <div className="flex-1 overflow-y-auto py-2 space-y-4 bg-[#18181b] flex flex-col" style={{minHeight:0}}>
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-[#FE6125] to-purple-700 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg">S</div>
              <div className="bg-[#18181b] rounded-2xl px-5 py-3 text-white max-w-[70%] shadow border border-[#FE6125] text-base">{t.greeting}</div>
            </div>
            {loading ? <div className="text-gray-400 text-center py-8">{t.init}</div> : null}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}>
                {msg.author === 'user' ? null : <div className="bg-gradient-to-br from-[#FE6125] to-purple-700 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-lg shadow-lg">S</div>}
                <div className={`rounded-2xl px-5 py-3 text-base shadow border ${msg.author === 'user' ? 'bg-[#18181b] text-white border-orange-700' : 'bg-[#18181b] text-white border-[#FE6125]'}`}>{msg.message}</div>
                {msg.author === 'user' ? <div className="bg-[#a259ff] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-lg shadow-lg">U</div> : null}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <form onSubmit={sendMessage} className="sticky bottom-0 left-0 w-full flex gap-3 px-6 pt-2 pb-6 bg-[#18181b] rounded-b-3xl z-20 mt-auto">
          <input
            type="text"
            className="flex-1 bg-[#232323] border border-gray-700 rounded-xl p-4 text-white text-lg"
            placeholder={t.placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            autoComplete="off"
            required
            disabled={sending}
          />
          <button
            type="submit"
            className="bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-bold py-3 px-8 rounded-xl text-lg transition-all"
            disabled={sending || !input.trim()}
          >
            {t.send}
          </button>
        </form>
      </div>
    </div>
  );
}; 