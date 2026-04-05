import asyncio
import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters.command import Command
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from aiogram.client.session.aiohttp import AiohttpSession
import os
from supabase import create_client, Client

from datetime import datetime, timedelta, timezone

# Токен, который выдал BotFather
API_TOKEN = '7507266824:AAE3EoYfje5rBGw1LYmB0evOZXG03RLiCcg'

# Включаем логирование
logging.basicConfig(level=logging.INFO)

# Объект бота
session = AiohttpSession(proxy="http://127.0.0.1:10801")
bot = Bot(token=API_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML), session=session)
# Диспетчер
dp = Dispatcher()

# Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_main_keyboard():
    builder = InlineKeyboardBuilder()
    
    builder.row(types.InlineKeyboardButton(
        text="🟢 Личный кабинет", 
        web_app=types.WebAppInfo(url="https://bazara-vpn-site.vercel.app") 
    ))
    
    builder.row(
        types.InlineKeyboardButton(text="💰 Пополнение", web_app=types.WebAppInfo(url="https://bazara-vpn-site.vercel.app/deposit")),
        types.InlineKeyboardButton(text="🛡 Поддержка", web_app=types.WebAppInfo(url="https://bazara-vpn-site.vercel.app/support"))
    )
    
    builder.row(types.InlineKeyboardButton(
        text="🔴 Не работает сайт?", 
        callback_data="btn_site_down"
    ))
    
    return builder.as_markup()

def get_fallback_keyboard():
    builder = InlineKeyboardBuilder()
    builder.row(types.InlineKeyboardButton(text="🎖 Приобрести подписку", callback_data="buy_sub"))
    builder.row(
        types.InlineKeyboardButton(text="👥 Рефералы", callback_data="referrals"),
        types.InlineKeyboardButton(text="🎯 Моя подписка", callback_data="my_sub")
    )
    builder.row(
        types.InlineKeyboardButton(text="💳 Пополнить", callback_data="deposit"),
        types.InlineKeyboardButton(text="🛡 Поддержка", callback_data="support_fallback")
    )
    builder.row(types.InlineKeyboardButton(text="💡 Протестировать подписку", callback_data="test_sub"))
    builder.row(types.InlineKeyboardButton(text="🔄 Вернуться к сайту", callback_data="btn_go_back"))
    return builder.as_markup()

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    user_id = message.from_user.id
    username = message.from_user.username or message.from_user.first_name
    
    # Сохраняем/обновляем юзера в Supabase
    try:
        data = {
            "id": user_id,
            "telegram_id": user_id,
            "username": username,
        }
        # upsert по id
        supabase.table("users").upsert(data, on_conflict="id").execute()
    except Exception as e:
        logging.error(f"Supabase error: {e}")
        
    # Получаем актуальные данные пользователя
    user_data = {}
    balance = 0
    created_at = None
    try:
        resp = supabase.table("users").select("*").eq("id", user_id).single().execute()
        user_data = resp.data if resp.data else {}
        balance = float(user_data.get("balance") or 0)
        created_at = user_data.get("created_at")
    except Exception as e:
        logging.error(f"Error fetching user: {e}")

    # Считаем дни "Вы с нами"
    days_with_us = 0
    if created_at:
        try:
            created_date = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            days_with_us = (datetime.now(timezone.utc) - created_date).days
        except Exception:
            pass

    # Получаем транзакции для подсчета "Потрачено"
    spent = 0
    try:
        tx_resp = supabase.table("transactions").select("*").eq("user_id", user_id).execute()
        if tx_resp.data:
            for tx in tx_resp.data:
                # Считаем расходы (все, что не deposit)
                if tx.get("type") != "deposit":
                    spent += float(tx.get("amount", 0))
    except Exception as e:
        logging.error(f"Error fetching txs: {e}")

    # Получаем статус подписки (последняя ссылка)
    is_active = False
    sub_end_str = "Нет"
    status_icon = "🔴 Неактивна"
    try:
        links_resp = supabase.table("links").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
        if links_resp.data:
            last_link = links_resp.data[0]
            link_created = last_link.get("created_at")
            package_days = last_link.get("package_days", 0)
            
            if link_created and package_days:
                start_date = datetime.fromisoformat(link_created.replace('Z', '+00:00'))
                end_date = start_date + timedelta(days=package_days)
                if datetime.now(timezone.utc) <= end_date:
                    is_active = True
                    status_icon = "🟢 Активна"
                    sub_end_str = f"Действует до {end_date.strftime('%d.%m.%Y (%H:%M)')}"
                else:
                    sub_end_str = f"Истекла {end_date.strftime('%d.%m.%Y')}"
    except Exception as e:
        logging.error(f"Error fetching links: {e}")

    # Обновленный дизайн текста сообщения
    text = (
        f"👋 <b>Добро пожаловать в BazaraVPN!</b>\n"
        f"🔑 Ваш ID: <code>{user_id}</code>\n\n"
        f"<blockquote>"
        f"<b>📊 Состояние счета</b>\n"
        f"💳 <b>Текущий баланс:</b> <code>{balance:.2f} ₽</code>\n"
        f"💰 <b>Потрачено:</b> <code>{spent:.2f} ₽</code>\n"
        f"⏳ <b>Вы с нами:</b> <code>{days_with_us} дней</code>"
        f"</blockquote>\n"
        f"⚡️ <b>Статус подписки:</b> {status_icon}\n"
        f"<i>└ {sub_end_str}</i>\n\n"
        f"📖 <a href=\"https://telegra.ph/\">Пользовательское соглашение</a>\n\n"
        f"<blockquote>🌐 <i>Единая подписка на все устройства:\n"
        f"iOS • Android • macOS • Windows • Linux</i></blockquote>"
    )

    await message.answer(text, reply_markup=get_main_keyboard(), disable_web_page_preview=True)

@dp.callback_query(F.data == "btn_site_down")
async def site_down_handler(callback: types.CallbackQuery):
    await callback.message.edit_reply_markup(reply_markup=get_fallback_keyboard())
    await callback.answer()

@dp.callback_query(F.data == "btn_go_back")
async def go_back_handler(callback: types.CallbackQuery):
    await callback.message.edit_reply_markup(reply_markup=get_main_keyboard())
    await callback.answer()

async def main():
    # Запуск поллинга
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
