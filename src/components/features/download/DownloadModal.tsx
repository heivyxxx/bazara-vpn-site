import React from "react";
import Image from "next/image";
import { useLang } from '@/lib/LanguageContext';

const texts = {
  windows: {
    ru: {
      img: "/assets/windows.png",
      title1: "Bazara",
      title2: "VPN для Windows",
      subtitle: "Скачай за 2 минуты — и ты уже в безопасности!",
      desc: "VPN, который не грузит мозги. Просто скачай, вставь подписку — и пользуйся!",
      steps: [
        "Жми на кнопку ниже и скачай <b>Hiddify Next</b> для Windows (Portable или Setup — что больше по кайфу).",
        "Запусти <b>Hiddify.exe</b> (лучше с правами администратора, чтобы всё работало по-базарному).",
        "Скопируй свою подписку BazaraVPN и добавь её через «Новый профиль» → «Добавить профиль из буфера обмена».",
        "В настройках выбери режим <b>VPN</b> (для всего трафика) или <b>Системный прокси</b> (только для браузера).",
        "Выбери сервер, подключайся — и всё, ты под защитой!"
      ],
      downloadBtn: "Скачать Hiddify Next для Windows",
      downloadUrl: "https://github.com/hiddify/hiddify-next/releases",
      helpTitle: "Если что-то не работает:",
      help: [
        "Добавь Hiddify в исключения антивируса.",
        "Для Discord выбери регион «Другой».",
        "Если нет интернета — попробуй сменить режим или DNS (например, 9.9.9.9).",
        "Всё равно не работает? <a href='/support' class='text-orange-400 underline'>Напиши в поддержку</a> — поможем!"
      ]
    },
    en: {
      img: "/assets/windows.png",
      title1: "Bazara",
      title2: "VPN for Windows",
      subtitle: "Download in 2 minutes — and you're already protected!",
      desc: "VPN that doesn't overload your brain. Just download, paste your subscription — and enjoy!",
      steps: [
        "Click the button below to download <b>Hiddify Next</b> for Windows (Portable or Setup — whichever you prefer).",
        "Run <b>Hiddify.exe</b> (preferably as administrator for best results).",
        "Copy your BazaraVPN subscription and add it via 'New Profile' → 'Add profile from clipboard'.",
        "In settings, choose <b>VPN</b> mode (for all traffic) or <b>System Proxy</b> (browser only).",
        "Choose a server, connect — and you're protected!"
      ],
      downloadBtn: "Download Hiddify Next for Windows",
      downloadUrl: "https://github.com/hiddify/hiddify-next/releases",
      helpTitle: "If something doesn't work:",
      help: [
        "Add Hiddify to your antivirus exceptions.",
        "For Discord, select the 'Other' region.",
        "No internet? Try changing mode or DNS (e.g., 9.9.9.9).",
        "Still not working? <a href='/support' class='text-orange-400 underline'>Contact support</a> — we'll help!"
      ]
    }
  },
  macos: {
    ru: {
      img: "/assets/apple.png",
      title1: "Bazara",
      title2: "VPN для macOS",
      subtitle: "Установи за 2 минуты — и пользуйся безопасно!",
      desc: "VPN для MacBook и iMac. Просто скачай Hiddify, вставь подписку — и вперёд!",
      steps: [
        "Скачай <b>Hiddify Next</b> для macOS по кнопке ниже.",
        "Открой .dmg-файл и перетащи Hiddify в папку Программы.",
        "Запусти Hiddify, разреши запуск в настройках безопасности, если потребуется.",
        "Скопируй свою подписку BazaraVPN и добавь её через «Новый профиль» → «Добавить профиль из буфера обмена».",
        "Выбери сервер, подключайся — и всё, ты под защитой!"
      ],
      downloadBtn: "Скачать Hiddify Next для macOS",
      downloadUrl: "https://github.com/hiddify/hiddify-next/releases",
      helpTitle: "Если что-то не работает:",
      help: [
        "Разреши запуск Hiddify в Системных настройках → Безопасность.",
        "Добавь Hiddify в исключения антивируса.",
        "Если нет интернета — попробуй сменить режим или DNS (например, 9.9.9.9).",
        "Всё равно не работает? <a href='/support' class='text-orange-400 underline'>Напиши в поддержку</a> — поможем!"
      ]
    },
    en: {
      img: "/assets/apple.png",
      title1: "Bazara",
      title2: "VPN for macOS",
      subtitle: "Install in 2 minutes — and use safely!",
      desc: "VPN for MacBook and iMac. Just download Hiddify, paste your subscription — and go!",
      steps: [
        "Download <b>Hiddify Next</b> for macOS using the button below.",
        "Open the .dmg file and drag Hiddify to the Applications folder.",
        "Launch Hiddify, allow it in Security settings if required.",
        "Copy your BazaraVPN subscription and add it via 'New Profile' → 'Add profile from clipboard'.",
        "Choose a server, connect — and you're protected!"
      ],
      downloadBtn: "Download Hiddify Next for macOS",
      downloadUrl: "https://github.com/hiddify/hiddify-next/releases",
      helpTitle: "If something doesn't work:",
      help: [
        "Allow Hiddify to run in System Settings → Security.",
        "Add Hiddify to your antivirus exceptions.",
        "No internet? Try changing mode or DNS (e.g., 9.9.9.9).",
        "Still not working? <a href='/support' class='text-orange-400 underline'>Contact support</a> — we'll help!"
      ]
    }
  },
  linux: {
    ru: {
      img: "/assets/linux.png",
      title1: "Bazara",
      title2: "VPN для Linux",
      subtitle: "Установи за 2 минуты — и пользуйся безопасно!",
      desc: "VPN для Ubuntu, Debian и других дистрибутивов. Просто скачай Hiddify, вставь подписку — и вперёд!",
      steps: [
        "Скачай <b>Hiddify Next</b> для Linux по кнопке ниже.",
        "Распакуй архив и запусти Hiddify через терминал или двойным кликом.",
        "Скопируй свою подписку BazaraVPN и добавь её через «Новый профиль» → «Добавить профиль из буфера обмена».",
        "В настройках выбери режим <b>VPN</b> или <b>Системный прокси</b>.",
        "Выбери сервер, подключайся — и всё, ты под защитой!"
      ],
      downloadBtn: "Скачать Hiddify Next для Linux",
      downloadUrl: "https://github.com/hiddify/hiddify-next/releases",
      helpTitle: "Если что-то не работает:",
      help: [
        "Проверь разрешения на запуск файла Hiddify.",
        "Добавь Hiddify в исключения брандмауэра/антивируса.",
        "Если нет интернета — попробуй сменить режим или DNS (например, 9.9.9.9).",
        "Всё равно не работает? <a href='/support' class='text-orange-400 underline'>Напиши в поддержку</a> — поможем!"
      ]
    },
    en: {
      img: "/assets/linux.png",
      title1: "Bazara",
      title2: "VPN for Linux",
      subtitle: "Install in 2 minutes — and use safely!",
      desc: "VPN for Ubuntu, Debian and other distros. Just download Hiddify, paste your subscription — and go!",
      steps: [
        "Download <b>Hiddify Next</b> for Linux using the button below.",
        "Unpack the archive and run Hiddify via terminal or double-click.",
        "Copy your BazaraVPN subscription and add it via 'New Profile' → 'Add profile from clipboard'.",
        "In settings, choose <b>VPN</b> or <b>System Proxy</b> mode.",
        "Choose a server, connect — and you're protected!"
      ],
      downloadBtn: "Download Hiddify Next for Linux",
      downloadUrl: "https://github.com/hiddify/hiddify-next/releases",
      helpTitle: "If something doesn't work:",
      help: [
        "Check permissions to run the Hiddify file.",
        "Add Hiddify to your firewall/antivirus exceptions.",
        "No internet? Try changing mode or DNS (e.g., 9.9.9.9).",
        "Still not working? <a href='/support' class='text-orange-400 underline'>Contact support</a> — we'll help!"
      ]
    }
  },
  android: {
    ru: {
      img: "/assets/android.png",
      title1: "Bazara",
      title2: "VPN для Android",
      subtitle: "Установи за 2 минуты — и пользуйся безопасно!",
      desc: "VPN для Android-смартфонов и планшетов. Просто скачай Hiddify, вставь подписку — и вперёд!",
      steps: [
        "Скачай <b>Hiddify Next</b> для Android по кнопке ниже или в Google Play.",
        "Установи приложение и открой его.",
        "Скопируй свою подписку BazaraVPN и добавь её через «Новый профиль» → «Добавить профиль из буфера обмена».",
        "В настройках выбери режим <b>VPN</b> или <b>Системный прокси</b>.",
        "Выбери сервер, подключайся — и всё, ты под защитой!"
      ],
      downloadBtn: "Скачать Hiddify Next для Android",
      downloadUrl: "https://play.google.com/store/apps/details?id=app.hiddify.com",
      helpTitle: "Если что-то не работает:",
      help: [
        "Проверь разрешения на интернет и VPN для Hiddify.",
        "Добавь Hiddify в исключения энергосбережения.",
        "Если нет интернета — попробуй сменить режим или DNS (например, 9.9.9.9).",
        "Всё равно не работает? <a href='/support' class='text-orange-400 underline'>Напиши в поддержку</a> — поможем!"
      ]
    },
    en: {
      img: "/assets/android.png",
      title1: "Bazara",
      title2: "VPN for Android",
      subtitle: "Install in 2 minutes — and use safely!",
      desc: "VPN for Android smartphones and tablets. Just download Hiddify, paste your subscription — and go!",
      steps: [
        "Download <b>Hiddify Next</b> for Android using the button below or from Google Play.",
        "Install the app and open it.",
        "Copy your BazaraVPN subscription and add it via 'New Profile' → 'Add profile from clipboard'.",
        "In settings, choose <b>VPN</b> or <b>System Proxy</b> mode.",
        "Choose a server, connect — and you're protected!"
      ],
      downloadBtn: "Download Hiddify Next for Android",
      downloadUrl: "https://play.google.com/store/apps/details?id=app.hiddify.com",
      helpTitle: "If something doesn't work:",
      help: [
        "Check internet and VPN permissions for Hiddify.",
        "Add Hiddify to battery optimization exceptions.",
        "No internet? Try changing mode or DNS (e.g., 9.9.9.9).",
        "Still not working? <a href='/support' class='text-orange-400 underline'>Contact support</a> — we'll help!"
      ]
    }
  },
  ios: {
    ru: {
      img: "/assets/apple.png",
      title1: "Bazara",
      title2: "VPN для iOS / iPadOS",
      subtitle: "Установи за 2 минуты — и пользуйся безопасно!",
      desc: "VPN для iPhone и iPad. Просто скачай Hiddify, вставь подписку — и вперёд!",
      steps: [
        "Скачай <b>Hiddify Next</b> для iOS по кнопке ниже или в App Store.",
        "Установи приложение и открой его.",
        "Скопируй свою подписку BazaraVPN и добавь её через «Новый профиль» → «Добавить профиль из буфера обмена».",
        "В настройках выбери режим <b>VPN</b> или <b>Системный прокси</b>.",
        "Выбери сервер, подключайся — и всё, ты под защитой!"
      ],
      downloadBtn: "Скачать Hiddify Next для iOS",
      downloadUrl: "https://apps.apple.com/app/hiddify/id1669421461",
      helpTitle: "Если что-то не работает:",
      help: [
        "Проверь разрешения на VPN и интернет для Hiddify.",
        "Добавь Hiddify в исключения энергосбережения.",
        "Если нет интернета — попробуй сменить режим или DNS (например, 9.9.9.9).",
        "Всё равно не работает? <a href='/support' class='text-orange-400 underline'>Напиши в поддержку</a> — поможем!"
      ]
    },
    en: {
      img: "/assets/apple.png",
      title1: "Bazara",
      title2: "VPN for iOS / iPadOS",
      subtitle: "Install in 2 minutes — and use safely!",
      desc: "VPN for iPhone and iPad. Just download Hiddify, paste your subscription — and go!",
      steps: [
        "Download <b>Hiddify Next</b> for iOS using the button below or from the App Store.",
        "Install the app and open it.",
        "Copy your BazaraVPN subscription and add it via 'New Profile' → 'Add profile from clipboard'.",
        "In settings, choose <b>VPN</b> or <b>System Proxy</b> mode.",
        "Choose a server, connect — and you're protected!"
      ],
      downloadBtn: "Download Hiddify Next for iOS",
      downloadUrl: "https://apps.apple.com/app/hiddify/id1669421461",
      helpTitle: "If something doesn't work:",
      help: [
        "Check VPN and internet permissions for Hiddify.",
        "Add Hiddify to battery optimization exceptions.",
        "No internet? Try changing mode or DNS (e.g., 9.9.9.9).",
        "Still not working? <a href='/support' class='text-orange-400 underline'>Contact support</a> — we'll help!"
      ]
    }
  }
};

