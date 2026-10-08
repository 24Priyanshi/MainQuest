import { AIProvider } from './index';
import { AIDecompositionResult, AIIntervention, ProcrastinationReason } from '@/lib/types';

// Realistic mock decomposition patterns
const DECOMPOSITION_PATTERNS: Record<string, AIDecompositionResult> = {
  research: {
    steps: [
      { title: 'Open current manuscript/document', description: 'Locate and open the latest version of your work.' },
      { title: 'Identify unfinished sections', description: 'Scan through and list which sections need work.' },
      { title: 'Draft the weakest section first', description: 'Start with the section that needs the most work — imperfect drafts are fine.' },
      { title: 'Add supporting references', description: 'Find and insert citations for key claims.' },
      { title: 'Review and connect sections', description: 'Ensure sections flow logically into each other.' },
      { title: 'Final proofread pass', description: 'Read through once for grammar and clarity.' },
    ],
    nextMove: 'Open the document and list which sections are incomplete.',
  },
  code: {
    steps: [
      { title: 'Read the requirements/spec', description: 'Understand exactly what needs to be built.' },
      { title: 'Set up the development environment', description: 'Make sure your tools and dependencies are ready.' },
      { title: 'Write the simplest version first', description: 'Get the basic functionality working before optimization.' },
      { title: 'Add error handling', description: 'Handle edge cases and unexpected inputs.' },
      { title: 'Write tests for core logic', description: 'Verify the main functionality works correctly.' },
      { title: 'Refactor and clean up', description: 'Improve code quality and readability.' },
    ],
    nextMove: 'Open your editor and read through the requirements.',
  },
  study: {
    steps: [
      { title: 'Gather study materials', description: 'Collect textbooks, notes, and relevant resources.' },
      { title: 'Create a topic outline', description: 'List the key topics you need to cover.' },
      { title: 'Active reading — first topic', description: 'Read and take notes on the first topic.' },
      { title: 'Practice problems', description: 'Work through exercises or practice questions.' },
      { title: 'Review and summarize', description: 'Write a brief summary of what you learned.' },
    ],
    nextMove: 'Open your notes and list the topics you need to study.',
  },
  write: {
    steps: [
      { title: 'Create an outline', description: 'Write a rough structure with key points for each section.' },
      { title: 'Write 200 imperfect words', description: 'Start with a messy first draft — editing comes later.' },
      { title: 'Expand the weakest section', description: 'Add detail to the section that needs the most work.' },
      { title: 'Add examples and evidence', description: 'Support your arguments with concrete examples.' },
      { title: 'Edit for clarity', description: 'Read through and simplify complex sentences.' },
      { title: 'Final polish', description: 'Check formatting, grammar, and flow.' },
    ],
    nextMove: 'Write a rough outline with 3-5 key points. Don\'t worry about perfection.',
  },
  default: {
    steps: [
      { title: 'Define the goal clearly', description: 'Write one sentence describing what "done" looks like.' },
      { title: 'List what you already have', description: 'Identify resources, progress, and materials already available.' },
      { title: 'Identify the first concrete action', description: 'Find the smallest possible step you can take right now.' },
      { title: 'Do that first action', description: 'Spend 5-10 minutes on just this one step.' },
      { title: 'Assess and plan next step', description: 'After completing the first action, decide what comes next.' },
    ],
    nextMove: 'Write one sentence describing what "done" looks like for this task.',
  },
};

