import { NextResponse } from 'next/server';
import { Review } from '@/lib/types';

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
    // TODO: Получать отзывы из Firebase
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

    // TODO: Сохранять отзыв в Firebase
    const review: Review = {
      id: Math.random().toString(36).substring(7),
      userId,
      userName,
      userUsername,
      text,
      rating,
      createdAt: new Date().toISOString()
    };

    reviews.push(review);

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 