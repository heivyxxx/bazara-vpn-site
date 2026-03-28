import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

function hapticSelection() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback?.selectionChanged) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
}

const navs = [
  { to: '/', label: 'Главная', iconPath: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { to: '/tariffs', label: 'Тарифы', iconPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { to: '/reviews', label: 'Рефералы', iconPath: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
  { to: '/deposit', label: 'Пополнить', iconPath: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
  { to: '/support', label: 'Поддержка', iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
];

const BottomNav = () => {
  const pathname = usePathname();
  // Map /reviews to Referrals locally or /profile, adjust if needed
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pt-4 px-4 bg-gradient-to-t from-[#0A0A0F] to-transparent pointer-events-none">
      <div className="glass-card flex justify-around items-center h-[72px] w-full max-w-md px-2 pointer-events-auto shadow-[0_0_30px_rgba(162,89,255,0.05)]">
        {navs.map((nav) => {
          const isActive = pathname === nav.to;
          return (
            <Link
              key={nav.to}
              href={nav.to}
              className={clsx(
                'flex flex-col items-center justify-center relative flex-1 h-full select-none transition-all duration-300',
                isActive ? 'text-white' : 'text-[#6A6D82] hover:text-white/80'
              )}
              onClick={hapticSelection}
            >
              {isActive && (
                <div className="absolute inset-x-2 inset-y-2.5 bg-white/10 rounded-2xl -z-10 transition-all duration-300"></div>
              )}
              <div className="flex items-center justify-center mb-1">
                 <svg 
                   width="22" 
                   height="22" 
                   viewBox="0 0 24 24" 
                   fill="none" 
                   stroke={isActive ? '#A259FF' : 'currentColor'} 
                   strokeWidth={isActive ? '2.5' : '2'}
                   strokeLinecap="round" 
                   strokeLinejoin="round"
                   className="transition-colors duration-300"
                 >
                   <path d={nav.iconPath} />
                 </svg>
              </div>
              <span className={clsx("text-[10px] font-semibold tracking-wide transition-all duration-300", isActive ? "opacity-100" : "opacity-80")}>
                {nav.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav; 