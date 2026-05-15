"use client";

import { type ReactNode } from "react";

import { QueryProvider } from "@/lib/providers";

export function Providers({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
