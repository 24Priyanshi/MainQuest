import { Quest, QuestStep, UserProfile, FocusSession, XPEvent, DailyActivity, ProcrastinationEvent, Project } from '@/lib/types';

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function hoursFromNow(h: number): string {
  const d = new Date();
  d.setHours(d.getHours() + h);
  return d.toISOString();
}

const userId = 'demo-user-001';
const projectId = 'proj-research-001';
const projectId2 = 'proj-coding-001';

const questIds = {
  main: 'quest-main-001',
  methodology: 'quest-002',
  transformer: 'quest-003',
  supervisor: 'quest-004',
  evaluation: 'quest-005',
  reading: 'quest-side-001',
  email: 'quest-side-002',
};

export function createDemoUser(): UserProfile {
  return {
    id: userId,
    displayName: 'Alex',
    avatarUrl: '',
    level: 12,
    totalXp: 2840,
    currentStreak: 8,
    longestStreak: 15,
    dailyMinimumType: 'minutes',
    dailyMinimumValue: 20,
    onboardingCompleted: true,
    procrastinationReasons: ['too_large', 'no_start', 'perfectionism'],
    workCategory: 'Research',
    createdAt: daysAgo(45),
  };
}

export function createDemoProjects(): Project[] {
  return [
    {
      id: projectId,
      userId,
      title: 'BEACON Research Paper',
      description: 'Final research paper for the BEACON project on efficient transformers',
      color: '#39ff14',
      icon: '📄',
      milestones: [
        { id: 'm1', projectId, title: 'Literature Review', description: 'Complete literature survey', orderIndex: 0, isCompleted: true, completedAt: daysAgo(20) },
        { id: 'm2', projectId, title: 'Experiments', description: 'Run all model experiments', orderIndex: 1, isCompleted: false, completedAt: null },
        { id: 'm3', projectId, title: 'Results & Analysis', description: 'Analyze results and create figures', orderIndex: 2, isCompleted: false, completedAt: null },
        { id: 'm4', projectId, title: 'Writing', description: 'Write and polish the paper', orderIndex: 3, isCompleted: false, completedAt: null },
        { id: 'm5', projectId, title: 'Submission', description: 'Final review and submit', orderIndex: 4, isCompleted: false, completedAt: null },
      ],
      createdAt: daysAgo(30),
    },
    {
      id: projectId2,
      userId,
      title: 'Evaluation Pipeline',
      description: 'Build automated evaluation pipeline for model benchmarks',
      color: '#bf5af2',
      icon: '💻',
      milestones: [
        { id: 'm6', projectId: projectId2, title: 'Setup', description: 'Set up project structure and dependencies', orderIndex: 0, isCompleted: true, completedAt: daysAgo(10) },
        { id: 'm7', projectId: projectId2, title: 'Core Logic', description: 'Implement evaluation metrics', orderIndex: 1, isCompleted: false, completedAt: null },
        { id: 'm8', projectId: projectId2, title: 'Testing', description: 'Write tests and validate', orderIndex: 2, isCompleted: false, completedAt: null },
      ],
      createdAt: daysAgo(15),
    },
  ];
}

