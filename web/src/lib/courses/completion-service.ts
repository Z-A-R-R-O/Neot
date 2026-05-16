import { prisma } from "@/lib/db";
import { XP_REWARDS, getLevelInfo } from "@/lib/gamification/xp-calculator";

export async function awardCourseCompletion(userId: string, courseId: string) {
  return await prisma.$transaction(async (tx) => {
    const alreadyAwarded = await tx.xPTransaction.findFirst({
      where: { userId, reason: "course_completed", referenceId: courseId },
    });

    if (alreadyAwarded) return { xpAwarded: 0, alreadyCompleted: true };

    await tx.xPTransaction.create({
      data: {
        userId,
        amount: XP_REWARDS.LESSON_COMPLETE * 2,
        reason: "course_completed",
        referenceId: courseId,
      },
    });

    const profile = await tx.profile.findUnique({ where: { id: userId } });
    const newXp = (profile?.xp ?? 0) + XP_REWARDS.LESSON_COMPLETE * 2;
    const levelInfo = getLevelInfo(newXp);

    await tx.profile.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: levelInfo.level,
      },
    });

    return { xpAwarded: XP_REWARDS.LESSON_COMPLETE * 2, alreadyCompleted: false };
  });
}
