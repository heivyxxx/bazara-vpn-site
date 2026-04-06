require('dotenv').config({ path: '.env.local' }); // Загружаем переменные из .env.local

const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

// === КОНФИГУРАЦИЯ ===
const BOT_TOKEN = '7507266824:AAE3EoYfje5rBGw1LYmB0evOZXG03RLiCcg'; 
const WEB_APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vpn.bazara.app';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// === КЛАВИАТУРЫ ===
// Главное меню (с кнопками WebApp)
function getAppKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.webApp("👤 Личный кабинет", WEB_APP_URL)],
    [
      Markup.button.webApp("💰 Пополнение", `${WEB_APP_URL}/deposit`),
      Markup.button.url("🛡 Поддержка", "https://t.me/bazaravpn_support") // замени на свой линк
    ],
    [Markup.button.callback("❌ Не работает сайт?", "switch_to_text_mode")]
  ]);
}

// Текстовое меню (резервное)
function getTextKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🚀 Приобрести подписку", "buy_sub")],
    [
      Markup.button.callback("👥 Рефералы", "referrals"),
      Markup.button.callback("📦 Моя подписка", "my_sub")
    ],
    [
      Markup.button.callback("💰 Пополнить", "deposit"),
      Markup.button.url("🛡 Поддержка", "https://t.me/bazaravpn_support")
    ],
    [Markup.button.callback("⏳ Протестировать подписку", "test_sub")],
    [Markup.button.callback("🔄 Вернуться к сайту", "switch_to_app_mode")]
  ]);
}

// === ЛОГИКА ДАННЫХ ===
async function getUserStatsText(ctx) {
  const tgUser = ctx.from;
  const telegramId = String(tgUser.id);

  // Обновляем или добавляем юзера
  await supabase.from('users').upsert({
    telegram_id: telegramId,
    name: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' '),
    username: tgUser.username,
  }, { onConflict: 'telegram_id', ignoreDuplicates: true });

  // Получаем свежие данные
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();

  const balance = user?.balance || 0;
  const spent = user?.spent || 0; // Потребует добавления поля spent в бд, если его нет
  let daysWithUs = 0;
  
  if (user?.created_at) {
    const diffTime = Math.abs(new Date() - new Date(user.created_at));
    daysWithUs = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  // Заглушка: если в БД нет точного поля окончания, пишем "нет"
  let subEndStr = "нет активной подписки";
  if (user?.subscription_end_date) {
    const endDate = new Date(user.subscription_end_date);
    if (endDate > new Date()) {
      subEndStr = `активна до ${endDate.toLocaleDateString('ru-RU')} ${endDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }
  }

  return `⚙️ ID: \`${telegramId}\`
💰 Баланс: ${balance.toFixed(2)}₽
💸 Потрачено: ${spent.toFixed(2)}₽
📅 С нами: ${daysWithUs} дней
〰️ Подписка: ${subEndStr}

[Пользовательское соглашение](https://telegra.ph/Polzovatelskoe-soglashenie-VPN-12-12)

⚠️ *Работает на всех платформах: macOS / iOS, Android, Windows, Linux*`;
}

// === ХЭНДЛЕРЫ ===

// Команда /start
bot.start(async (ctx) => {
  try {
    const text = await getUserStatsText(ctx);
    await ctx.replyWithMarkdown(text, getAppKeyboard());
  } catch (e) {
    ctx.reply("Произошла ошибка загрузки профиля.");
  }
});

// Нажатие "Не работает сайт?"
bot.action("switch_to_text_mode", async (ctx) => {
  try {
    const text = await getUserStatsText(ctx);
    await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...getTextKeyboard()
    });
  } catch (e) {
    await ctx.answerCbQuery("Ошибка переключения");
  }
});

// Нажатие "Вернуться к сайту"
bot.action("switch_to_app_mode", async (ctx) => {
  try {
    const text = await getUserStatsText(ctx);
    await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...getAppKeyboard()
    });
  } catch (e) {
    await ctx.answerCbQuery("Ошибка переключения");
  }
});

// Заглушки для кнопок текстового меню
const handleStub = async (ctx) => {
  await ctx.answerCbQuery("Этот функционал пока в разработке! Пожалуйста, используйте WebApp.");
};
bot.action("buy_sub", handleStub);
bot.action("referrals", handleStub);
bot.action("my_sub", handleStub);
bot.action("deposit", handleStub);
bot.action("test_sub", handleStub);


// ЗАПУСК БОТА
bot.launch().then(() => {
});

// Плавная остановка
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
