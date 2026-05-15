"use client";

import { type ReactNode } from "react";

import { QueryProvider } from "@/lib/providers";
import { ThemeProvider } from "@/lib/theme/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  );
}
