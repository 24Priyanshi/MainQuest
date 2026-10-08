'use client';

import { useState } from 'react';
import { Check, ChevronDown, Circle, Plus, Sparkles, Swords } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MockAIProvider } from '@/lib/ai/mock-provider';
import type { Quest, QuestPriority, QuestType } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { DifficultyStars } from '@/components/ui/DifficultyStars';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PixelButton } from '@/components/ui/PixelButton';
import { ProgressBar } from '@/components/ui/ProgressBar';

const ai = new MockAIProvider();

export default function QuestsPage() {
  const { state, dispatch } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questType, setQuestType] = useState<QuestType>('quest');
  const [priority, setPriority] = useState<QuestPriority>('medium');
  const [busyId, setBusyId] = useState<string | null>(null);
  const active = state.quests.filter((quest) => !['completed', 'abandoned'].includes(quest.status));
  const completed = state.quests.filter((quest) => quest.status === 'completed');

  const addQuest = async () => {
    if (!state.user || !title.trim()) return;
    const id = crypto.randomUUID();
    const result = await ai.decomposeQuest(title, description);
    dispatch({ type: 'ADD_QUEST', payload: {
      id, userId: state.user.id, projectId: null, title: title.trim(), description,
      questType, priority, difficulty: 3, status: 'not_started', estimatedMinutes: 45,
      deadline: null, xpReward: questType === 'main' ? 60 : 25, progress: 0,
      postponementCount: 0, createdAt: new Date().toISOString(), completedAt: null,
      aiNextAction: result.nextMove,
      steps: result.steps.map((step, index) => ({ id: crypto.randomUUID(), questId: id, ...step, orderIndex: index, isCompleted: false, completedAt: null })),
    }});
    setTitle(''); setDescription(''); setIsCreating(false); setExpandedId(id);
  };

  const decompose = async (quest: Quest) => {
    setBusyId(quest.id);
    const result = await ai.decomposeQuest(quest.title, quest.description);
    dispatch({ type: 'SET_QUEST_STEPS', payload: { questId: quest.id, steps: result.steps.map((step, index) => ({ id: crypto.randomUUID(), questId: quest.id, ...step, orderIndex: index, isCompleted: false, completedAt: null })) } });
    dispatch({ type: 'UPDATE_QUEST', payload: { id: quest.id, updates: { aiNextAction: result.nextMove, status: 'active' } } });
    setExpandedId(quest.id); setBusyId(null);
  };

  const toggleStep = (quest: Quest, stepId: string) => {
    const step = quest.steps.find((item) => item.id === stepId);
    if (!step) return;
    const isCompleted = !step.isCompleted;
    const steps = quest.steps.map((item) => item.id === stepId ? { ...item, isCompleted, completedAt: isCompleted ? new Date().toISOString() : null } : item);
    const progress = steps.length ? Math.round((steps.filter((item) => item.isCompleted).length / steps.length) * 100) : 0;
    dispatch({ type: 'UPDATE_QUEST_STEP', payload: { questId: quest.id, stepId, updates: { isCompleted, completedAt: isCompleted ? new Date().toISOString() : null } } });
    dispatch({ type: 'UPDATE_QUEST', payload: { id: quest.id, updates: { progress, status: progress === 100 ? 'completed' : 'active', completedAt: progress === 100 ? new Date().toISOString() : null } } });
    if (progress === 100 && state.user) dispatch({ type: 'UPDATE_USER', payload: { totalXp: state.user.totalXp + quest.xpReward } });
  };

  return <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
    <header className="mb-7 flex flex-col gap-4 border-b-2 border-base-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="mb-2 font-pixel text-[9px] text-accent-secondary">QUEST BOARD</p><h1 className="font-pixel text-xl text-text-primary">YOUR CAMPAIGN</h1><p className="mt-2 text-sm text-text-secondary">Only keep quests that move your real life forward.</p></div>
      <PixelButton onClick={() => setIsCreating(true)}><Plus className="mr-2 h-4 w-4" /> NEW QUEST</PixelButton>
    </header>
    <div className="mb-5 flex items-center gap-3 text-sm"><Badge variant="main">{active.length} ACTIVE</Badge><span className="text-text-secondary">{completed.length} cleared</span></div>
    <div className="space-y-3">
      {active.map((quest) => <QuestCard key={quest.id} quest={quest} expanded={expandedId === quest.id} busy={busyId === quest.id} onExpand={() => setExpandedId(expandedId === quest.id ? null : quest.id)} onDecompose={() => decompose(quest)} onToggleStep={(stepId) => toggleStep(quest, stepId)} />)}
    </div>
    {completed.length > 0 && <section className="mt-8"><p className="mb-3 font-pixel text-[10px] text-text-secondary">CLEARED QUESTS · {completed.length}</p><div className="grid gap-3 md:grid-cols-2">{completed.slice(-4).map((quest) => <Card key={quest.id} className="flex items-center gap-3 opacity-70"><Check className="h-5 w-5 text-accent-primary"/><span className="text-sm line-through">{quest.title}</span><span className="ml-auto font-pixel text-[9px] text-accent-primary">+{quest.xpReward} XP</span></Card>)}</div></section>}
    <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title="Create a quest" size="lg"><div className="space-y-4"><Input label="QUEST TITLE" pixelLabel value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What will you make progress on?"/><Textarea label="DESCRIPTION" pixelLabel value={description} onChange={(event) => setDescription(event.target.value)} placeholder="A little context helps the guide split this into steps."/><div className="grid gap-4 sm:grid-cols-2"><Select label="QUEST TYPE" pixelLabel value={questType} onChange={(event) => setQuestType(event.target.value as QuestType)}><option value="quick">Quick quest</option><option value="side">Side quest</option><option value="quest">Quest</option><option value="main">Main quest</option></Select><Select label="PRIORITY" pixelLabel value={priority} onChange={(event) => setPriority(event.target.value as QuestPriority)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></Select></div><div className="flex justify-end gap-3 pt-2"><PixelButton variant="ghost" onClick={() => setIsCreating(false)}>CANCEL</PixelButton><PixelButton disabled={!title.trim()} onClick={addQuest}>CREATE & BREAK DOWN</PixelButton></div></div></Modal>
  </div>;
}

