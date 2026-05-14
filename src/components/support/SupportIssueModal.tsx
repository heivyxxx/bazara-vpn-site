"use client";
import React, { useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import Image from 'next/image';
import { ResponsiveDialog } from '@/components/modal/ResponsiveDialog';

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
    <ResponsiveDialog
      open={isOpen}
      onClose={onClose}
      title={t.title}
      sheetBg="#18181b"
      desktopMaxWidthClass="max-w-xl"
      footer={
        success ? undefined : (
          <button
            type="submit"
            form="support-issue-form"
            className="flex-1 rounded-xl bg-[#fd6a32] py-3 text-base font-semibold text-white transition hover:bg-[#e65a1e] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={sending}
          >
            {t.send}
          </button>
        )
      }
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
        <Image src="/assets/bug-3d.png" alt="bug" width={80} height={80} className="mb-2 h-20 w-20" style={{ objectFit: 'contain' }} />
        {success ? (
          <div className="py-12 text-center text-lg text-green-400">{t.success}</div>
        ) : (
          <form id="support-issue-form" onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="mb-2 text-center text-xl font-extrabold text-white">{t.name}</label>
              <input
                type="text"
                required
                placeholder={t.name}
                className="w-full rounded-xl border border-gray-700 bg-[#232323] p-4 text-lg text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-6 mt-2 flex flex-col gap-2">
              <label className="mb-2 text-center text-xl font-extrabold text-white">{t.contact}</label>
              <div className="flex flex-wrap justify-center gap-2 md:flex-nowrap md:gap-2">
                <div
                  className={`reply-block flex max-w-full min-w-[140px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-gray-700 px-8 py-5 transition-all md:min-w-[200px] md:w-[44%] ${replyType === 'chat' ? 'selected' : ''}`}
                  tabIndex={0}
                  onClick={() => setReplyType('chat')}
                >
                  <Image src="/assets/chat-3d.png" alt="chat" width={48} height={48} className="mb-1 h-12 w-12 select-none pointer-events-none" draggable={false} />
                  <span className="text-lg font-bold">{t.chat}</span>
                </div>
                <div
                  className={`reply-block flex max-w-full min-w-[140px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-gray-700 px-8 py-5 transition-all md:min-w-[200px] md:w-[44%] ${replyType === 'email' ? 'selected' : ''}`}
                  tabIndex={0}
                  onClick={() => setReplyType('email')}
                >
                  <Image src="/assets/mail-3d.png" alt="mail" width={48} height={48} className="mb-1 h-12 w-12 select-none pointer-events-none" draggable={false} />
                  <span className="text-lg font-bold">{t.emailType}</span>
                </div>
              </div>
              {replyType === 'email' && (
                <input
                  type="email"
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-[#232323] p-4 text-lg text-white"
                  placeholder={t.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="mb-2 text-center text-xl font-extrabold text-white">{t.category}</label>
              <div className="relative">
                <select
                  className="custom-select w-full cursor-pointer appearance-none rounded-xl border border-white bg-[#232323] p-4 text-lg text-white transition-all focus:border-white focus:ring-2 focus:ring-[#FE6125]"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">—</option>
                  {t.categories.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-white opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
            <textarea
              className="min-h-[100px] resize-none rounded-xl border border-gray-700 bg-[#232323] p-4 text-lg text-white"
              placeholder={t.placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            {error && <div className="text-center text-sm text-red-400">{error}</div>}
          </form>
        )}
      </div>
    </ResponsiveDialog>
  );
}; 