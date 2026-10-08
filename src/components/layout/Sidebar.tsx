'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Swords, Target, Map, BarChart3, LogOut } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'BASE', href: '/base', icon: Home, available: true },
  { name: 'QUESTS', href: '/quests', icon: Swords, available: true },
  { name: 'FOCUS', href: '/focus', icon: Target, available: true },
  { name: 'MAP', href: '/map', icon: Map, available: true },
  { name: 'STATS', href: '/stats', icon: BarChart3, available: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { state, dispatch } = useAppStore();
  const router = useRouter();

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-panel border-r-2 border-pixel flex flex-col hidden lg:flex z-50">
      <div className="p-6 border-b-2 border-pixel">
        <h1 className="font-pixel text-accent-primary text-xl tracking-wider mb-2">MAINQUEST</h1>
        <p className="text-text-secondary text-xs italic">Stop doing side quests.</p>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.available && pathname.startsWith(item.href);
          const itemClassName = `flex items-center gap-4 px-4 py-3 transition-colors ${
            isActive
              ? 'bg-accent-primary/10 text-accent-primary border-l-2 border-accent-primary'
              : item.available
                ? 'text-text-secondary hover:text-text-primary hover:bg-base/50 border-l-2 border-transparent'
                : 'text-text-secondary/40 border-l-2 border-transparent cursor-not-allowed'
          }`;
          
          return item.available ? (
            <Link
              key={item.name}
              href={item.href}
              className={itemClassName}
            >
              <Icon className="w-5 h-5" />
              <span className="font-pixel text-[10px] uppercase tracking-wider">{item.name}</span>
            </Link>
          ) : (
            <div key={item.name} className={itemClassName} title="Unlocks in Phase 2">
              <Icon className="w-5 h-5" />
              <span className="font-pixel text-[10px] uppercase tracking-wider">{item.name}</span>
              <span className="ml-auto font-pixel text-[8px]">SOON</span>
            </div>
          );
        })}
      </nav>

      {state.user && (
        <div className="p-4 border-t-2 border-pixel mt-auto bg-base/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent-secondary/20 flex items-center justify-center border-2 border-pixel">
              <span className="font-pixel text-accent-secondary text-xs">
                {state.user.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-text-primary font-bold text-sm truncate">{state.user.displayName}</p>
              <p className="font-pixel text-accent-primary text-[10px] mt-1">LVL {state.user.level}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-text-secondary hover:text-accent-danger transition-colors w-full px-2 py-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-pixel text-[10px] uppercase">Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}
