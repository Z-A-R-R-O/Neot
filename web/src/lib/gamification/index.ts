export { calculateStreak } from "./streak-tracker";
export type { StreakResult } from "./streak-tracker";

export { XP_REWARDS, getLevelInfo, getLevel, getLevelProgress } from "./xp-calculator";
export type { LevelInfo } from "./xp-calculator";

export { getLevelTitle } from "./level-system";

export { ACHIEVEMENTS, checkAchievements } from "./achievements";
export type { AchievementDefinition } from "./achievements";
export { checkAndAwardAchievements, ensureAchievementsSeeded } from "./achievement-service";
export type { NewAchievement } from "./achievement-service";

export { REWARDS, getUnlockedRewards, getLockedRewards } from "./rewards";
export type { RewardDefinition } from "./rewards";

export { BADGES, BADGE_CATEGORIES } from "./badges";
export type { BadgeDefinition } from "./badges";
export { checkAndAwardBadges, ensureBadgesSeeded } from "./badge-service";
export type { NewBadge } from "./badge-service";
