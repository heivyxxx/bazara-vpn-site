"use client";

import React, { useEffect, useState } from 'react';
// import luminaImg from '../assets/LUMINA.png';
// import monocoreImg from '../assets/MONOCORE.png';
// import obliviaImg from '../assets/OBLIVIA.png';
// import banner1 from '../assets/banner1.png';
// import banner2 from '../assets/banner2.png';
// import modeIcon from '../assets/mode.png';
// import { useGroupStore } from '@/lib/groupStore';
// import PageContainer from '@/components/PageContainer';
// import Skeleton from '../components/Skeleton.tsx';
// import { useI18n } from '../hooks/useI18n.ts';
import { supabase } from '@/lib/supabaseClient';
// import { useNavigate } from 'react-router-dom';
// import Toast from '../components/Toast.tsx';

const HOW_IT_WORKS_TEXT = `Eclipse — это маркетплейс приватных Telegram-групп с реальными TON-кошельками. Здесь ты можешь:

— Покупать доступ к уникальным приватным сообществам за TON.
— Продавать свои группы другим пользователям.
— Безопасно пополнять и выводить TON прямо внутри приложения.
— Получать мгновенные приглашения в группы после покупки.
— Следить за историей своих покупок, продаж и баланса.

Как это работает?
1. Пополни баланс TON через свой уникальный адрес (он создаётся автоматически).
2. Выбери интересную группу на маркете и купи доступ.
3. Получи мгновенную ссылку-приглашение в Telegram-группу.
4. Если хочешь — выстави свою группу на продажу и зарабатывай TON.
5. В любой момент можешь вывести TON на свой кошелёк.

Всё просто, быстро и безопасно.\nЕсли остались вопросы — пиши в поддержку или смотри FAQ!`;

function getTelegramInitData() {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp.initData || '';
  }
  return '';
}

// Заглушка PageContainer
const PageContainer = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
// Заглушка useGroupStore
function useGroupStore() {
  return {
    groups: [],
    fetchGroups: () => {},
    isLoading: false,
  };
}

const Drops = () => {
  // const { t } = useI18n();
  const [tab, setTab] = useState<'collect' | 'free'>('collect');
  const { groups, fetchGroups, isLoading } = useGroupStore();
  const [modal, setModal] = useState<{ title: string; message: string; action?: () => void; actionText?: string } | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  // const navigate = useNavigate();
  const [toast, setToast] = useState<null | { content: React.ReactNode }>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const tgUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      setLoading(false);
      return;
    }
    fetch('/api/get-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: String(tgUser.id) }),
    })
      .then(res => res.json())
      .then(async data => {
        if (data.user) {
          setUser(data.user);
        } else {
          // Если не найден — регистрация
          const initData = window?.Telegram?.WebApp?.initData || '';
          const regRes = await fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              telegram_id: String(tgUser.id),
              username: tgUser.username,
              first_name: tgUser.first_name,
              last_name: tgUser.last_name,
              photo_url: tgUser.photo_url,
              language_code: tgUser.language_code,
              initData
            }),
          });
          const regData = await regRes.json();
          if (regData.access_token && regData.refresh_token) {
            await supabase.auth.setSession({
              access_token: regData.access_token,
              refresh_token: regData.refresh_token
            });
          }
          if (regData.user) {
            setUser(regData.user);
            window.location.reload();
          }
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.error('get-user error:', e);
      });
  }, []);

  useEffect(() => {
    fetchGroups();
  }, []);

  // Разделение на коллекционные и бесплатные (пример)
  const collectGroups = groups.filter(g => g.price > 0);
  const freeGroups = groups.filter(g => g.price === 0);
  const groupsToShow = tab === 'collect' ? collectGroups : freeGroups;

  return (
    <PageContainer>
      <div style={{color:'#fff',padding:24}}>
        <h1 style={{fontSize:28,marginBottom:16}}>Дропы (Eclipse)</h1>
        <div style={{marginBottom:16}}>
          <button onClick={()=>setTab('collect')} style={{marginRight:8,background:tab==='collect'?'#23232b':'#333',color:'#fff',padding:'8px 16px',borderRadius:8}}>Коллекционные</button>
          <button onClick={()=>setTab('free')} style={{background:tab==='free'?'#23232b':'#333',color:'#fff',padding:'8px 16px',borderRadius:8}}>Бесплатные</button>
        </div>
        <div style={{marginBottom:16}}>
          <button onClick={()=>setShowHowItWorks(true)} style={{background:'#00BFFF',color:'#fff',padding:'8px 16px',borderRadius:8}}>Как это работает?</button>
        </div>
        {showHowItWorks && (
          <div style={{background:'#18181b',padding:16,borderRadius:16,marginBottom:16}}>
            <div style={{marginBottom:8,fontWeight:'bold'}}>Зачем нужен Eclipse и как им пользоваться?</div>
            <div style={{whiteSpace:'pre-line'}}>{HOW_IT_WORKS_TEXT}</div>
            <button onClick={()=>setShowHowItWorks(false)} style={{marginTop:12,background:'#23232b',color:'#fff',padding:'8px 16px',borderRadius:8}}>Понятно</button>
          </div>
        )}
        <div>
          {loading ? (
            <div>Загрузка...</div>
          ) : (
            groupsToShow.map((group:any) => (
              <div key={group.id} style={{background:'#23232b',borderRadius:12,padding:16,marginBottom:12}}>
                <div style={{fontWeight:'bold',fontSize:18}}>{group.name}</div>
                <div>Мест: {group.current_slots} / {group.slots_total}</div>
                <div>Цена: {group.price > 0 ? group.price + ' TON' : 'Бесплатно'}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Drops;