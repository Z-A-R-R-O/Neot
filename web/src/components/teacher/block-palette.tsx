"use client";

import { Type, Video, HelpCircle, Image, Code, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface BlockPaletteProps {
  onAddBlock: (blockType: string) => void;
}

const blockTypes = [
  { type: "text", label: "Text", icon: Type },
  { type: "video", label: "Video", icon: Video },
  { type: "quiz", label: "Quiz", icon: HelpCircle },
  { type: "image", label: "Image", icon: Image },
  { type: "code", label: "Code", icon: Code },
  { type: "divider", label: "Divider", icon: Minus },
];

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  return (
    <Card padding="sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Add Block</h3>
      <div className="grid grid-cols-2 gap-2">
        {blockTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onAddBlock(type)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border border-gray-200 p-3 transition-colors hover:border-primary-300 hover:bg-primary-50",
            )}
          >
            <Icon className="h-5 w-5 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">{label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
