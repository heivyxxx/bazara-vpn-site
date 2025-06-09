// Общие типы
export interface User {
  id: string;
  name: string;
  username?: string;
  photo_url?: string;
}

// Типы для отзывов
export interface Review {
  id: string;
  userId: number;
  userName: string;
  userUsername?: string;
  text: string;
  rating: number;
  createdAt: string;
}

// Типы для тарифов
export interface Tariff {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}

// Типы для Firebase
export interface FirebaseReview {
  userId: number;
  name: string;
  username?: string;
  text: string;
  rating: number;
  createdAt: any; // FirebaseFirestore.Timestamp
  status: 'moderation' | 'approved' | 'published';
}

export interface TelegramAuthResponse {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
} 