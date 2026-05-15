"use client";

"use client";

import dynamic from "next/dynamic";

import { TextBlock } from "@/components/blocks/text-block";
import { VideoBlock } from "@/components/blocks/video-block";

const QuizBlock = dynamic(() =>
  import("@/components/blocks/quiz-block").then((m) => ({ default: m.QuizBlock })),
);

interface BlockData {
  id: string;
  type: string;
  lessonId?: string;
  [key: string]: unknown;
}

interface BlockRendererProps {
  block: BlockData;
  lessonId?: string;
}

export function BlockRenderer({ block, lessonId }: BlockRendererProps) {
  if (!block) {
    return <p className="text-gray-400">No block to display.</p>;
  }

  switch (block.type) {
    case "text":
      return <TextBlock content={block.content as Record<string, unknown>} />;
    case "video":
      return <VideoBlock content={block.content as Record<string, unknown>} />;
    case "quiz":
      return (
        <QuizBlock
          content={block.content as Record<string, unknown>}
          lessonId={lessonId ?? block.lessonId ?? ""}
          blockId={block.id}
        />
      );
    default:
      return (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-400">
          Unknown block type: <code className="text-sm">{block.type}</code>
        </div>
      );
  }
}
