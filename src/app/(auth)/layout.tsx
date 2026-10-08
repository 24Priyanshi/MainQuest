'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { state } = useAppStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && state.isLoaded && state.user) {
      if (state.user.onboardingCompleted) {
        router.push('/base');
      } else {
        router.push('/onboarding');
      }
    }
  }, [state.user, state.isLoaded, router, isMounted]);

  if (!isMounted || !state.isLoaded) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-base flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,162,97,0.20),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(224,122,95,0.18),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 pixel-grid opacity-35" />
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  );
}
