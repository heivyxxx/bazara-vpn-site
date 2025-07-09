import Script from 'next/script';

export default function Head() {
  return (
    <>
      <title>BazaraVPN — Быстро. Безопасно. Анонимно.</title>
      <meta name="description" content="BazaraVPN — обход блокировок, защита данных и высокая скорость. VPN для Windows, macOS, Android, iOS." />
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
    </>
  );
} 