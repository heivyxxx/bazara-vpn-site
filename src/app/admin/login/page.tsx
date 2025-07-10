"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";

// Страница временно отключена, так как firebase удалён
export default function LoginPage() {
  return <div className="min-h-screen flex items-center justify-center text-2xl">Логин отключён</div>;
} 