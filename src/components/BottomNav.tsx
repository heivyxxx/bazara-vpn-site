import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';

function hapticSelection() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback?.selectionChanged) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
}

const navs = [
  { to: '/', label: 'Главная', icon: '/assets/home.png', iconActive: '/assets/homeactive.png' },
  { to: '/tariffs', label: 'Цены', icon: '/assets/market.png', iconActive: '/assets/marketactive.png' },
  { to: '/reviews', label: 'Отзывы', icon: '/assets/stars.png', iconActive: '/assets/starsactive.png' },
  { to: '/support', label: 'Поддержка', icon: '/assets/help.png', iconActive: '/assets/helpactive.png' },
];

const BottomNav = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-lg border-t border-[#333] flex justify-around items-center h-[50px] md:hidden">
      {navs.map((nav) => {
        const isActive = pathname === nav.to;
        return (
          <Link
            key={nav.to}
            href={nav.to}
            className={clsx(
              'flex flex-col items-center justify-center flex-1 h-full py-0 select-none transition-colors',
              isActive ? 'text-white font-bold' : 'text-gray-400'
            )}
            onClick={hapticSelection}
          >
            <span className="mb-0.5" style={{ lineHeight: 0 }}>
              <Image
                src={isActive ? nav.iconActive : nav.icon}
                alt={nav.label}
                width={22}
                height={22}
                style={{ objectFit: 'contain' }}
                draggable={false}
              />
            </span>
            <span className="text-[10px] mt-0.5 font-normal tracking-wide">{nav.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav; 