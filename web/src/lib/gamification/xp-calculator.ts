export const XP_REWARDS = {
  LESSON_COMPLETE: 100,
  QUIZ_PASS: 50,
  DAILY_STREAK: 25,
} as const;

const LEVEL_THRESHOLDS: { level: number; xp: number; title: string }[] = [
  { level: 1, xp: 0, title: "Beginner" },
  { level: 2, xp: 100, title: "Curious Mind" },
  { level: 3, xp: 250, title: "Eager Learner" },
  { level: 4, xp: 500, title: "Knowledge Seeker" },
  { level: 5, xp: 1000, title: "Rising Scholar" },
  { level: 6, xp: 2000, title: "Dedicated Student" },
  { level: 7, xp: 3500, title: "Keen Explorer" },
  { level: 8, xp: 5000, title: "Bright Thinker" },
  { level: 9, xp: 7500, title: "Sharp Analyst" },
  { level: 10, xp: 10000, title: "Scholar" },
  { level: 12, xp: 15000, title: "Trailblazer" },
  { level: 15, xp: 25000, title: "Thought Leader" },
  { level: 20, xp: 50000, title: "Master Scholar" },
  { level: 25, xp: 100000, title: "Master" },
  { level: 35, xp: 250000, title: "Grand Scholar" },
  { level: 50, xp: 500000, title: "Grand Master" },
];

export interface LevelInfo {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
  title: string;
}

export function getLevelInfo(xp: number): LevelInfo {
  let level = 1;
  let title = LEVEL_THRESHOLDS[0].title;

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      level = LEVEL_THRESHOLDS[i].level;
      title = LEVEL_THRESHOLDS[i].title;
      break;
    }
  }

  const currentThreshold = LEVEL_THRESHOLDS.findLast((t) => t.xp <= xp) ?? LEVEL_THRESHOLDS[0];
  const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.xp > xp);

  if (!nextThreshold) {
    return { level, currentXp: xp, nextLevelXp: xp, progress: 1, title };
  }

  const progress = (xp - currentThreshold.xp) / (nextThreshold.xp - currentThreshold.xp);

  return {
    level,
    currentXp: xp - currentThreshold.xp,
    nextLevelXp: nextThreshold.xp - currentThreshold.xp,
    progress: Math.min(progress, 1),
    title,
  };
}

export function getLevel(xp: number): number {
  return getLevelInfo(xp).level;
}

export function getLevelProgress(xp: number): number {
  return getLevelInfo(xp).progress;
}


