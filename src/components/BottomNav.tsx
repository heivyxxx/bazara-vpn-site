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
  { to: '/support', label: 'Поддержка', iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
];

const BottomNav = () => {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] pt-6 px-4 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent pointer-events-none">
      <div className="glass-card flex justify-around items-center h-[72px] w-full max-w-md px-2 pointer-events-auto border-t border-white/10 shadow-[0_10px_40px_rgba(254,97,37,0.1)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none"></div>
        {navs.map((nav) => {
          const isActive = pathname === nav.to;
          return (
            <Link
              key={nav.to}
              href={nav.to}
              className={clsx(
                'flex flex-col items-center justify-center relative flex-1 h-full select-none transition-all duration-300 z-10',
                isActive ? 'text-white' : 'text-[#6A6D82] hover:text-white/80'
              )}
              onClick={hapticSelection}
            >
              {isActive && (
                <div className="absolute inset-x-2 inset-y-2.5 bg-[#fe6125]/10 rounded-2xl -z-10 transition-all duration-300 shadow-[inset_0_0_12px_rgba(254,97,37,0.2)]"></div>
              )}
             <div className="flex items-center justify-center mb-1 relative">
                 <svg 
                   width="22" 
                   height="22" 
                   viewBox="0 0 24 24" 
                   fill="none" 
                   stroke={isActive ? '#fe6125' : 'currentColor'} 
                   strokeWidth={isActive ? '2.5' : '2'}
                   strokeLinecap="round" 
                   strokeLinejoin="round"
                   className={clsx("transition-all duration-300", isActive && "drop-shadow-[0_0_8px_rgba(254,97,37,0.6)]")}
                 >
                   <path d={nav.iconPath} />
                 </svg>
              </div>
              <span className={clsx("text-[10px] font-bold tracking-wide transition-all duration-300 mt-1", isActive ? "opacity-100" : "opacity-0 translate-y-2 absolute")}>
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