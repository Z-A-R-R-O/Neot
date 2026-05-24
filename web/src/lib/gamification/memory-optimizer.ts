import { prisma } from "@/lib/db";

export interface ReviewItem {
  id: string;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  skillId: string;
  skillName: string;
  masteryScore: number;
  daysSinceLastReview: number;
  nextReviewDate: string;
  urgency: "due" | "overdue" | "upcoming";
  interval: number;
  predictedRetention: number;
  reviewCount: number;
}

export interface ReviewSummary {
  total: number;
  overdue: number;
  due: number;
  upcoming: number;
  nextReview: ReviewItem | null;
  averageRetention: number;
  reviewStreak: number;
}

export interface MasteryForecast {
  skillId: string;
  skillName: string;
  currentScore: number;
  sessionsToMastery: number;
  estimatedDaysToMastery: number;
  nextMilestone: string;
  trend: "improving" | "declining" | "stable";
}

const BASE_INTERVALS = [1, 3, 7, 14, 30, 60, 90];

function getBaseInterval(masteryScore: number): number {
  if (masteryScore >= 0.95) return BASE_INTERVALS[6];
  if (masteryScore >= 0.9) return BASE_INTERVALS[5];
  if (masteryScore >= 0.8) return BASE_INTERVALS[4];
  if (masteryScore >= 0.7) return BASE_INTERVALS[3];
  if (masteryScore >= 0.5) return BASE_INTERVALS[2];
  if (masteryScore >= 0.3) return BASE_INTERVALS[1];
  return BASE_INTERVALS[0];
}

function getPersonalizedInterval(
  masteryScore: number,
  reviewCount: number,
  streak: number,
  consistencyFactor: number,
): number {
  const base = getBaseInterval(masteryScore);
  let multiplier = 1;

  if (reviewCount >= 5) multiplier += 0.2;
  if (reviewCount >= 10) multiplier += 0.15;
  if (streak >= 3) multiplier += 0.1;
  if (streak >= 7) multiplier += 0.15;
  if (consistencyFactor > 0.8) multiplier += 0.2;
  if (consistencyFactor < 0.4) multiplier -= 0.2;

  return Math.round(base * Math.max(multiplier, 0.5));
}

function getConsistencyFactor(attempts: number, correct: number): number {
  if (attempts === 0) return 0.5;
  return correct / attempts;
}

function predictRetention(
  masteryScore: number,
  daysSinceReview: number,
  interval: number,
): number {
  const decayRate = 1 - masteryScore * 0.6;
  const retention = masteryScore * Math.exp(-decayRate * (daysSinceReview / interval));
  return Math.max(0, Math.min(1, retention));
}

function getUrgency(daysSinceReview: number, interval: number): ReviewItem["urgency"] {
  if (daysSinceReview > interval) return "overdue";
  if (daysSinceReview >= interval - 2) return "due";
  return "upcoming";
}

