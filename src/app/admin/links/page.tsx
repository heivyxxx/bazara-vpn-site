"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient';

// --- Укажи здесь адрес своего Python-бэкенда! ---
const API_URL = "https://vpn.bazara.app";
// Например: const API_URL = "https://vpn.bazara.app:5010";

const MONTHS = [
  { label: "1м+", days: 30 },
  { label: "2м+", days: 60 },
  { label: "3м+", days: 90 },
  { label: "4м+", days: 120 },
  { label: "5м+", days: 150 },
  { label: "6м+", days: 180 },
  { label: "7м+", days: 210 },
  { label: "8м+", days: 240 },
  { label: "9м+", days: 270 },
  { label: "10м+", days: 300 },
  { label: "11м+", days: 330 },
  { label: "12м+", days: 360 },
];

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

interface StatusResult {
  text: string;
  color: string;
}

function getStatus(endDate: string | null | undefined): StatusResult {
  if (!endDate) return { text: "Неизвестно", color: "#888888" };
  const now = new Date();
  const end = new Date(endDate);
  if (now < end) return { text: "Активна", color: "#22d37b" };
  return { text: "Истекла", color: "#ff4444" };
}

function getDaysLeft(endDate: string | null | undefined): string {
  if (!endDate) return "-";
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Истекла";
  return `${diff} дн.`;
}

interface Link {
  key?: string;
  creator?: string;
  days?: number;
  createdAt?: string;
  endDate?: string;
}

interface DeleteAllProgress {
  step: string;
  details: string | null;
}

export default function AdminLinks() {
  return <div className="min-h-screen flex items-center justify-center text-3xl text-white bg-black">Ссылки</div>;
} 