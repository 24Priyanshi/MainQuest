import { AIDecompositionResult, AIIntervention, ProcrastinationReason } from '@/lib/types';

export interface AIProvider {
  decomposeQuest(title: string, description: string): Promise<AIDecompositionResult>;
  generateNextMove(title: string, steps: string[]): Promise<string>;
  generateIntervention(reason: ProcrastinationReason, questTitle: string): Promise<AIIntervention>;
  detectFakeProductivity(activities: string[], mainGoal: string): Promise<{ detected: boolean; message: string; suggestion: string }>;
  generateDailyPlan(questTitles: string[]): Promise<{ mainQuestIndex: number; selectedIndices: number[]; message: string }>;
  analyzeProof(proofText: string, questTitle: string): Promise<{ assessment: 'relevant' | 'weak' | 'unclear'; message: string }>;
  generateInsight(data: Record<string, unknown>): Promise<string>;
}

let currentProvider: AIProvider | null = null;

export function setAIProvider(provider: AIProvider) {
  currentProvider = provider;
}

export function getAIProvider(): AIProvider {
  if (!currentProvider) {
    throw new Error('AI provider not initialized. Call setAIProvider first.');
  }
  return currentProvider;
}