export async function getReviewQueue(
  userId: string,
  limit = 20,
): Promise<ReviewItem[]> {
  const masteryRecords = await prisma.skillMastery.findMany({
    where: { userId, attempts: { gt: 0 } },
    include: { skill: true },
  });

  if (masteryRecords.length === 0) return [];

  const completedLessons = await prisma.lessonProgress.findMany({
    where: { userId, status: "completed" },
    include: {
      lesson: {
        include: {
          module: { select: { courseId: true, course: { select: { title: true } } } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const lessonSkillMap = await prisma.lessonSkill.findMany({
    select: { lessonId: true, skillId: true, weight: true },
  });

  const lessonToSkills = new Map<string, { skillId: string; weight: number }[]>();
  for (const ls of lessonSkillMap) {
    const existing = lessonToSkills.get(ls.lessonId) ?? [];
    existing.push({ skillId: ls.skillId, weight: ls.weight });
    lessonToSkills.set(ls.lessonId, existing);
  }

  const seen = new Set<string>();
  const reviews: ReviewItem[] = [];

  for (const lesson of completedLessons) {
    const skills = lessonToSkills.get(lesson.lessonId) ?? [];
    for (const skillLink of skills) {
      const key = `${lesson.lessonId}-${skillLink.skillId}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const mastery = masteryRecords.find((m) => m.skillId === skillLink.skillId);
      if (!mastery) continue;

      const lastReview = mastery.lastAttempt ?? lesson.updatedAt;
      const daysSinceReview = Math.floor((Date.now() - lastReview.getTime()) / (1000 * 60 * 60 * 24));
      const consistency = getConsistencyFactor(mastery.attempts, mastery.correct);
      const interval = getPersonalizedInterval(mastery.score, mastery.attempts, mastery.streak, consistency);
      const predictedRetention = predictRetention(mastery.score, daysSinceReview, interval);
      const nextReviewDate = new Date(lastReview.getTime() + interval * 24 * 60 * 60 * 1000);
      const urgency = getUrgency(daysSinceReview, interval);

      if (predictedRetention < 0.7 || urgency !== "upcoming") {
        reviews.push({
          id: key,
          lessonId: lesson.lessonId,
          lessonTitle: lesson.lesson.title,
          courseId: lesson.lesson.module.courseId,
          courseTitle: lesson.lesson.module.course.title,
          skillId: mastery.skillId,
          skillName: mastery.skill.name,
          masteryScore: Math.round(mastery.score * 100),
          daysSinceLastReview: daysSinceReview,
          nextReviewDate: nextReviewDate.toISOString(),
          urgency,
          interval,
          predictedRetention: Math.round(predictedRetention * 100),
          reviewCount: mastery.attempts,
        });
      }
    }
  }

  reviews.sort((a, b) => {
    const order = { overdue: 0, due: 1, upcoming: 2 };
    if (order[a.urgency] !== order[b.urgency]) return order[a.urgency] - order[b.urgency];
    return a.predictedRetention - b.predictedRetention;
  });

  return reviews.slice(0, limit);
}

export async function getReviewSummary(userId: string): Promise<ReviewSummary> {
  const reviews = await getReviewQueue(userId, 100);

  const overdue = reviews.filter((r) => r.urgency === "overdue").length;
  const due = reviews.filter((r) => r.urgency === "due").length;
  const upcoming = reviews.filter((r) => r.urgency === "upcoming").length;
  const avgRetention = reviews.length > 0
    ? Math.round(reviews.reduce((s, r) => s + r.predictedRetention, 0) / reviews.length)
    : 0;

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { currentStreak: true },
  });

  return {
    total: reviews.length,
    overdue,
    due,
    upcoming,
    nextReview: reviews[0] ?? null,
    averageRetention: avgRetention,
    reviewStreak: profile?.currentStreak ?? 0,
  };
}

export async function getMasteryForecast(userId: string): Promise<MasteryForecast[]> {
  const masteryRecords = await prisma.skillMastery.findMany({
    where: { userId, attempts: { gt: 0 } },
    include: { skill: true },
    orderBy: { score: "asc" },
    take: 10,
  });

  return masteryRecords.map((m) => {
    const sessionsToMastery = m.score >= 0.9
      ? 0
      : Math.ceil((1 - m.score) / (m.score / Math.max(m.attempts, 1)));

    const daysPerSession = m.attempts > 1 && m.lastAttempt
      ? (Date.now() - m.lastAttempt.getTime()) / (1000 * 60 * 60 * 24) / m.attempts
      : 3;

    const estimatedDays = Math.round(sessionsToMastery * Math.max(daysPerSession, 1));

    const milestone = m.score >= 0.9 ? "Mastered" :
      m.score >= 0.8 ? "Expert" :
      m.score >= 0.6 ? "Proficient" :
      m.score >= 0.4 ? "Developing" : "Beginner";

    const nextMilestone = m.score >= 0.8 ? "Mastery (90%)" :
      m.score >= 0.6 ? "Expert (80%)" :
      m.score >= 0.4 ? "Proficient (60%)" : "Developing (40%)";

    const trend: MasteryForecast["trend"] =
      m.streak >= 3 ? "improving" :
      m.streak <= -2 ? "declining" : "stable";

    return {
      skillId: m.skillId,
      skillName: m.skill.name,
      currentScore: Math.round(m.score * 100),
      sessionsToMastery,
      estimatedDaysToMastery: estimatedDays,
      nextMilestone,
      trend,
    };
  });
}

export async function logReview(
  userId: string,
  lessonId: string,
  score: number,
): Promise<void> {
  const lessonSkills = await prisma.lessonSkill.findMany({
    where: { lessonId },
    select: { skillId: true, weight: true },
  });

  for (const ls of lessonSkills) {
    const existing = await prisma.skillMastery.findUnique({
      where: { userId_skillId: { userId, skillId: ls.skillId } },
    });

    const newAttempts = (existing?.attempts ?? 0) + 1;
    const newCorrect = (existing?.correct ?? 0) + (score >= 0.7 ? 1 : 0);
    const newStreak = score >= 0.7 ? (existing?.streak ?? 0) + 1 : 0;

    await prisma.skillMastery.upsert({
      where: { userId_skillId: { userId, skillId: ls.skillId } },
      update: {
        attempts: newAttempts,
        correct: newCorrect,
        streak: newStreak,
        score,
        lastAttempt: new Date(),
      },
      create: {
        userId,
        skillId: ls.skillId,
        score,
        attempts: 1,
        correct: score >= 0.7 ? 1 : 0,
        streak: score >= 0.7 ? 1 : 0,
        lastAttempt: new Date(),
      },
    });
  }
}

export async function getMicroReview(userId: string): Promise<{
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  skillName: string;
  concept: string;
} | null> {
  const queue = await getReviewQueue(userId, 1);
  if (queue.length === 0) return null;

  const item = queue[0];
  return {
    lessonId: item.lessonId,
    lessonTitle: item.lessonTitle,
    courseTitle: item.courseTitle,
    skillName: item.skillName,
    concept: item.skillName,
  };
}