export type DownloadPlatform = 'windows' | 'macos' | 'linux' | 'android' | 'ios';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: DownloadPlatform;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, platform }) => {
  const { lang } = useLang();
  const t = texts[platform][lang];
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
      <div className="bg-[#18181b] rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 w-full max-w-2xl relative flex flex-col gap-6 sm:gap-8 min-h-[90vh] max-h-[98vh] overflow-y-auto" style={{minWidth:0}}>
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-[#181818] hover:bg-[#2c2c2c] text-2xl text-gray-400">&times;</button>
        <div className="flex flex-col items-center mb-2">
          <Image src={t.img} alt={t.title2} width={120} height={120} className="mb-4 mx-auto" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2">
            <span className="text-[#fd6a32]">{t.title1}</span><span className="text-white">{t.title2}</span>
          </h1>
          <div className="text-lg md:text-2xl text-white text-center font-semibold mb-2">{t.subtitle}</div>
          <div className="text-base text-gray-400 text-center max-w-xl" dangerouslySetInnerHTML={{__html: t.desc}} />
        </div>
        <ol className="w-full flex flex-col gap-6 mt-2 mb-4">
          {t.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#fd6a32] to-purple-500 text-white text-2xl font-bold shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </span>
              <span className="text-lg" dangerouslySetInnerHTML={{__html: step}} />
            </li>
          ))}
        </ol>
        <a href={t.downloadUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gradient-to-r from-[#fd6a32] to-purple-500 hover:from-[#fd6a32] hover:to-purple-600 text-white font-bold py-4 rounded-2xl text-xl shadow-xl transition mb-4">
          <svg className="inline-block w-7 h-7 mr-2 align-middle" fill="#fff" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/></svg>{t.downloadBtn}
        </a>
        <div className="w-full bg-[#232323] rounded-2xl p-5 text-base text-gray-200 flex flex-col gap-2">
          <div className="font-bold text-[#fd6a32] mb-1">{t.helpTitle}</div>
          <ul className="list-disc list-inside space-y-1">
            {t.help.map((h, i) => (
              <li key={i} dangerouslySetInnerHTML={{__html: h}} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 