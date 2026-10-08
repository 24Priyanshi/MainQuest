'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Input } from '@/components/ui/Input';
import { PixelButton } from '@/components/ui/PixelButton';
import { loadDemoData } from '@/lib/data/seed';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { dispatch } = useAppStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login
    dispatch({ type: 'LOAD_STATE', payload: loadDemoData() });
    
    router.push('/base');
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
          <p className="text-text-secondary text-sm font-body">Stop doing side quests. Finish the main quest.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <Input 
              label="EMAIL" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hero@mainquest.app"
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
              LOGIN
            </PixelButton>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/signup" className="text-text-secondary hover:text-accent-primary font-pixel text-[10px] transition-colors">
            New adventurer? Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
