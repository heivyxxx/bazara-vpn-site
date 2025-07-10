"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";

interface Issue {
  id: string;
  name?: string;
  email?: string;
  category?: string;
  text: string;
  replyType?: string;
  createdAt: any;
  status: string;
  attachments?: string[];
}

export default function IssuesPage() {
  return (
    <main className="w-full max-w-3xl mx-auto flex flex-col gap-6 py-12 px-4 min-h-screen">
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:4}}>
        <button
          onClick={() => window.location.href = '/admin'}
          style={{background:'none',border:'none',padding:0,marginBottom:2,cursor:'pointer',outline:'none'}}
          title="Назад"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff8800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transition:'stroke 0.2s'}}><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="flex items-center gap-4 mb-2" style={{paddingTop:0}}>
          <span className="text-2xl font-bold text-orange-400">Проблемы отключены</span>
        </div>
      </div>
      <div className="text-gray-400 text-center mt-10">Блок решения проблем отключён по решению владельца.</div>
    </main>
  );
} 