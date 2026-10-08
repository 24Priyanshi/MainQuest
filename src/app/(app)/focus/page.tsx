'use client';

import { useEffect, useMemo, useState } from 'react';
import { Brain, Coffee, Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MockAIProvider } from '@/lib/ai/mock-provider';
import type { ProcrastinationReason } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { PixelButton } from '@/components/ui/PixelButton';
import { Select } from '@/components/ui/Input';

const ai = new MockAIProvider();
const reasons: { value: ProcrastinationReason; label: string }[] = [
  { value: 'no_start', label: "I don't know where to start" }, { value: 'too_large', label: 'It feels too large' },
  { value: 'perfectionism', label: 'I need it to be perfect' }, { value: 'distracted', label: 'I keep getting distracted' },
  { value: 'low_energy', label: 'I have low energy' },
];

export default function FocusPage() {
  const { state, dispatch } = useAppStore();
  const quest = state.quests.find((item) => item.status === 'active') ?? state.quests.find((item) => item.status === 'not_started');
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [reason, setReason] = useState<ProcrastinationReason>('no_start');
  const [guide, setGuide] = useState<{ message: string; suggestion: string; actionLabel: string } | null>(null);
  const [thinking, setThinking] = useState(false);
  const formatted = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  useEffect(() => { if (!running || secondsLeft <= 0) return; const timer = window.setInterval(() => setSecondsLeft((value) => value - 1), 1000); return () => window.clearInterval(timer); }, [running, secondsLeft]);
  useEffect(() => { if (secondsLeft === 0 && running) { setRunning(false); finishSession(); } }, [secondsLeft, running]);
  useEffect(() => { if (!running) setSecondsLeft(minutes * 60); }, [minutes]);

  const finishSession = () => {
    if (!state.user || !quest) return;
    const actualMinutes = Math.max(1, minutes - Math.floor(secondsLeft / 60));
    dispatch({ type: 'ADD_FOCUS_SESSION', payload: { id: crypto.randomUUID(), userId: state.user.id, questId: quest.id, startedAt: new Date(Date.now() - actualMinutes * 60_000).toISOString(), endedAt: new Date().toISOString(), plannedMinutes: minutes, actualMinutes, status: 'completed', distractionCount: 0, notes: '' } });
    dispatch({ type: 'UPDATE_USER', payload: { totalXp: state.user.totalXp + Math.round(actualMinutes * 0.5) } });
  };

  const askGuide = async () => { if (!quest) return; setThinking(true); setGuide(await ai.generateIntervention(reason, quest.title)); setThinking(false); };
  const sessionCount = state.focusSessions.filter((session) => session.status === 'completed').length;
  const totalMinutes = useMemo(() => state.focusSessions.filter((session) => session.status === 'completed').reduce((total, session) => total + session.actualMinutes, 0), [state.focusSessions]);

  return <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8"><header className="mb-7 border-b-2 border-base-border pb-6"><p className="mb-2 font-pixel text-[9px] text-accent-secondary">FOCUS FORGE</p><h1 className="font-pixel text-xl text-text-primary">ONE QUEST. ONE TIMER.</h1><p className="mt-2 text-sm text-text-secondary">You do not need to finish everything. Just stay with the next small move.</p></header><div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]"><Card variant="main" className="relative overflow-hidden p-6 text-center sm:p-10"><div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent-primary bg-accent-primary/10 text-accent-primary"><Timer className="h-7 w-7"/></div><p className="font-pixel text-[9px] text-accent-secondary">CURRENT MISSION</p><h2 className="mx-auto mt-3 max-w-lg text-lg font-semibold text-text-primary">{quest?.title ?? 'Create a quest to begin a focus session.'}</h2><div className="my-8 font-pixel text-5xl tracking-wider text-accent-primary sm:text-7xl">{formatted}</div><div className="mb-7 flex justify-center gap-2">{[10, 25, 45].map((value) => <button key={value} disabled={running} onClick={() => setMinutes(value)} className={`border px-3 py-2 font-pixel text-[9px] ${minutes === value ? 'border-accent-primary bg-accent-primary/15 text-accent-primary' : 'border-base-border text-text-secondary'}`}>{value}M</button>)}</div><div className="flex justify-center gap-3">{running ? <PixelButton variant="secondary" onClick={() => setRunning(false)}><Pause className="mr-2 h-4 w-4"/>PAUSE</PixelButton> : <PixelButton disabled={!quest} onClick={() => setRunning(true)}><Play className="mr-2 h-4 w-4"/>START FOCUS</PixelButton>}<PixelButton variant="ghost" disabled={running} onClick={() => setSecondsLeft(minutes * 60)}><RotateCcw className="h-4 w-4"/></PixelButton></div></Card><div className="space-y-5"><Card><p className="font-pixel text-[9px] text-text-primary">YOUR FOCUS RECORD</p><div className="mt-5 grid grid-cols-2 gap-3"><Metric value={String(sessionCount)} label="sessions"/><Metric value={`${totalMinutes}m`} label="focused"/></div></Card><Card variant="highlight"><div className="flex items-center gap-3"><Brain className="h-5 w-5 text-accent-secondary"/><div><p className="font-pixel text-[9px] text-accent-secondary">STUCK?</p><p className="mt-1 text-sm text-text-primary">Ask your quest guide for a smaller way in.</p></div></div><Select className="mt-4" value={reason} onChange={(event) => setReason(event.target.value as ProcrastinationReason)}>{reasons.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Select><PixelButton className="mt-3" size="sm" disabled={!quest || thinking} onClick={askGuide}>{thinking ? 'THINKING…' : 'GET A NEXT MOVE'}</PixelButton>{guide && <div className="mt-4 border-l-2 border-accent-secondary bg-base/40 p-3"><p className="text-sm font-semibold text-text-primary">{guide.message}</p><p className="mt-2 text-xs leading-5 text-text-secondary">{guide.suggestion}</p></div>}</Card><Card><div className="flex items-center gap-3 text-text-secondary"><Coffee className="h-5 w-5 text-accent-warning"/><p className="text-sm">Short breaks are part of deep work. Take one after a completed session.</p></div></Card></div></div></div>;
}

function Metric({ value, label }: { value: string; label: string }) { return <div className="border border-base-border bg-base/40 p-3 text-center"><p className="font-pixel text-lg text-accent-primary">{value}</p><p className="mt-1 text-[11px] text-text-secondary">{label}</p></div>; }
