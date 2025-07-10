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
  return <div className="min-h-screen flex items-center justify-center text-2xl">Страница проблем отключена</div>;
} 