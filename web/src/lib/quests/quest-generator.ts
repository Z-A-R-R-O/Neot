import { prisma } from "@/lib/db";

const QUEST_TEMPLATES = [
  {
    type: "complete_lessons",
    title: "Lesson Master",
    description: "Complete {target} lessons today",
    xpReward: 50,
    icon: "book",
    color: "#3b82f6",
  },
  {
    type: "quiz_perfect",
    title: "Perfect Score",
    description: "Get 100% on a quiz",
    xpReward: 75,
    icon: "target",
    color: "#10b981",
  },
  {
    type: "streak_maintain",
    title: "Streak Keeper",
    description: "Log in and complete a lesson to maintain your streak",
    xpReward: 30,
    icon: "flame",
    color: "#f59e0b",
  },
  {
    type: "xp_earn",
    title: "XP Hunter",
    description: "Earn {target} XP today",
    xpReward: 60,
    icon: "zap",
    color: "#8b5cf6",
  },
  {
    type: "challenge_complete",
    title: "Challenge Accepted",
    description: "Complete a coding challenge",
    xpReward: 100,
    icon: "code",
    color: "#ef4444",
  },
  {
    type: "review_session",
    title: "Review Master",
    description: "Complete {target} review sessions",
    xpReward: 40,
    icon: "refresh",
    color: "#06b6d4",
  },
  {
    type: "world_progress",
    title: "World Explorer",
    description: "Make progress in any learning world",
    xpReward: 45,
    icon: "globe",
    color: "#ec4899",
  },
  {
    type: "island_complete",
    title: "Island Conqueror",
    description: "Complete an island",
    xpReward: 120,
    icon: "trophy",
    color: "#f59e0b",
  },
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function buildConditions(type: string, streak: number): Record<string, unknown> {
  const base: Record<string, unknown> = {};

  switch (type) {
    case "complete_lessons":
      base.target = streak > 7 ? 5 : streak > 3 ? 3 : 2;
      break;
    case "xp_earn":
      base.target = streak > 7 ? 300 : streak > 3 ? 200 : 100;
      break;
    case "review_session":
      base.target = streak > 7 ? 5 : 3;
      break;
  }

  return base;
}

export async function assignDailyQuests(userId: string): Promise<number> {
  const existing = await prisma.studentQuest.findFirst({
    where: { userId, status: "active" },
  });
  if (existing) return 0;

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { currentStreak: true },
  });

  const streak = profile?.currentStreak ?? 0;
  const templates = streak > 7
    ? pickRandom(QUEST_TEMPLATES, 3)
    : streak > 3
      ? pickRandom(QUEST_TEMPLATES.filter((t) => t.type !== "island_complete"), 3)
      : pickRandom(QUEST_TEMPLATES.filter((t) => t.type !== "island_complete" && t.type !== "challenge_complete"), 3);

  for (const template of templates) {
    const quest = await prisma.quest.create({
      data: {
        type: template.type,
        title: template.title,
        description: template.description,
        xpReward: Math.round(template.xpReward * (1 + streak * 0.05)),
        conditions: JSON.stringify(buildConditions(template.type, streak)),
        icon: template.icon,
        color: template.color,
      },
    });

    const conditions = buildConditions(template.type, streak);
    await prisma.studentQuest.create({
      data: {
        userId,
        questId: quest.id,
        target: (conditions.target as number) ?? 1,
      },
    });
  }

  return 3;
}

export async function getDailyQuests(userId: string) {
  const quests = await prisma.studentQuest.findMany({
    where: { userId, status: { in: ["active", "completed"] } },
    include: { quest: true },
    orderBy: { assignedAt: "desc" },
    take: 5,
  });

  return quests;
}

export async function claimQuestReward(userId: string, studentQuestId: string) {
  const sq = await prisma.studentQuest.findUnique({
    where: { id: studentQuestId },
    include: { quest: true },
  });

  if (!sq || sq.userId !== userId) {
    throw new Error("Quest not found");
  }

  if (sq.status !== "completed") {
    throw new Error("Quest not completed yet");
  }

  if (sq.claimedAt) {
    throw new Error("Quest already claimed");
  }

  await prisma.$transaction([
    prisma.studentQuest.update({
      where: { id: studentQuestId },
      data: { status: "claimed", claimedAt: new Date() },
    }),
    prisma.xPTransaction.create({
      data: {
        userId,
        amount: sq.quest.xpReward,
        reason: `Quest: ${sq.quest.title}`,
      },
    }),
    prisma.profile.update({
      where: { id: userId },
      data: { xp: { increment: sq.quest.xpReward } },
    }),
  ]);

  return { xpAwarded: sq.quest.xpReward };
}

export async function updateQuestProgress(userId: string, type: string, amount = 1) {
  const active = await prisma.studentQuest.findFirst({
    where: { userId, status: "active", quest: { type } },
    include: { quest: true },
  });

  if (!active) return null;

  const newProgress = Math.min(active.progress + amount, active.target);
  const newStatus = newProgress >= active.target ? "completed" : "active";

  return prisma.studentQuest.update({
    where: { id: active.id },
    data: { progress: newProgress, status: newStatus, completedAt: newStatus === "completed" ? new Date() : undefined },
    include: { quest: true },
  });
}
