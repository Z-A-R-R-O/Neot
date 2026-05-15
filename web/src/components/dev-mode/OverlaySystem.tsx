"use client";

import { type ReactNode } from "react";
import { BlockOverlay } from "./BlockOverlay";

interface OverlaySystemProps {
  children: ReactNode;
}

export function OverlaySystem({ children }: OverlaySystemProps) {
  return <>{children}</>;
}

export { BlockOverlay };
