'use client';

import { motion } from 'framer-motion';
import {
  AlarmClock, ArrowRight, CalendarDays, CheckCircle2, Flame,
  Shield, Sparkles, Swords, Target, Timer,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getLevelFromTotalXP, getTitle } from '@/lib/gamification/levels';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { DifficultyStars } from '@/components/ui/DifficultyStars';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { XPBar } from '@/components/ui/XPBar';

function formatDeadline(deadline: string | null) {
  if (!deadline) return 'No deadline';
  const hours = Math.max(0, Math.round((new Date(deadline).getTime() - Date.now()) / 3_600_000));
  return hours < 24 ? `${hours}h remaining` : `${Math.ceil(hours / 24)}d remaining`;
}

export default function BasePage() {
  const { state } = useAppStore();
  const user = state.user!;
  const activeQuests = state.quests.filter((quest) => quest.status !== 'completed' && quest.status !== 'abandoned');
  const mainQuest = activeQuests.find((quest) => quest.questType === 'main') ?? activeQuests[0];
  const sideQuests = activeQuests.filter((quest) => quest.id !== mainQuest?.id).slice(0, 3);
  const completedSteps = mainQuest?.steps.filter((step) => step.isCompleted).length ?? 0;
  const level = getLevelFromTotalXP(user.totalXp);
  const today = new Date().toISOString().split('T')[0];
  const todayActivity = state.dailyActivity.find((activity) => activity.date === today);
  const focusMinutes = todayActivity?.focusMinutes ?? 0;
  const dailyGoal = user.dailyMinimumValue;
  const dailyProgress = user.dailyMinimumType === 'minutes'
    ? Math.min((focusMinutes / dailyGoal) * 100, 100)
    : Math.min(((todayActivity?.questsCompleted ?? 0) / dailyGoal) * 100, 100);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 pixel-grid opacity-25" />
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
        <header className="mb-8 flex flex-col gap-5 border-b-2 border-base-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-accent-primary">
              <Sparkles className="h-4 w-4" />
              <span className="font-pixel text-[9px] tracking-[0.24em]">PLAYER BASE</span>
            </div>
            <h2 className="font-pixel text-xl leading-relaxed text-text-primary sm:text-2xl">
              Welcome back, <span className="text-accent-primary">{user.displayName}</span>
            </h2>
            <p className="mt-2 text-sm text-text-secondary">Your next meaningful move is already waiting.</p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Badge variant="streak"><Flame className="h-3 w-3" /> {user.currentStreak} day streak</Badge>
            <Badge variant="level">LVL {user.level}</Badge>
          </div>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<Flame />} label="CURRENT STREAK" value={`${user.currentStreak} days`} detail={`Best: ${user.longestStreak} days`} color="orange" />
          <StatCard icon={<Target />} label="TODAY'S FOCUS" value={`${focusMinutes} min`} detail={`Goal: ${dailyGoal} ${user.dailyMinimumType}`} color="green" />
          <StatCard icon={<Swords />} label="ACTIVE QUESTS" value={String(activeQuests.length)} detail={`${state.projects.length} campaigns`} color="purple" />
          <StatCard icon={<Shield />} label="DAILY SCORE" value={`${todayActivity?.dailyScore ?? 0}%`} detail="Keep the chain alive" color="blue" />
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
          <div className="space-y-6">
            {mainQuest ? (
              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card variant="main" className="relative overflow-hidden p-0">
                  <div className="absolute right-0 top-0 h-36 w-36 bg-accent-primary/5 blur-3xl" />
                  <div className="border-b-2 border-base-border bg-base/40 px-5 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-pixel text-xs text-accent-primary">MAIN QUEST</span>
                        <Badge variant="main">+{mainQuest.xpReward} XP</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <AlarmClock className="h-4 w-4 text-accent-warning" />
                        {formatDeadline(mainQuest.deadline)}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-2xl">
                        <h3 className="text-xl font-bold text-text-primary sm:text-2xl">{mainQuest.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-text-secondary">{mainQuest.description}</p>
                      </div>
                      <DifficultyStars difficulty={mainQuest.difficulty} />
                    </div>

                    <div className="mb-6">
                      <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
                        <span>{completedSteps} of {mainQuest.steps.length} steps cleared</span>
                        <span className="font-pixel text-[9px] text-accent-primary">{mainQuest.progress}%</span>
                      </div>
                      <ProgressBar progress={mainQuest.progress} variant="green" />
                    </div>

                    <div className="pixel-corners border-2 border-accent-secondary/40 bg-accent-secondary/10 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
                      <div>
                        <p className="mb-1 font-pixel text-[9px] tracking-wider text-accent-secondary">NEXT MOVE</p>
                        <p className="text-sm font-semibold text-text-primary">{mainQuest.aiNextAction ?? mainQuest.steps.find((step) => !step.isCompleted)?.title ?? 'Choose the smallest useful action.'}</p>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-2 whitespace-nowrap border-2 border-base-border bg-base px-4 py-2 font-pixel text-[9px] text-text-secondary sm:mt-0">
                        <Timer className="h-4 w-4" /> FOCUS MODE · PHASE 2
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.section>
            ) : (
              <Card variant="main" className="py-12 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-9 w-9 text-accent-primary" />
                <h3 className="font-pixel text-sm text-text-primary">ALL QUESTS CLEARED</h3>
                <p className="mt-3 text-sm text-text-secondary">Rest, recover, then choose tomorrow's main quest.</p>
              </Card>
            )}

            <section>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-pixel text-xs text-text-primary">QUEST LOG</p>
                  <p className="mt-1 text-xs text-text-secondary">The rest of your active campaign</p>
                </div>
                <span className="text-right font-pixel text-[8px] text-text-secondary">FULL LOG IN PHASE 2</span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {sideQuests.map((quest, index) => (
                  <motion.div key={quest.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index }}>
                    <Card className="h-full p-4">
                      <div className="mb-4 flex items-center justify-between gap-2">
                        <Badge variant={quest.questType}>{quest.questType}</Badge>
                        <span className="font-pixel text-[8px] text-accent-primary">+{quest.xpReward} XP</span>
                      </div>
                      <h4 className="min-h-10 text-sm font-semibold leading-5 text-text-primary">{quest.title}</h4>
                      <div className="mt-4 flex items-center justify-between text-[11px] text-text-secondary">
                        <span>{quest.estimatedMinutes} min</span>
                        <span>{quest.progress}%</span>
                      </div>
                      <ProgressBar className="mt-2" progress={quest.progress} size="sm" />
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <Card variant="highlight" className="p-5">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="font-pixel text-[9px] tracking-wider text-accent-secondary">HERO STATUS</p>
                  <h3 className="mt-2 text-lg font-bold text-text-primary">{getTitle(user.level)}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center border-2 border-accent-secondary bg-accent-secondary/10 font-pixel text-sm text-accent-secondary shadow-neon-purple">{user.level}</div>
              </div>
              <XPBar current={level.currentLevelXP} max={level.xpForNextLevel} size="lg" />
              <p className="mt-3 text-xs text-text-secondary">{user.totalXp.toLocaleString()} total XP earned</p>
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-pixel text-[9px] text-text-primary">DAILY MINIMUM</p>
                <span className="font-pixel text-[9px] text-accent-primary">{Math.round(dailyProgress)}%</span>
              </div>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center border-2 border-base-border bg-base text-accent-primary"><Timer className="h-5 w-5" /></div>
                <div>
                  <p className="font-semibold text-text-primary">
                    {user.dailyMinimumType === 'minutes' ? `${focusMinutes} / ${dailyGoal} focused minutes` : `${todayActivity?.questsCompleted ?? 0} / ${dailyGoal} quests`}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">Small wins protect your streak.</p>
                </div>
              </div>
              <ProgressBar progress={dailyProgress} variant="green" />
            </Card>

            <Card className="overflow-hidden p-0">
              <div className="border-b-2 border-base-border px-5 py-4"><p className="font-pixel text-[9px] text-text-primary">MISSION CONTROL</p></div>
              <div className="divide-y divide-base-border">
                <StatusRow icon={<CalendarDays />} label="Campaign" value={state.projects[0]?.title ?? 'Independent'} />
                <StatusRow icon={<Timer />} label="Last focus" value={`${state.focusSessions.find((session) => session.status === 'completed')?.actualMinutes ?? 0} min`} />
                <StatusRow icon={<ArrowRight />} label="System" value="Phase 1 online" accent />
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, detail, color }: { icon: React.ReactNode; label: string; value: string; detail: string; color: 'orange' | 'green' | 'purple' | 'blue' }) {
  const colors = {
    orange: 'text-accent-warning bg-accent-warning/10 border-accent-warning/30',
    green: 'text-accent-primary bg-accent-primary/10 border-accent-primary/30',
    purple: 'text-accent-secondary bg-accent-secondary/10 border-accent-secondary/30',
    blue: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
  };
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center border-2 [&>svg]:h-5 [&>svg]:w-5 ${colors[color]}`}>{icon}</div>
      <div>
        <p className="font-pixel text-[8px] tracking-wider text-text-secondary">{label}</p>
        <p className="mt-1 text-lg font-bold text-text-primary">{value}</p>
        <p className="text-[11px] text-text-secondary">{detail}</p>
      </div>
    </Card>
  );
}

function StatusRow({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <span className={accent ? 'text-accent-primary' : 'text-text-secondary'}>{icon}</span>
      <span className="text-xs text-text-secondary">{label}</span>
      <span className={`ml-auto max-w-[150px] truncate text-right text-xs font-semibold ${accent ? 'text-accent-primary' : 'text-text-primary'}`}>{value}</span>
    </div>
  );
}
