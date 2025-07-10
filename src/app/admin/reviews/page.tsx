"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';

interface Review {
  id: string;
  userId: string;
  text: string;
  rating: number;
  status: string;
  createdAt: string;
}
interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
}

export default function AdminReviews() {
  return <div className="min-h-screen flex items-center justify-center text-3xl text-white bg-black">Отзывы</div>;
} 