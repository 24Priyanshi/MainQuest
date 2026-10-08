// Progressive XP curve for levels
// Level N requires: base * N^exponent total XP
const BASE_XP = 100;
const EXPONENT = 1.5;

export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(BASE_XP * Math.pow(level - 1, EXPONENT));
}

export function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

export function getLevelFromTotalXP(totalXP: number): {
  level: number;
  currentLevelXP: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
} {
  let level = 1;
  let accumulatedXP = 0;

  while (true) {
    const nextLevelXP = getXPForLevel(level + 1);
    if (accumulatedXP + nextLevelXP > totalXP) {
      return {
        level,
        currentLevelXP: totalXP - accumulatedXP,
        xpForNextLevel: nextLevelXP,
        xpInCurrentLevel: totalXP - accumulatedXP,
      };
    }
    accumulatedXP += nextLevelXP;
    level++;
    if (level > 999) break; // safety cap
  }

  return { level, currentLevelXP: 0, xpForNextLevel: 1, xpInCurrentLevel: 0 };
}

export function getTitle(level: number): string {
  if (level >= 50) return 'Legendary Hero';
  if (level >= 40) return 'Grand Master';
  if (level >= 30) return 'Master';
  if (level >= 25) return 'Champion';
  if (level >= 20) return 'Veteran';
  if (level >= 15) return 'Knight';
  if (level >= 10) return 'Warrior';
  if (level >= 7) return 'Fighter';
  if (level >= 5) return 'Apprentice';
  if (level >= 3) return 'Initiate';
  return 'Novice';
}

// Example level table:
// Level 1:   0 XP total
// Level 2: 100 XP total
// Level 3: 382 XP total  (100 + 282)
// Level 4: 882 XP total  (100 + 282 + 500)
// Level 5: 1682 XP total (100 + 282 + 500 + 800)
