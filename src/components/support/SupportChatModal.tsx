"use client";
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLang } from '@/lib/LanguageContext';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { ResponsiveDialog } from '@/components/modal/ResponsiveDialog';

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
    return () => {
      mounted = false;
      if (sub) supabase.removeChannel(sub);
    };
  }, [chatId, isOpen]);

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
    <ResponsiveDialog open={isOpen} onClose={onClose} title={t.title} sheetBg="#18181b" desktopMaxWidthClass="max-w-lg" footer={
      <form onSubmit={sendMessage} className="flex w-full gap-3">
        <input
          type="text"
          className="flex-1 rounded-xl border border-gray-700 bg-[#232323] p-4 text-lg text-white"
          placeholder={t.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          required
          disabled={sending}
        />
        <button
          type="submit"
          className="rounded-xl bg-[#fd6a32] px-8 py-3 text-lg font-bold text-white transition-all hover:bg-[#e65a1e] disabled:opacity-50"
          disabled={sending || !input.trim()}
        >
          {t.send}
        </button>
      </form>
    }>
      <div className="flex flex-col gap-4 pb-2">
        <div className="flex items-center gap-3 pb-2">
          <Image src="/assets/trader.gif" alt="Support" width={48} height={48} className="h-12 w-12 rounded-full" />
          <span className="ml-auto text-base font-semibold text-gray-400">{t.online}</span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto bg-[#18181b] py-2" style={{ minHeight: 0 }}>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FE6125] to-purple-700 text-lg font-bold text-white shadow-lg">
              S
            </div>
            <div className="max-w-[70%] rounded-2xl border border-[#FE6125] bg-[#18181b] px-5 py-3 text-base text-white shadow">
              {t.greeting}
            </div>
          </div>
          {loading ? <div className="py-8 text-center text-gray-400">{t.init}</div> : null}
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-3 ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.author === 'user' ? null : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FE6125] to-purple-700 text-lg font-bold text-white shadow-lg">
                  S
                </div>
              )}
              <div
                className={`rounded-2xl border px-5 py-3 text-base shadow ${msg.author === 'user' ? 'border-orange-700 bg-[#18181b] text-white' : 'border-[#FE6125] bg-[#18181b] text-white'}`}
              >
                {msg.message}
              </div>
              {msg.author === 'user' ? (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#a259ff] text-lg font-bold text-white shadow-lg">
                  U
                </div>
              ) : null}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </ResponsiveDialog>
  );
}; 