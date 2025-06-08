import { NextResponse } from 'next/server';
import { TelegramAuthResponse } from '@/lib/types';
import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function checkTelegramAuthorization(data: TelegramAuthResponse) {
  const { hash, ...userData } = data;
  const dataCheckString = Object.keys(userData)
    .sort()
    .map(key => `${key}=${userData[key as keyof typeof userData]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256')
    .update(BOT_TOKEN || '')
    .digest();

  const hmac = crypto.createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return hmac === hash;
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as TelegramAuthResponse;

    if (!BOT_TOKEN) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bot token not configured' 
      }, { status: 500 });
    }

    // Проверяем подпись
    const isValid = checkTelegramAuthorization(data);
    if (!isValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid authorization' 
      }, { status: 401 });
    }

    // Проверяем время авторизации (не старше 24 часов)
    const authDate = data.auth_date;
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authorization expired' 
      }, { status: 401 });
    }

    // Возвращаем данные пользователя
    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        name: data.first_name,
        username: data.username,
        photo_url: data.photo_url || null
      }
    });
  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 