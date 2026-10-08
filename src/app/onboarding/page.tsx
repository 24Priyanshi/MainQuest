'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { PixelButton } from '@/components/ui/PixelButton';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Book, Code, Briefcase, Sparkles, Microscope } from 'lucide-react';

const WORK_TYPES = [
  { id: 'study', label: 'Study', icon: Book },
  { id: 'research', label: 'Research', icon: Microscope },
  { id: 'coding', label: 'Coding', icon: Code },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'personal', label: 'Personal Projects', icon: Sparkles },
];

const PROCRASTINATION_REASONS = [
  { label: 'Tasks feel too large', value: 'too_large' },
  { label: 'Don\'t know where to start', value: 'no_start' },
  { label: 'Perfectionism', value: 'perfectionism' },
  { label: 'Distractions', value: 'distracted' },
  { label: 'Low energy', value: 'low_energy' },
  { label: 'Boring tasks', value: 'too_boring' }
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [workType, setWorkType] = useState<string>('');
  const [reasons, setReasons] = useState<string[]>([]);
  const [dailyGoal, setDailyGoal] = useState<string>('');
  const [questTitle, setQuestTitle] = useState('');
  const [questDesc, setQuestDesc] = useState('');
  
  const router = useRouter();
  const { state, dispatch } = useAppStore();

  const toggleReason = (reason: string) => {
    if (reasons.includes(reason)) {
      setReasons(reasons.filter(r => r !== reason));
    } else {
      setReasons([...reasons, reason]);
    }
  };

  const handleComplete = () => {
    if (!state.user) return;

    // Create the first quest
    if (questTitle) {
      dispatch({
        type: 'ADD_QUEST',
        payload: {
          id: crypto.randomUUID(),
          userId: state.user.id,
          projectId: null,
          title: questTitle,
          description: questDesc,
          questType: 'main',
          priority: 'high',
          difficulty: 3,
          status: 'active',
          estimatedMinutes: 60,
          deadline: null,
          xpReward: 50,
          progress: 0,
          postponementCount: 0,
          createdAt: new Date().toISOString(),
          completedAt: null,
          aiNextAction: null,
          steps: [],
        }
      });
    }

    // Mark onboarding complete
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        workCategory: workType,
        procrastinationReasons: reasons as typeof state.user.procrastinationReasons,
        dailyMinimumType: dailyGoal === 'task' ? 'quests' : 'minutes',
        dailyMinimumValue: dailyGoal === 'task' ? 1 : 20,
        onboardingCompleted: true,
      }
    });

    router.push('/base');
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Dots */}
        <div className="flex justify-center gap-4 mb-12">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full border-2 border-pixel transition-colors ${
                i === step ? 'bg-accent-primary border-accent-primary shadow-[0_0_8px_rgba(57,255,20,0.5)]' : 
                i < step ? 'bg-accent-primary/50' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="font-pixel text-accent-primary text-xl text-center">What are you working on?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {WORK_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setWorkType(type.id)}
                    className={`p-6 border-2 border-pixel flex flex-col items-center gap-4 transition-all ${
                      workType === type.id 
                        ? 'bg-accent-primary/20 border-accent-primary text-accent-primary' 
                        : 'bg-panel hover:bg-panel/80 text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <type.icon className="w-8 h-8" />
                    <span className="font-pixel text-[10px]">{type.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-8">
                <PixelButton onClick={() => setStep(2)} disabled={!workType}>NEXT</PixelButton>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="font-pixel text-accent-primary text-xl text-center leading-relaxed">What makes you procrastinate?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROCRASTINATION_REASONS.map(reason => (
                  <button
                    key={reason.value}
                    onClick={() => toggleReason(reason.value)}
                    className={`p-4 border-2 border-pixel text-left transition-all ${
                      reasons.includes(reason.value)
                        ? 'bg-accent-secondary/20 border-accent-secondary text-accent-secondary'
                        : 'bg-panel text-text-secondary hover:bg-panel/80 hover:text-text-primary'
                    }`}
                  >
                    <span className="font-body text-sm font-medium">{reason.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-8">
                <PixelButton variant="secondary" onClick={() => setStep(1)}>BACK</PixelButton>
                <PixelButton onClick={() => setStep(3)} disabled={reasons.length === 0}>NEXT</PixelButton>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="font-pixel text-accent-primary text-xl text-center">Set your daily minimum</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setDailyGoal('time')}
                  className={`p-8 border-2 border-pixel flex flex-col items-center text-center gap-4 transition-all ${
                    dailyGoal === 'time'
                      ? 'bg-accent-primary/20 border-accent-primary text-accent-primary'
                      : 'bg-panel text-text-secondary hover:bg-panel/80'
                  }`}
                >
                  <div className="text-4xl font-pixel mb-2">20m</div>
                  <div className="font-body text-sm">20 focused minutes</div>
                </button>
                <button
                  onClick={() => setDailyGoal('task')}
                  className={`p-8 border-2 border-pixel flex flex-col items-center text-center gap-4 transition-all ${
                    dailyGoal === 'task'
                      ? 'bg-accent-secondary/20 border-accent-secondary text-accent-secondary'
                      : 'bg-panel text-text-secondary hover:bg-panel/80'
                  }`}
                >
                  <div className="text-4xl font-pixel mb-2">1</div>
                  <div className="font-body text-sm">meaningful quest</div>
                </button>
              </div>
              <div className="flex justify-between pt-8">
                <PixelButton variant="secondary" onClick={() => setStep(2)}>BACK</PixelButton>
                <PixelButton onClick={() => setStep(4)} disabled={!dailyGoal}>NEXT</PixelButton>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="font-pixel text-accent-primary text-xl text-center">Create your first Main Quest</h2>
              <Card className="p-6">
                <div className="space-y-6">
                  <Input
                    label="QUEST TITLE"
                    placeholder="e.g. Write Introduction Section"
                    value={questTitle}
                    onChange={(e) => setQuestTitle(e.target.value)}
                  />
                  <div className="space-y-2">
                    <label className="font-pixel text-[10px] text-text-secondary block">DESCRIPTION (OPTIONAL)</label>
                    <textarea
                      value={questDesc}
                      onChange={(e) => setQuestDesc(e.target.value)}
                      className="w-full bg-base border-2 border-pixel p-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:shadow-[0_0_10px_rgba(57,255,20,0.2)] transition-all min-h-[100px] resize-none"
                      placeholder="What needs to be done?"
                    />
                  </div>
                </div>
              </Card>
              <div className="flex justify-between pt-8">
                <PixelButton variant="secondary" onClick={() => setStep(3)}>BACK</PixelButton>
                <PixelButton variant="primary" onClick={handleComplete} disabled={!questTitle}>
                  CREATE QUEST
                </PixelButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
