"use client";

import { useEffect, useCallback, useRef } from "react";
import { useLessonStore } from "@/stores/lessonStore";
import { useUpdateProgress } from "@/hooks/useLessonProgress";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { PlayerHeader } from "@/components/player/player-header";
import { NavigationButtons } from "@/components/player/navigation-buttons";

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
  const {
    currentBlockIndex,
    setCurrentBlock,
    setTotalBlocks,
    markBlockComplete,
    isCompleted,
    markCompleted,
    reset,
  } = useLessonStore();

  const { mutate: saveProgress } = useUpdateProgress(lesson.id);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeSpentRef = useRef(0);

  useEffect(() => {
    reset();
    setTotalBlocks(blocks.length);

    progressIntervalRef.current = setInterval(() => {
      timeSpentRef.current += 30;
      saveProgress({ timeSpent: timeSpentRef.current });
    }, 30000);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [lesson.id, blocks.length, reset, setTotalBlocks, saveProgress]);

  const handleComplete = useCallback(() => {
    markCompleted();
    saveProgress({
      status: "completed",
      timeSpent: timeSpentRef.current,
    });
  }, [markCompleted, saveProgress]);

  if (blocks.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-gray-500">No content in this lesson yet.</p>
      </div>
    );
  }

  const currentBlock = blocks[currentBlockIndex];
  const isLastBlock = currentBlockIndex === blocks.length - 1;

  return (
    <div className="flex flex-1 flex-col">
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
            onNext={() => {
              markBlockComplete(currentBlockIndex);
              if (isLastBlock) {
                handleComplete();
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