function QuestCard({ quest, expanded, busy, onExpand, onDecompose, onToggleStep }: { quest: Quest; expanded: boolean; busy: boolean; onExpand: () => void; onDecompose: () => void; onToggleStep: (id: string) => void }) {
  const done = quest.steps.filter((step) => step.isCompleted).length;
  return <Card variant={quest.questType === 'main' ? 'main' : 'default'} className="p-0 overflow-hidden"><button onClick={onExpand} className="w-full p-4 text-left sm:p-5"><div className="flex gap-4"><div className="flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><Badge variant={quest.questType}>{quest.questType}</Badge><span className="font-pixel text-[9px] text-accent-primary">+{quest.xpReward} XP</span><span className="text-xs text-text-secondary">{quest.estimatedMinutes} min</span></div><h2 className="font-semibold text-text-primary">{quest.title}</h2><p className="mt-1 line-clamp-1 text-sm text-text-secondary">{quest.description || 'No description yet.'}</p></div><ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-text-secondary transition-transform ${expanded ? 'rotate-180' : ''}`}/></div><div className="mt-4 flex items-center gap-3"><ProgressBar progress={quest.progress} size="sm"/><span className="whitespace-nowrap text-xs text-text-secondary">{done}/{quest.steps.length || '—'}</span></div></button>{expanded && <div className="border-t-2 border-base-border bg-base/35 p-4 sm:p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="font-pixel text-[9px] text-accent-secondary">GUIDED NEXT MOVE</p><p className="mt-1 text-sm text-text-primary">{quest.aiNextAction || 'Turn this into small, finishable steps.'}</p></div>{quest.steps.length === 0 && <PixelButton size="sm" disabled={busy} onClick={onDecompose}><Sparkles className="mr-2 h-3 w-3" /> {busy ? 'THINKING…' : 'BREAK IT DOWN'}</PixelButton>}</div>{quest.steps.length > 0 && <div className="space-y-2">{quest.steps.map((step) => <button onClick={() => onToggleStep(step.id)} key={step.id} className="flex w-full items-start gap-3 rounded border border-base-border bg-base/50 p-3 text-left hover:border-accent-primary/60"><span className="mt-0.5">{step.isCompleted ? <Check className="h-4 w-4 text-accent-primary"/> : <Circle className="h-4 w-4 text-text-secondary"/>}</span><span><span className={`block text-sm ${step.isCompleted ? 'text-text-secondary line-through' : 'text-text-primary'}`}>{step.title}</span>{step.description && <span className="mt-1 block text-xs text-text-secondary">{step.description}</span>}</span></button>)}</div>}</div>}</Card>;
}
