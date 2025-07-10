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
  { to: '/profile', label: 'Профиль', icon: '/assets/profile.png', iconActive: '/assets/profileactive.png' },
];

const BottomNav = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-t border-[#232323] flex justify-around items-center h-[76px] min-w-full" style={{paddingBottom: '30px'}}>
      {navs.map((nav) => {
        const isActive = pathname === nav.to;
        return (
          <Link
            key={nav.to}
            href={nav.to}
            className={clsx(
              'flex flex-col items-center justify-center flex-1 h-full select-none transition-colors',
              isActive ? 'text-white font-bold' : 'text-gray-400'
            )}
            onClick={hapticSelection}
            style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%'}}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32 }}>
              <Image
                src={isActive ? nav.iconActive : nav.icon}
                alt={nav.label}
                width={26}
                height={26}
                style={{ objectFit: 'contain' }}
                draggable={false}
              />
            </span>
            <span className="text-xs font-medium tracking-wide mt-1" style={{lineHeight:'1.1', textAlign:'center'}}>{nav.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav; 