"use client";

import { blockRegistry } from "@/lib/block-registry";

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

  const Component = blockRegistry.getComponent(block.type);

  if (!Component) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-400">
        Unknown block type: <code className="text-sm">{block.type}</code>
      </div>
    );
  }

  return (
    <Component
      content={block.content as Record<string, unknown>}
      lessonId={lessonId ?? block.lessonId ?? ""}
      blockId={block.id}
    />
  );
}
