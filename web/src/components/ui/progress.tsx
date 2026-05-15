"use client";

import { forwardRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

type ProgressVariant = "default" | "success" | "warning";

interface ProgressProps {
  value?: number;
  variant?: ProgressVariant;
  className?: string;
}

const indicatorStyles: Record<ProgressVariant, string> = {
  default: "bg-primary-600",
  success: "bg-green-500",
  warning: "bg-amber-500",
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, variant = "default", className }, ref) => {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={value}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
          className,
        )}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 rounded-full transition-all duration-300",
            indicatorStyles[variant],
          )}
          style={{ transform: `translateX(-${100 - Math.min(value, 100)}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  },
);

Progress.displayName = "Progress";