const INTERVENTION_MAP: Record<ProcrastinationReason, (questTitle: string) => AIIntervention> = {
  too_difficult: (title) => ({
    message: `"${title}" seems challenging. Let's break it into easier pieces.`,
    suggestion: 'I\'ve identified simpler sub-tasks. Complete just one small piece to build momentum.',
    actionLabel: 'Show easier steps',
  }),
  too_boring: (title) => ({
    message: `"${title}" isn't exciting, but it matters. Let's make a deal.`,
    suggestion: 'Sprint for just 10 minutes. After that, you can stop guilt-free. Often starting is the hardest part.',
    actionLabel: 'Start 10-min sprint',
  }),
  no_start: (title) => ({
    message: `Not sure where to begin with "${title}"? That's normal.`,
    suggestion: 'Here\'s your only mission right now: open the relevant file or document. That\'s it. Just open it.',
    actionLabel: 'Show me one tiny action',
  }),
  low_energy: () => ({
    message: 'Low energy is a valid signal, not laziness.',
    suggestion: 'Try a 5-minute Quick Quest — the smallest meaningful action. Sometimes starting generates energy.',
    actionLabel: 'Start Quick Quest (5 min)',
  }),
  perfectionism: (title) => ({
    message: `Perfectionism is procrastination in a fancy outfit.`,
    suggestion: `Write 100 ugly words about "${title}". Editing is forbidden for the next 5 minutes. Done is better than perfect.`,
    actionLabel: 'Start imperfect draft',
  }),
  too_large: (title) => ({
    message: `"${title}" feels too big because you're looking at all of it at once.`,
    suggestion: 'I\'m hiding everything except the next single step. Focus only on that.',
    actionLabel: 'Show only next step',
  }),
  distracted: () => ({
    message: 'Distractions are normal. The skill is returning to focus, not avoiding distractions entirely.',
    suggestion: 'Close one distracting tab or app right now. Then start a 5-minute focus session.',
    actionLabel: 'Start focus session',
  }),
  other: (title) => ({
    message: `Something is blocking you on "${title}". That's okay.`,
    suggestion: 'Sometimes the best approach is the smallest one. What\'s one tiny thing you could do in 2 minutes?',
    actionLabel: 'Find a tiny action',
  }),
};

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.match(/paper|research|thesis|dissertation|manuscript|journal|literature|review|abstract/)) return 'research';
  if (text.match(/code|implement|build|develop|program|debug|test|deploy|refactor|api|component/)) return 'code';
  if (text.match(/study|exam|learn|quiz|review|chapter|lecture|course|homework/)) return 'study';
  if (text.match(/write|essay|blog|article|report|documentation|draft|edit/)) return 'write';
  return 'default';
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class MockAIProvider implements AIProvider {
  async decomposeQuest(title: string, description: string): Promise<AIDecompositionResult> {
    await delay(800 + Math.random() * 700); // simulate API latency
    const category = detectCategory(title, description);
    const pattern = DECOMPOSITION_PATTERNS[category] || DECOMPOSITION_PATTERNS.default;

    // Slightly customize the steps with the quest title
    return {
      steps: pattern.steps.map(s => ({
        ...s,
        description: s.description,
      })),
      nextMove: pattern.nextMove,
    };
  }

  async generateNextMove(title: string, steps: string[]): Promise<string> {
    await delay(500 + Math.random() * 500);
    const incomplete = steps.filter(s => s);
    if (incomplete.length === 0) {
      return `All steps for "${title}" appear complete. Review your work and mark it done.`;
    }
    return `Your only mission right now: ${incomplete[0]}`;
  }

  async generateIntervention(reason: ProcrastinationReason, questTitle: string): Promise<AIIntervention> {
    await delay(600 + Math.random() * 400);
    const generator = INTERVENTION_MAP[reason] || INTERVENTION_MAP.other;
    return generator(questTitle);
  }

  async detectFakeProductivity(activities: string[], mainGoal: string): Promise<{
    detected: boolean;
    message: string;
    suggestion: string;
  }> {
    await delay(700 + Math.random() * 500);
    const lowImpactKeywords = ['organize', 'format', 'rename', 'sort', 'color', 'move', 'rearrange', 'planning', 'preparing'];
    const lowImpactCount = activities.filter(a =>
      lowImpactKeywords.some(kw => a.toLowerCase().includes(kw))
    ).length;

    if (lowImpactCount >= 3) {
      return {
        detected: true,
        message: `You've spent time preparing to work on "${mainGoal}" rather than actually working on it.`,
        suggestion: `Stop preparing. Start doing. Write/code/create something imperfect right now.`,
      };
    }

    return {
      detected: false,
      message: 'Your activity looks productive. Keep going!',
      suggestion: '',
    };
  }

  async generateDailyPlan(questTitles: string[]): Promise<{
    mainQuestIndex: number;
    selectedIndices: number[];
    message: string;
  }> {
    await delay(800 + Math.random() * 500);
    const mainQuestIndex = 0;
    const selected = questTitles.slice(0, Math.min(3, questTitles.length)).map((_, i) => i);

    return {
      mainQuestIndex,
      selectedIndices: selected,
      message: questTitles.length > 3
        ? `You have ${questTitles.length} open tasks today. Trying to complete all ${questTitles.length} is unrealistic. I selected the three that matter most.`
        : `You have ${questTitles.length} quests today. That's a manageable load. Focus on completing them in order.`,
    };
  }

  async analyzeProof(proofText: string, questTitle: string): Promise<{
    assessment: 'relevant' | 'weak' | 'unclear';
    message: string;
  }> {
    await delay(600 + Math.random() * 400);
    if (proofText.length > 50) {
      return {
        assessment: 'relevant',
        message: `This looks like valid proof for "${questTitle}". Well done!`,
      };
    }
    if (proofText.length > 15) {
      return {
        assessment: 'weak',
        message: 'This proof is brief. Consider adding more detail about what you accomplished.',
      };
    }
    return {
      assessment: 'unclear',
      message: 'This looks more like a note than proof of work. Do you still want to mark the quest complete?',
    };
  }

  async generateInsight(data: Record<string, unknown>): Promise<string> {
    await delay(500);
    const insights = [
      'You tend to postpone ambiguous tasks more than clearly defined tasks.',
      'Your best focus period appears to be in the morning hours.',
      'Tasks that are broken into steps get completed 2x more often.',
      'You usually complete tasks after they have been broken into steps.',
      'Your productivity peaks mid-week and dips on Mondays.',
    ];
    const totalQuests = (data.totalQuests as number) || 0;
    if (totalQuests < 5) {
      return 'Not enough data yet. Complete a few more quests to unlock insights.';
    }
    return insights[Math.floor(Math.random() * insights.length)];
  }
}