export function createDemoQuests(): Quest[] {
  return [
    {
      id: questIds.main,
      userId,
      projectId,
      title: 'Run BEACON final experiments',
      description: 'Execute the remaining model experiments for the BEACON paper. Need to run 4-bit and 8-bit baselines, collect metrics, and log results.',
      questType: 'main',
      priority: 'critical',
      difficulty: 4,
      status: 'active',
      estimatedMinutes: 180,
      deadline: hoursFromNow(18),
      xpReward: 60,
      progress: 40,
      postponementCount: 1,
      createdAt: daysAgo(3),
      completedAt: null,
      aiNextAction: 'Run the 4-bit baseline experiment and log the results.',
      steps: [
        { id: 's1', questId: questIds.main, title: 'Set up experiment config', description: 'Prepare configuration files for baselines', orderIndex: 0, isCompleted: true, completedAt: daysAgo(2) },
        { id: 's2', questId: questIds.main, title: 'Run 4-bit baseline', description: 'Execute the 4-bit quantized model experiment', orderIndex: 1, isCompleted: false, completedAt: null },
        { id: 's3', questId: questIds.main, title: 'Run 8-bit baseline', description: 'Execute the 8-bit quantized model experiment', orderIndex: 2, isCompleted: false, completedAt: null },
        { id: 's4', questId: questIds.main, title: 'Collect and log metrics', description: 'Record accuracy, latency, and memory usage', orderIndex: 3, isCompleted: false, completedAt: null },
        { id: 's5', questId: questIds.main, title: 'Compare with full-precision', description: 'Create comparison table against full-precision baseline', orderIndex: 4, isCompleted: false, completedAt: null },
      ],
    },
    {
      id: questIds.methodology,
      userId,
      projectId,
      title: 'Write methodology section',
      description: 'Complete the methodology section of the BEACON paper. Cover model architecture, training procedure, and evaluation protocol.',
      questType: 'quest',
      priority: 'high',
      difficulty: 3,
      status: 'not_started',
      estimatedMinutes: 120,
      deadline: hoursFromNow(48),
      xpReward: 35,
      progress: 0,
      postponementCount: 2,
      createdAt: daysAgo(5),
      completedAt: null,
      aiNextAction: 'Open the manuscript and write the first paragraph of the methodology section.',
      steps: [
        { id: 's6', questId: questIds.methodology, title: 'Write model architecture subsection', description: '', orderIndex: 0, isCompleted: false, completedAt: null },
        { id: 's7', questId: questIds.methodology, title: 'Write training procedure', description: '', orderIndex: 1, isCompleted: false, completedAt: null },
        { id: 's8', questId: questIds.methodology, title: 'Write evaluation protocol', description: '', orderIndex: 2, isCompleted: false, completedAt: null },
        { id: 's9', questId: questIds.methodology, title: 'Add figures and tables', description: '', orderIndex: 3, isCompleted: false, completedAt: null },
      ],
    },
    {
      id: questIds.transformer,
      userId,
      projectId,
      title: 'Read transformer efficiency paper',
      description: 'Read and take notes on "Efficient Transformers: A Survey" for the related work section.',
      questType: 'quest',
      priority: 'medium',
      difficulty: 2,
      status: 'not_started',
      estimatedMinutes: 60,
      deadline: hoursFromNow(72),
      xpReward: 25,
      progress: 0,
      postponementCount: 0,
      createdAt: daysAgo(2),
      completedAt: null,
      aiNextAction: 'Open the paper PDF and read the abstract and introduction.',
      steps: [
        { id: 's10', questId: questIds.transformer, title: 'Read abstract & introduction', description: '', orderIndex: 0, isCompleted: false, completedAt: null },
        { id: 's11', questId: questIds.transformer, title: 'Read key methodology sections', description: '', orderIndex: 1, isCompleted: false, completedAt: null },
        { id: 's12', questId: questIds.transformer, title: 'Take summary notes', description: '', orderIndex: 2, isCompleted: false, completedAt: null },
      ],
    },
    {
      id: questIds.supervisor,
      userId,
      projectId: null,
      title: 'Send supervisor progress update',
      description: 'Write and send a brief progress update email to Prof. Chen about the BEACON project status.',
      questType: 'side',
      priority: 'medium',
      difficulty: 1,
      status: 'not_started',
      estimatedMinutes: 15,
      deadline: hoursFromNow(24),
      xpReward: 15,
      progress: 0,
      postponementCount: 0,
      createdAt: daysAgo(1),
      completedAt: null,
      aiNextAction: 'Open your email client and write 3 bullet points of progress.',
      steps: [],
    },
    {
      id: questIds.evaluation,
      userId,
      projectId: projectId2,
      title: 'Implement evaluation metrics script',
      description: 'Write the Python script for computing BLEU, ROUGE, and accuracy metrics on model outputs.',
      questType: 'quest',
      priority: 'high',
      difficulty: 3,
      status: 'paused',
      estimatedMinutes: 90,
      deadline: hoursFromNow(96),
      xpReward: 30,
      progress: 25,
      postponementCount: 1,
      createdAt: daysAgo(4),
      completedAt: null,
      aiNextAction: 'Open the evaluation script and implement the BLEU score function.',
      steps: [
        { id: 's13', questId: questIds.evaluation, title: 'Set up script structure', description: '', orderIndex: 0, isCompleted: true, completedAt: daysAgo(3) },
        { id: 's14', questId: questIds.evaluation, title: 'Implement BLEU score', description: '', orderIndex: 1, isCompleted: false, completedAt: null },
        { id: 's15', questId: questIds.evaluation, title: 'Implement ROUGE score', description: '', orderIndex: 2, isCompleted: false, completedAt: null },
        { id: 's16', questId: questIds.evaluation, title: 'Implement accuracy metric', description: '', orderIndex: 3, isCompleted: false, completedAt: null },
        { id: 's17', questId: questIds.evaluation, title: 'Add CLI interface', description: '', orderIndex: 4, isCompleted: false, completedAt: null },
      ],
    },
    {
      id: questIds.reading,
      userId,
      projectId: null,
      title: 'Organize reference manager',
      description: 'Clean up Zotero library and tag papers by topic.',
      questType: 'side',
      priority: 'low',
      difficulty: 1,
      status: 'not_started',
      estimatedMinutes: 30,
      deadline: null,
      xpReward: 10,
      progress: 0,
      postponementCount: 0,
      createdAt: daysAgo(7),
      completedAt: null,
      aiNextAction: null,
      steps: [],
    },
    {
      id: questIds.email,
      userId,
      projectId: null,
      title: 'Reply to conference review',
      description: 'Draft response to reviewer comments on the workshop paper.',
      questType: 'side',
      priority: 'low',
      difficulty: 2,
      status: 'not_started',
      estimatedMinutes: 45,
      deadline: hoursFromNow(168),
      xpReward: 15,
      progress: 0,
      postponementCount: 0,
      createdAt: daysAgo(3),
      completedAt: null,
      aiNextAction: null,
      steps: [],
    },
  ];
}

