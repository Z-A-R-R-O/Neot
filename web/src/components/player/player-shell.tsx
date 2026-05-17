"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLessonStore } from "@/stores/lessonStore";
import { useUpdateProgress } from "@/hooks/useLessonProgress";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { PlayerHeader } from "@/components/player/player-header";
import { NavigationButtons } from "@/components/player/navigation-buttons";
import { XpPopup } from "@/components/gamification/xp-popup";
import { AchievementPopup } from "@/components/gamification/achievement-popup";

interface LessonBlock {
  id: string;
  type: string;
  [key: string]: unknown;
}

interface LessonData {
  id: string;
  title: string;
  estimatedMinutes: number | null;
  module: {
    id: string;
    courseId: string;
    course: { title: string };
  };
}

interface LessonLink {
  id: string;
  title: string;
  sortOrder: number;
}

interface PlayerShellProps {
  lesson: LessonData;
  blocks: LessonBlock[];
  allLessons: LessonLink[];
  currentLessonIndex: number;
  userId: string;
}

export function LessonPlayer({
  lesson,
  blocks,
  allLessons,
  currentLessonIndex,
}: PlayerShellProps) {
  const router = useRouter();
  const [xpPopup, setXpPopup] = useState<{ amount: number; courseCompleted?: boolean } | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<{ name: string; description: string; xpReward: number }[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<{ name: string; description: string; xpReward: number } | null>(null);

  const {
    currentBlockIndex,
    setCurrentBlock,
    setTotalBlocks,
    markBlockComplete,
    isCompleted,
    markCompleted,
    reset,
  } = useLessonStore();

  const { mutateAsync: saveProgress } = useUpdateProgress(lesson.id);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeSpentRef = useRef(0);

  useEffect(() => {
    queueMicrotask(() => {
      reset();
      setTotalBlocks(blocks.length);
    });

    progressIntervalRef.current = setInterval(() => {
      timeSpentRef.current += 30;
      saveProgress({ timeSpent: timeSpentRef.current });
    }, 30000);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [lesson.id, blocks.length, reset, setTotalBlocks, saveProgress]);

  const handleXpPopupComplete = useCallback(() => {
    setXpPopup(null);
    if (achievementQueue.length > 0) {
      setCurrentAchievement(achievementQueue[0]);
    }
  }, [achievementQueue]);

  const handleAchievementComplete = useCallback(() => {
    setAchievementQueue((prev) => {
      const [_, ...rest] = prev;
      if (rest.length > 0) {
        setCurrentAchievement(rest[0]);
      } else {
        setCurrentAchievement(null);
      }
      return rest;
    });
  }, []);

  const handleComplete = useCallback(async () => {
    markCompleted();
    const result = await saveProgress({
      status: "completed",
      timeSpent: timeSpentRef.current,
    });
    if (result.xpAwarded > 0) {
      setXpPopup({ amount: result.xpAwarded, courseCompleted: result.courseCompleted });
    }
    const achievements = result.newAchievements;
    if (achievements && achievements.length > 0) {
      setAchievementQueue(achievements);
    }
    if (result.courseCompleted) {
      setTimeout(() => router.push(`/courses/${lesson.module.courseId}/certificate`), 3000);
    }
  }, [markCompleted, saveProgress]);

  if (blocks.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground">No content in this lesson yet.</p>
      </div>
    );
  }

  const currentBlock = blocks[currentBlockIndex];
  const isLastBlock = currentBlockIndex === blocks.length - 1;

  return (
    <div className="flex flex-1 flex-col">
      {xpPopup && (
        <XpPopup
          xp={xpPopup.amount}
          reason={xpPopup.courseCompleted ? "Course completed! 🎉" : "Lesson completed"}
          onComplete={handleXpPopupComplete}
        />
      )}
      {currentAchievement && (
        <AchievementPopup
          name={currentAchievement.name}
          description={currentAchievement.description}
          xpReward={currentAchievement.xpReward}
          onComplete={handleAchievementComplete}
        />
      )}

      <PlayerHeader
        title={lesson.title}
        estimatedMinutes={lesson.estimatedMinutes}
        currentBlock={currentBlockIndex + 1}
        totalBlocks={blocks.length}
        isCompleted={isCompleted}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl">
          <BlockRenderer block={currentBlock} lessonId={lesson.id} />

          <NavigationButtons
            currentIndex={currentBlockIndex}
            allLessons={allLessons}
            currentLessonIndex={currentLessonIndex}
            isLastBlock={isLastBlock}
            isCompleted={isCompleted}
            onPrevious={() => setCurrentBlock(currentBlockIndex - 1)}
            onNext={async () => {
              markBlockComplete(currentBlockIndex);
              if (isLastBlock) {
                await handleComplete();
              } else {
                setCurrentBlock(currentBlockIndex + 1);
              }
            }}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
}
