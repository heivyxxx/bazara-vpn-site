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
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const router = useRouter();

  // Auth protection
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/admin/login");
      else setLoading(false);
    });
    return () => unsub();
  }, [router]);

  // Fetch issues
  const fetchIssues = async () => {
    const q = query(collection(db, "issues"));
    const snap = await getDocs(q);
    const arr: Issue[] = [];
    snap.forEach(docu => {
      const d = docu.data();
      arr.push({
        id: docu.id,
        name: d.name || '',
        email: d.email || '',
        category: d.category || '',
        text: d.text,
        replyType: d.replyType || '',
        createdAt: d.createdAt,
        status: d.status,
        attachments: d.attachments || []
      });
    });
    // Сортировка: pending (по дате, свежие сверху), потом delayed (внизу)
    arr.sort((a, b) => {
      if (a.status === b.status) return b.createdAt - a.createdAt;
      if (a.status === "pending") return -1;
      if (b.status === "pending") return 1;
      if (a.status === "delayed") return 1;
      if (b.status === "delayed") return -1;
      return 0;
    });
    setIssues(arr);
  };

  useEffect(() => {
    if (!loading) fetchIssues();
  }, [loading]);

  // Действия
  const setStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "issues", id), { status });
    await fetchIssues();
  };

  const activeCount = issues.filter(i => i.status === "new" || i.status === "pending").length;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Загрузка...</div>;

  return (
    <main className="w-full max-w-3xl mx-auto flex flex-col gap-6 py-12 px-4 min-h-screen">
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:4}}>
        <button
          onClick={() => router.push('/admin')}
          style={{background:'none',border:'none',padding:0,marginBottom:2,cursor:'pointer',outline:'none'}}
          title="Назад"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff8800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transition:'stroke 0.2s'}}><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="flex items-center gap-4 mb-2" style={{paddingTop:0}}>
          <span className="text-2xl font-bold text-orange-400">Активные проблемы</span>
          <span className="badge">{activeCount}</span>
          <button onClick={fetchIssues} className="ml-2 text-sm text-orange-400 hover:text-orange-300">⟳</button>
        </div>
      </div>
      {issues.length === 0 && (
        <div className="text-gray-400 text-center mt-10">Нет жалоб</div>
      )}
      {issues.filter(issue => issue.status !== 'resolved').map((issue) => (
        <div key={issue.id} className={`issue-card flex flex-col gap-3 ${issue.status === "delayed" ? "opacity-70" : ""}`}>
          <div className="flex items-center gap-4 mb-1">
            <div className={`font-bold text-lg ${issue.status === "delayed" ? "text-purple-400" : "text-orange-400"} flex-1`}>{issue.name ? issue.name : "Аноним"}</div>
            <div className="text-sm text-gray-400">{issue.createdAt && issue.createdAt.toDate ? issue.createdAt.toDate().toLocaleString() : (issue.createdAt ? new Date(issue.createdAt).toLocaleString() : "-")}</div>
          </div>
          <div className="flex items-center gap-3 mb-1">
            {issue.category && <span className="px-3 py-1 bg-orange-900 text-orange-300 rounded-xl text-xs font-semibold">{issue.category}</span>}
            {issue.email && <span className="px-3 py-1 bg-purple-900 text-purple-300 rounded-xl text-xs font-semibold">{issue.email}</span>}
          </div>
          <div className="text-base mb-2">{issue.text}</div>
          {issue.attachments && issue.attachments.length > 0 && (
            <div className="flex gap-2 mb-2">
              {issue.attachments.map((s, i) => (
                <img key={i} src={s} className="screenshot-thumb" onClick={() => window.open(s, '_blank')} alt="скриншот" />
              ))}
            </div>
          )}
          <div className="flex gap-2">
            {(issue.status === "new" || issue.status === "pending" || issue.status === "delayed") && (
              <button className="issue-btn" onClick={() => setStatus(issue.id, "resolved")}>✅ Решено</button>
            )}
            {issue.status === "pending" && (
              <>
                <button className="issue-btn" onClick={() => setStatus(issue.id, "delayed")}>🕒 Отложить</button>
              </>
            )}
            {issue.replyType === "chat" && (
              <button className="issue-btn" onClick={() => router.push(`/admin/support?userId=${issue.id}`)}>✉️ Ответить в чате</button>
            )}
            {issue.replyType === "email" && issue.email && (
              <button 
                className="issue-btn" 
                onClick={() => {
                  if (issue.email) {
                    navigator.clipboard.writeText(issue.email);
                    alert('Email скопирован!');
                  }
                }}
              >
                📧 Ответить по email
              </button>
            )}
          </div>
        </div>
      ))}
      <style jsx global>{`
        .issue-card {
          background: #232323;
          border-radius: 1.2rem;
          box-shadow: 0 2px 16px 0 #ff880044;
          padding: 1.5rem 2rem;
          margin-bottom: 1.5rem;
          transition: box-shadow 0.18s, transform 0.15s;
          border: 2px solid transparent;
        }
        .issue-card:hover {
          box-shadow: 0 8px 32px 0 #ff8800cc, 0 2px 8px 0 #a259ff88;
          border-color: #ff8800;
          transform: translateY(-2px) scale(1.01);
        }
        .issue-btn {
          background: #232323;
          color: #ff8800;
          border: 1.5px solid #ff8800;
          border-radius: 0.7em;
          padding: 0.4em 1.2em;
          margin-right: 0.7em;
          margin-bottom: 0.5em;
          cursor: pointer;
          font-size: 1em;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
        }
        .issue-btn:hover {
          background: #ff8800;
          color: #fff;
        }
        .issue-btn:last-child { margin-right: 0; }
        .badge {
          background: #ff3b3b;
          color: #fff;
          font-weight: bold;
          border-radius: 9999px;
          padding: 0.2em 0.8em;
          font-size: 1.1rem;
          min-width: 2em;
          text-align: center;
          margin-left: 0.7em;
        }
        .screenshot-thumb {
          max-width: 90px;
          max-height: 70px;
          border-radius: 0.7em;
          margin-right: 0.7em;
          border: 1.5px solid #a259ff;
          box-shadow: 0 2px 8px #a259ff33;
          cursor: pointer;
          transition: box-shadow 0.15s;
        }
        .screenshot-thumb:hover {
          box-shadow: 0 4px 16px #ff880088;
        }
      `}</style>
    </main>
  );
} 