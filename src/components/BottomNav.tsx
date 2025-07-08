import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

function hapticSelection() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback?.selectionChanged) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
}

const navs = [
  { to: '/', label: 'Главная', icon: '🏠' },
  { to: '/tariffs', label: 'Цены', icon: '💸' },
  { to: '/reviews', label: 'Отзывы', icon: '⭐' },
  { to: '/support', label: 'Поддержка', icon: '💬' },
];

const BottomNav = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-lg border-t border-[#333] flex justify-around items-center h-[62px] md:hidden">
      {navs.map((nav) => (
        <Link
          key={nav.to}
          href={nav.to}
          className={clsx(
            'flex flex-col items-center justify-center flex-1 h-full py-1 select-none transition-colors',
            pathname === nav.to ? 'text-white font-bold' : 'text-gray-400'
          )}
          onClick={hapticSelection}
        >
          <span className="text-2xl mb-0.5" style={{ lineHeight: 0 }}>{nav.icon}</span>
          <span className="text-xs mt-0.5 font-medium">{nav.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav; 