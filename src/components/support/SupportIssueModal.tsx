"use client";
import React, { useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import Image from 'next/image';

const issueTexts = {
  ru: {
    title: 'Сообщить о проблеме',
    placeholder: 'Опишите проблему или ошибку...',
    email: 'Ваш email (необязательно)',
    send: 'Отправить',
    success: 'Спасибо! Ваше сообщение отправлено.',
    contact: 'Как с вами связаться?',
    chat: 'В чате',
    emailType: 'По email',
    category: 'Категория',
    categories: ['Ошибка', 'Вопрос', 'Пожелание', 'Другое'],
    name: 'Ваше имя',
    required: 'Пожалуйста, опишите проблему.'
  },
  en: {
    title: 'Report a Problem',
    placeholder: 'Describe the problem or error...',
    email: 'Your email (optional)',
    send: 'Send',
    success: 'Thank you! Your message has been sent.',
    contact: 'How can we contact you?',
    chat: 'In chat',
    emailType: 'By email',
    category: 'Category',
    categories: ['Error', 'Question', 'Suggestion', 'Other'],
    name: 'Your name',
    required: 'Please describe the problem.'
  }
};

export const SupportIssueModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { lang } = useLang();
  const t = issueTexts[lang];
  const [name, setName] = useState('');
  const [replyType, setReplyType] = useState<'chat'|'email'>('chat');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [closing, setClosing] = React.useState(false);
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  };
  if (!isOpen && !closing) return null;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) { setError(t.required); return; }
    setSending(true);
    setError('');
    try {
      // await addDoc(collection(db, 'issues'), {
      //   name,
      //   replyType,
      //   email: replyType === 'email' ? email : '',
      //   category,
      //   text,
      //   createdAt: serverTimestamp(),
      //   status: 'new'
      // });
      setSuccess(true);
      setName(''); setReplyType('chat'); setEmail(''); setCategory(''); setText('');
      setTimeout(() => { setSuccess(false); onClose(); }, 1800);
    } catch (err) {
      setError('Ошибка отправки. Попробуйте позже.');
    }
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
        <div className="flex flex-col items-center px-6 pb-6 pt-2 gap-6 overflow-y-auto">
          <Image src="/assets/bug-3d.png" alt="bug" width={80} height={80} className="w-20 h-20 mb-2" style={{objectFit:'contain'}} />
          {success ? (
            <div className="text-center text-lg text-green-400 py-12">{t.success}</div>
          ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-xl mx-auto">
            <div className="flex flex-col gap-2">
              <label className="font-extrabold text-white text-xl text-center mb-2">{t.name}</label>
              <input type="text" required placeholder={t.name} className="bg-[#232323] border border-gray-700 rounded-xl p-4 text-white text-lg w-full" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 mt-2 mb-6">
              <label className="font-extrabold text-white text-xl text-center mb-2">{t.contact}</label>
              <div className="flex gap-2 justify-center flex-wrap md:flex-nowrap md:gap-2">
                <div className={`reply-block flex flex-col items-center justify-center gap-2 px-8 py-5 rounded-2xl border-2 border-gray-700 cursor-pointer transition-all w-full md:w-[44%] min-w-[140px] md:min-w-[200px] max-w-full ${replyType==='chat'?'selected':''}`} tabIndex={0} onClick={()=>setReplyType('chat')}>
                  <Image src="/assets/chat-3d.png" alt="chat" width={48} height={48} className="w-12 h-12 mb-1 select-none pointer-events-none" draggable={false} />
                  <span className="font-bold text-lg">{t.chat}</span>
                </div>
                <div className={`reply-block flex flex-col items-center justify-center gap-2 px-8 py-5 rounded-2xl border-2 border-gray-700 cursor-pointer transition-all w-full md:w-[44%] min-w-[140px] md:min-w-[200px] max-w-full ${replyType==='email'?'selected':''}`} tabIndex={0} onClick={()=>setReplyType('email')}>
                  <Image src="/assets/mail-3d.png" alt="mail" width={48} height={48} className="w-12 h-12 mb-1 select-none pointer-events-none" draggable={false} />
                  <span className="font-bold text-lg">{t.emailType}</span>
                </div>
              </div>
              {replyType==='email' && (
                <input type="email" className="bg-[#232323] border border-gray-700 rounded-xl p-4 text-white text-lg w-full mt-2" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-extrabold text-white text-xl text-center mb-2">{t.category}</label>
              <div className="relative">
                <select className="custom-select bg-[#232323] border border-white rounded-xl p-4 text-white text-lg cursor-pointer focus:border-white focus:ring-2 focus:ring-[#FE6125] transition-all w-full appearance-none" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">—</option>
                  {t.categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
            <textarea className="bg-[#232323] border border-gray-700 rounded-xl p-4 text-white text-lg resize-none min-h-[100px]" placeholder={t.placeholder} value={text} onChange={e => setText(e.target.value)} required />
            <div className="sticky bottom-0 left-0 w-full flex justify-center gap-4 px-0 pt-2 bg-[#18181b] rounded-b-3xl z-20 mt-auto">
              <button type="submit" className="flex-1 py-3 rounded-xl bg-[#fd6a32] hover:bg-[#e65a1e] text-white font-semibold text-base transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={sending}>{t.send}</button>
            </div>
            {error && <div className="text-red-400 text-center text-sm">{error}</div>}
          </form>
          )}
        </div>
      </div>
    </div>
  );
}; 