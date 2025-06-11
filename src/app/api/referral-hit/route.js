import { db } from '@/firebaseConfig';
import { collection, getDocs, doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { ref, userId } = body;
    if (!ref || !userId) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    const q = collection(db, 'referrals');
    const snap = await getDocs(q);
    const docSnap = snap.docs.find(d => d.data().name === ref);
    if (!docSnap) return NextResponse.json({ error: 'Ref not found' }, { status: 404 });

    const data = docSnap.data();
    if (!data.users) data.users = [];
    if (data.users.includes(userId)) {
      return NextResponse.json({ status: 'already counted' });
    }

    await updateDoc(doc(db, 'referrals', docSnap.id), {
      users: arrayUnion(userId),
      count: increment(1)
    });

    return NextResponse.json({ status: 'ok' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 