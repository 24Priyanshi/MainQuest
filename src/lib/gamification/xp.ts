import { Quest, QuestType, QuestPriority } from '@/lib/types';

// XP ranges by quest type
const XP_RANGES: Record<QuestType, [number, number]> = {
  quick: [5, 10],
  side: [10, 20],
  quest: [20, 40],
  main: [40, 100],
};

// Difficulty multiplier (1-5)
const DIFFICULTY_MULTIPLIERS = [0.8, 0.9, 1.0, 1.2, 1.5];

// Priority bonus
const PRIORITY_BONUS: Record<QuestPriority, number> = {
  low: 0,
  medium: 5,
  high: 10,
  critical: 20,
};

export function calculateQuestXP(
  questType: QuestType,
  difficulty: number,
  priority: QuestPriority
): number {
  const [min, max] = XP_RANGES[questType];
  const base = Math.round((min + max) / 2);
  const diffMultiplier = DIFFICULTY_MULTIPLIERS[Math.min(difficulty - 1, 4)] || 1.0;
  const bonus = PRIORITY_BONUS[priority];
  return Math.round(base * diffMultiplier + bonus);
}

// XP awards for specific actions
export const XP_AWARDS = {
  QUEST_COMPLETE: (quest: Quest) => quest.xpReward,
  FOCUS_SESSION_COMPLETE: (minutes: number) => Math.round(minutes * 0.5),
  OVERCOME_PROCRASTINATION: 10,
  PROOF_SUBMITTED: 5,
  DAILY_MINIMUM_MET: 15,
  STARTED_AVOIDED_TASK: 8,
  STREAK_BONUS: (days: number) => Math.min(days, 10),
} as const;

export function calculateDailyScore(params: {
  questsCompleted: number;
  mainQuestCompleted: boolean;
  focusMinutes: number;
  proofSubmitted: boolean;
  interventionsOvercome: number;
}): number {
  let score = 0;
  score += params.questsCompleted * 15;
  if (params.mainQuestCompleted) score += 30;
  score += Math.min(params.focusMinutes, 180) * 0.5;
  if (params.proofSubmitted) score += 10;
  score += params.interventionsOvercome * 10;
  // Cap at 100
  return Math.min(Math.round(score), 100);
}
