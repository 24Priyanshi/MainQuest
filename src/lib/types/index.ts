export type QuestType = 'main' | 'quest' | 'side' | 'quick';
export type QuestStatus = 'not_started' | 'active' | 'paused' | 'completed' | 'abandoned';
export type QuestPriority = 'critical' | 'high' | 'medium' | 'low';
export type ProofType = 'screenshot' | 'text' | 'link' | 'file';
export type ProcrastinationReason =
  | 'too_difficult'
  | 'too_boring'
  | 'no_start'
  | 'low_energy'
  | 'perfectionism'
  | 'too_large'
  | 'distracted'
  | 'other';

export type FocusSessionStatus = 'active' | 'completed' | 'cancelled' | 'paused';

export interface Quest {
  id: string;
  userId: string;
  projectId: string | null;
  title: string;
  description: string;
  questType: QuestType;
  priority: QuestPriority;
  difficulty: number; // 1-5
  status: QuestStatus;
  estimatedMinutes: number;
  deadline: string | null;
  xpReward: number;
  progress: number; // 0-100
  postponementCount: number;
  createdAt: string;
  completedAt: string | null;
  aiNextAction: string | null;
  steps: QuestStep[];
}

export interface QuestStep {
  id: string;
  questId: string;
  title: string;
  description: string;
  orderIndex: number;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  milestones: ProjectMilestone[];
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  orderIndex: number;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl: string;
  level: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  dailyMinimumType: 'xp' | 'quests' | 'minutes';
  dailyMinimumValue: number;
  onboardingCompleted: boolean;
  procrastinationReasons: ProcrastinationReason[];
  workCategory: string;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  questId: string;
  startedAt: string;
  endedAt: string | null;
  plannedMinutes: number;
  actualMinutes: number;
  status: FocusSessionStatus;
  distractionCount: number;
  notes: string;
}

export interface XPEvent {
  id: string;
  userId: string;
  questId: string | null;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface DailyActivity {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  questsCompleted: number;
  focusMinutes: number;
  xpEarned: number;
  dailyScore: number;
  interventionsOvercome: number;
}

export interface ProcrastinationEvent {
  id: string;
  userId: string;
  questId: string;
  reason: ProcrastinationReason;
  triggerType: string;
  intervention: string;
  createdAt: string;
}

export interface ProofOfWork {
  id: string;
  questId: string;
  userId: string;
  type: ProofType;
  content: string;
  fileUrl: string | null;
  aiAssessment: string | null;
  createdAt: string;
}

export interface DailyPlan {
  id: string;
  userId: string;
  date: string;
  mainQuestId: string | null;
  questIds: string[];
  createdAt: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  streakShieldsAvailable: number;
  streakShieldsUsedThisMonth: number;
}

export interface ProductivityInsight {
  id: string;
  userId: string;
  insightText: string;
  insightType: string;
  dataJson: Record<string, unknown>;
  createdAt: string;
}

export interface AIDecompositionResult {
  steps: { title: string; description: string }[];
  nextMove: string;
}

export interface AIIntervention {
  message: string;
  suggestion: string;
  actionLabel: string;
}
