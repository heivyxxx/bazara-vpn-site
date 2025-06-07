"use client";
import React, { useState } from 'react';
import { db } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) { setError(t.required); return; }
    setSending(true);
    setError('');
    try {
      await addDoc(collection(db, 'issues'), {
        name,
        replyType,
        email: replyType === 'email' ? email : '',
        category,
        text,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setSuccess(true);
      setName(''); setReplyType('chat'); setEmail(''); setCategory(''); setText('');
      setTimeout(() => { setSuccess(false); onClose(); }, 1800);
    } catch (err) {
      setError('Ошибка отправки. Попробуйте позже.');
    }
    setSending(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center transition-all duration-300">
      <div className="bg-gradient-to-br from-[#232323] via-[#181818] to-[#2d1a00] rounded-3xl shadow-2xl max-w-xl w-full p-0 relative animate-fade-in flex flex-col border-4 border-orange-500/30" style={{boxShadow:'0 8px 48px 0 #ff880022,0 2px 0 #a259ff', minWidth: 340, maxWidth: 520}}>
        <button onClick={onClose} className="absolute top-4 right-6 text-3xl text-gray-400 hover:text-orange-400 font-bold transition-all z-20 bg-transparent border-none outline-none cursor-pointer">&times;</button>
        <div className="flex flex-col items-center justify-center pt-8 pb-2">
          <Image src="/assets/bug-3d.png" alt="bug" width={80} height={80} className="w-20 h-20 mb-2" style={{objectFit:'contain'}} />
          <span className="text-3xl font-extrabold text-orange-400 text-center mb-2">{t.title}</span>
        </div>
        {success ? (
          <div className="text-center text-lg text-green-400 py-12">{t.success}</div>
        ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-10 py-4">
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-white text-xl text-center mb-2">{t.name}</label>
            <input type="text" required placeholder={t.name} className="bg-[#181818] border border-gray-700 rounded-xl p-4 text-white text-lg w-full" value={name} onChange={e => setName(e.target.value)} />
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
              <input type="email" className="bg-[#181818] border border-gray-700 rounded-xl p-4 text-white text-lg w-full mt-2" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-white text-xl text-center mb-2">{t.category}</label>
            <div className="relative">
              <select className="custom-select bg-[#181818] border border-white rounded-xl p-4 text-white text-lg cursor-pointer focus:border-white focus:ring-2 focus:ring-orange-400 transition-all w-full appearance-none" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">—</option>
                {t.categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>
          <textarea className="bg-[#181818] border border-gray-700 rounded-xl p-4 text-white text-lg resize-none min-h-[100px]" placeholder={t.placeholder} value={text} onChange={e => setText(e.target.value)} required />
          <button type="submit" className="bg-gradient-to-r from-orange-500 to-purple-700 hover:from-orange-600 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all shadow-lg">{t.send}</button>
          {error && <div className="text-red-400 text-center text-sm">{error}</div>}
        </form>
        )}
      </div>
    </div>
  );
}; 