"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';

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

export default function AdminSupport() {
  return <div className="min-h-screen flex items-center justify-center text-3xl text-white bg-black">Поддержка</div>;
} 