export function createDemoFocusSessions(): FocusSession[] {
  return [
    { id: 'fs1', userId, questId: questIds.main, startedAt: daysAgo(1), endedAt: daysAgo(1), plannedMinutes: 45, actualMinutes: 42, status: 'completed', distractionCount: 2, notes: 'Set up config files for experiments' },
    { id: 'fs2', userId, questId: questIds.evaluation, startedAt: daysAgo(2), endedAt: daysAgo(2), plannedMinutes: 25, actualMinutes: 25, status: 'completed', distractionCount: 0, notes: 'Started evaluation script structure' },
    { id: 'fs3', userId, questId: questIds.methodology, startedAt: daysAgo(3), endedAt: daysAgo(3), plannedMinutes: 25, actualMinutes: 8, status: 'cancelled', distractionCount: 4, notes: 'Got distracted, abandoned session' },
    { id: 'fs4', userId, questId: questIds.main, startedAt: daysAgo(4), endedAt: daysAgo(4), plannedMinutes: 45, actualMinutes: 50, status: 'completed', distractionCount: 1, notes: 'Great session, configured baselines' },
    { id: 'fs5', userId, questId: questIds.transformer, startedAt: daysAgo(5), endedAt: daysAgo(5), plannedMinutes: 25, actualMinutes: 30, status: 'completed', distractionCount: 0, notes: 'Read first half of survey paper' },
  ];
}

export function createDemoXPEvents(): XPEvent[] {
  const events: XPEvent[] = [];
  // Generate XP events over the past 30 days
  for (let i = 30; i >= 0; i--) {
    const numEvents = Math.floor(Math.random() * 3) + (i < 8 ? 1 : 0);
    for (let j = 0; j < numEvents; j++) {
      events.push({
        id: `xp-${i}-${j}`,
        userId,
        questId: null,
        amount: Math.floor(Math.random() * 40) + 10,
        reason: ['Quest completed', 'Focus session', 'Streak bonus', 'Quick quest'][Math.floor(Math.random() * 4)],
        createdAt: daysAgo(i),
      });
    }
  }
  return events;
}

export function createDemoDailyActivity(): DailyActivity[] {
  const activities: DailyActivity[] = [];
  for (let i = 120; i >= 0; i--) {
    // Simulate realistic activity patterns
    const isWeekend = new Date(new Date().getTime() - i * 86400000).getDay() % 6 === 0;
    const hasActivity = Math.random() > (isWeekend ? 0.5 : 0.15);

    if (hasActivity) {
      const questsCompleted = Math.floor(Math.random() * 4);
      const focusMinutes = Math.floor(Math.random() * 120) + (questsCompleted > 0 ? 15 : 0);
      const xpEarned = questsCompleted * 25 + Math.floor(focusMinutes * 0.5);

      activities.push({
        id: `da-${i}`,
        userId,
        date: dateStr(i),
        questsCompleted,
        focusMinutes,
        xpEarned,
        dailyScore: Math.min(Math.round(questsCompleted * 15 + focusMinutes * 0.5), 100),
        interventionsOvercome: Math.random() > 0.7 ? 1 : 0,
      });
    }
  }
  return activities;
}

export function createDemoProcrastinationEvents(): ProcrastinationEvent[] {
  return [
    { id: 'pe1', userId, questId: questIds.methodology, reason: 'perfectionism', triggerType: 'postpone_count', intervention: 'Write 100 ugly words', createdAt: daysAgo(5) },
    { id: 'pe2', userId, questId: questIds.methodology, reason: 'too_large', triggerType: 'postpone_count', intervention: 'Show only next step', createdAt: daysAgo(3) },
    { id: 'pe3', userId, questId: questIds.evaluation, reason: 'no_start', triggerType: 'session_cancel', intervention: 'Show tiny action', createdAt: daysAgo(2) },
    { id: 'pe4', userId, questId: questIds.main, reason: 'too_difficult', triggerType: 'postpone_count', intervention: 'Break into easier steps', createdAt: daysAgo(6) },
  ];
}

export function loadDemoData() {
  return {
    user: createDemoUser(),
    quests: createDemoQuests(),
    focusSessions: createDemoFocusSessions(),
    xpEvents: createDemoXPEvents(),
    dailyActivity: createDemoDailyActivity(),
    procrastinationEvents: createDemoProcrastinationEvents(),
    projects: createDemoProjects(),
    proofs: [],
  };
}
