import { forwardRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, fallback, size = "md", className }, ref) => {
    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden rounded-full",
          sizeMap[size],
          className,
        )}
      >
        <AvatarPrimitive.Image
          src={src}
          alt={alt ?? ""}
          className="aspect-square h-full w-full object-cover"
        />
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600"
          delayMs={600}
        >
          {fallback ?? "?"}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
  },
);

Avatar.displayName = "Avatar";
