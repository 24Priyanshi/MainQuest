'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { state } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !state.isLoaded) return;

    if (!state.user) {
      router.push('/login');
    } else if (!state.user.onboardingCompleted && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [state.user, state.isLoaded, router, pathname, isMounted]);

  if (!isMounted || !state.isLoaded || !state.user) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="font-pixel text-accent-primary animate-pulse">LOADING...</p>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
