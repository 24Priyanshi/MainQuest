'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-base">
      <Sidebar />
      
      <main className="lg:pl-64 pb-20 lg:pb-0 min-h-screen">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
