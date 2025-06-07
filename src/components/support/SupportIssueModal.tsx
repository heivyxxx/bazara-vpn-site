"use client";
import React, { useState } from 'react';
import { db } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLang } from '@/lib/LanguageContext';

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
      <div className="bg-[#232323] rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in border-4 border-orange-500/30">
        <button onClick={onClose} className="absolute top-5 right-7 text-gray-400 hover:text-orange-400 text-4xl font-bold transition-all">&times;</button>
        <h2 className="text-2xl font-extrabold text-orange-400 mb-6 text-center">{t.title}</h2>
        {success ? (
          <div className="text-center text-lg text-green-400 py-12">{t.success}</div>
        ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            className="bg-[#181818] border border-gray-700 rounded-xl p-4 text-white text-lg"
            placeholder={t.name}
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="off"
          />
          <div>
            <div className="font-bold text-base text-orange-400 mb-2">{t.contact}</div>
            <div className="flex gap-4 mb-2">
              <button type="button" className={`reply-block flex-1 ${replyType==='chat'?'selected':''}`} onClick={()=>setReplyType('chat')} aria-selected={replyType==='chat'}>{t.chat}</button>
              <button type="button" className={`reply-block flex-1 ${replyType==='email'?'selected':''}`} onClick={()=>setReplyType('email')} aria-selected={replyType==='email'}>{t.emailType}</button>
            </div>
            {replyType==='email' && (
              <input
                type="email"
                className="bg-[#181818] border border-gray-700 rounded-xl p-4 text-white text-lg mt-2"
                placeholder={t.email}
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="off"
              />
            )}
          </div>
          <div>
            <div className="font-bold text-base text-orange-400 mb-2">{t.category}</div>
            <select
              className="bg-[#181818] border border-gray-700 rounded-xl p-4 text-white text-lg w-full custom-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">—</option>
              {t.categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea
            className="bg-[#181818] border border-gray-700 rounded-xl p-4 text-white text-lg resize-none min-h-[90px]"
            placeholder={t.placeholder}
            value={text}
            onChange={e => setText(e.target.value)}
            required
          />
          {error && <div className="text-red-400 text-center text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-purple-700 hover:from-orange-600 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all shadow-lg mt-2"
            disabled={sending}
          >
            {t.send}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}; 