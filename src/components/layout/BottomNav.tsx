'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Swords, Target, Map, BarChart3 } from 'lucide-react';

const navItems = [
  { name: 'BASE', href: '/base', icon: Home, available: true },
  { name: 'QUESTS', href: '/quests', icon: Swords, available: true },
  { name: 'FOCUS', href: '/focus', icon: Target, available: true },
  { name: 'MAP', href: '/map', icon: Map, available: true },
  { name: 'STATS', href: '/stats', icon: BarChart3, available: true },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-panel border-t-2 border-pixel h-16 z-50 flex items-center justify-around px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.available && pathname.startsWith(item.href);
        const itemClassName = `flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
          isActive ? 'text-accent-primary' : item.available ? 'text-text-secondary' : 'text-text-secondary/35'
        }`;
        
        return item.available ? (
          <Link
            key={item.name}
            href={item.href}
            className={itemClassName}
          >
            <Icon className="w-5 h-5" />
            <span className="font-pixel text-[8px]">{item.name}</span>
          </Link>
        ) : (
          <div key={item.name} className={itemClassName} title="Unlocks in Phase 2">
            <Icon className="w-5 h-5" />
            <span className="font-pixel text-[8px]">{item.name}</span>
          </div>
        );
      })}
    </nav>
  );
}
