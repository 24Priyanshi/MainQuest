'use client';

import { useState } from 'react';
import { BarChart3, Brain, Flame, Swords, Timer } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MockAIProvider } from '@/lib/ai/mock-provider';
import { Card } from '@/components/ui/Card';
import { PixelButton } from '@/components/ui/PixelButton';

const ai = new MockAIProvider();
export default function StatsPage() {
  const { state } = useAppStore();
  const [insight, setInsight] = useState(''); const [thinking, setThinking] = useState(false);
  const completed = state.quests.filter((quest) => quest.status === 'completed').length;
  const focusMinutes = state.focusSessions.filter((session) => session.status === 'completed').reduce((total, session) => total + session.actualMinutes, 0);
  const activity = state.dailyActivity.slice(-7); const max = Math.max(1, ...activity.map((item) => item.focusMinutes));
  const getInsight = async () => { setThinking(true); setInsight(await ai.generateInsight({ totalQuests: state.quests.length, focusMinutes, streak: state.user?.currentStreak ?? 0 })); setThinking(false); };
  return <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8"><header className="mb-7 border-b-2 border-base-border pb-6"><p className="mb-2 font-pixel text-[9px] text-accent-primary">HERO ARCHIVES</p><h1 className="font-pixel text-xl text-text-primary">PROGRESS, NOT PERFECT.</h1><p className="mt-2 text-sm text-text-secondary">Look for patterns that help you return to the work.</p></header><div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={<Swords/>} value={String(completed)} label="quests cleared"/><Stat icon={<Timer/>} value={`${focusMinutes}m`} label="time focused"/><Stat icon={<Flame/>} value={`${state.user?.currentStreak ?? 0}`} label="day streak"/><Stat icon={<BarChart3/>} value={`${state.user?.totalXp ?? 0}`} label="total XP"/></div><div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><Card><p className="font-pixel text-[10px] text-text-primary">LAST 7 DAYS</p><div className="mt-6 flex h-48 items-end gap-2 border-b border-base-border pb-2">{activity.map((item) => <div key={item.date} className="flex flex-1 flex-col items-center justify-end gap-2"><div title={`${item.focusMinutes} minutes`} className="w-full min-h-1 bg-accent-primary shadow-neon-green" style={{ height: `${Math.max(4, (item.focusMinutes / max) * 100)}%` }}/><span className="text-[9px] text-text-secondary">{new Date(item.date).toLocaleDateString(undefined, { weekday: 'narrow' })}</span></div>)}</div><p className="mt-4 text-xs text-text-secondary">Focused minutes per active day. Keep showing up; the curve follows.</p></Card><Card variant="highlight"><div className="flex gap-3"><Brain className="h-5 w-5 text-accent-secondary"/><div><p className="font-pixel text-[10px] text-accent-secondary">QUEST GUIDE INSIGHT</p><p className="mt-2 text-sm text-text-secondary">A local guide reads your activity patterns. No account or external AI key required.</p></div></div><PixelButton className="mt-5" size="sm" disabled={thinking} onClick={getInsight}>{thinking ? 'ANALYZING…' : 'GENERATE INSIGHT'}</PixelButton>{insight && <p className="mt-5 border-l-2 border-accent-secondary bg-base/40 p-4 text-sm leading-6 text-text-primary">{insight}</p>}</Card></div></div>;
}
function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) { return <Card className="flex items-center gap-4"><span className="text-accent-primary">{icon}</span><div><p className="font-pixel text-lg text-text-primary">{value}</p><p className="mt-1 text-xs text-text-secondary">{label}</p></div></Card>; }
