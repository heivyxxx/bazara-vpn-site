import { db } from '@/firebaseConfig';
import { collection, getDocs, doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { ref, userId } = req.body;
  if (!ref || !userId) return res.status(400).json({ error: 'Missing params' });

  const q = collection(db, 'referrals');
  const snap = await getDocs(q);
  const docSnap = snap.docs.find(d => d.data().name === ref);
  if (!docSnap) return res.status(404).json({ error: 'Ref not found' });

  const data = docSnap.data();
  if (data.users && data.users.includes(userId)) {
    return res.status(200).json({ status: 'already counted' });
  }

  await updateDoc(doc(db, 'referrals', docSnap.id), {
    users: arrayUnion(userId),
    count: increment(1)
  });

  res.status(200).json({ status: 'ok' });
} 