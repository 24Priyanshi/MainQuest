export function isStreakActive(
  lastActiveDate: string,
  today: string
): boolean {
  const last = new Date(lastActiveDate);
  const now = new Date(today);
  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays <= 1;
}

export function shouldStreakBreak(
  lastActiveDate: string,
  today: string,
  shieldsAvailable: number
): { broken: boolean; shieldUsed: boolean } {
  const last = new Date(lastActiveDate);
  const now = new Date(today);
  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return { broken: false, shieldUsed: false };
  if (diffDays === 2 && shieldsAvailable > 0) return { broken: false, shieldUsed: true };
  return { broken: true, shieldUsed: false };
}

export function checkDailyMinimum(params: {
  type: 'xp' | 'quests' | 'minutes';
  value: number;
  xpEarned: number;
  questsCompleted: number;
  focusMinutes: number;
}): boolean {
  switch (params.type) {
    case 'xp':
      return params.xpEarned >= params.value;
    case 'quests':
      return params.questsCompleted >= params.value;
    case 'minutes':
      return params.focusMinutes >= params.value;
    default:
      return false;
  }
}

export function getStreakShieldEligibility(currentStreak: number): boolean {
  return currentStreak >= 7;
}

export function getNextShieldDate(currentStreak: number): number {
  const shieldsFromStreak = Math.floor(currentStreak / 7);
  const nextThreshold = (shieldsFromStreak + 1) * 7;
  return nextThreshold - currentStreak;
}
