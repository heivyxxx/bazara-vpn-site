import { NextResponse } from 'next/server';
import { Review } from '@/lib/types';
import { db } from '@/firebaseConfig';
import { collection, getDocs, query, where, orderBy, addDoc, Timestamp } from 'firebase/firestore';

// TODO: Добавить интеграцию с Firebase
const reviews: Review[] = [
  {
    id: '1',
    userId: 123456789,
    userName: "Аноним",
    text: "VPN работает отлично, скорость высокая, всё просто и удобно!",
    rating: 5,
    createdAt: "2024-06-12T14:32:00Z"
  },
  {
    id: '2',
    userId: 987654321,
    userName: "Иван",
    text: "Очень доволен сервисом, поддержка отвечает быстро.",
    rating: 5,
    createdAt: "2024-06-10T09:18:00Z"
  },
  {
    id: '3',
    userId: 456789123,
    userName: "Мария",
    text: "Пользуюсь на всех устройствах, всё супер!",
    rating: 5,
    createdAt: "2024-06-08T21:05:00Z"
  }
];

export async function GET() {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('status', 'in', ['approved', 'published']),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    const reviews: Review[] = snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        userId: d.userId,
        userName: d.name || 'Аноним',
        userUsername: d.username || '',
        text: d.text,
        rating: d.rating,
        createdAt: d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toISOString() : '',
      };
    });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, text, rating, userName, userUsername } = data;

    if (!userId || !text || !rating || !userName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    const review = {
      userId,
      name: userName,
      username: userUsername || '',
      text,
      rating,
      createdAt: Timestamp.now(),
      status: 'moderation',
    };
    const docRef = await addDoc(collection(db, 'reviews'), review);
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 