'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Input } from '@/components/ui/Input';
import { PixelButton } from '@/components/ui/PixelButton';
import type { UserProfile } from '@/lib/types';

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { dispatch } = useAppStore();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new demo user
    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      displayName,
      avatarUrl: '',
      level: 1,
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      dailyMinimumType: 'minutes',
      dailyMinimumValue: 20,
      onboardingCompleted: false,
      procrastinationReasons: [],
      workCategory: '',
      createdAt: new Date().toISOString()
    };
    
    dispatch({ type: 'SET_USER', payload: newUser });
    dispatch({ type: 'SET_QUESTS', payload: [] });
    
    router.push('/onboarding');
  };

  return (
    <div className="w-full max-w-md">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-panel/95 border-4 border-pixel p-6 sm:p-8 shadow-[8px_8px_0_rgba(0,0,0,0.45),0_0_30px_rgba(57,255,20,0.12)]"
      >
        <div className="text-center mb-8">
          <h1 className="font-pixel text-accent-primary text-2xl mb-4 tracking-widest">MAINQUEST</h1>
          <p className="text-text-secondary text-sm italic font-body">Begin your journey today.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-4">
            <Input 
              label="DISPLAY NAME" 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Hero Name"
              required
            />
            <Input 
              label="EMAIL" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hero@example.com"
              required
            />
            <Input 
              label="PASSWORD" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-4">
            <PixelButton type="submit" variant="primary" fullWidth>
              BEGIN ADVENTURE
            </PixelButton>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-text-secondary hover:text-accent-primary font-pixel text-[10px] transition-colors">
            Already an adventurer? Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
