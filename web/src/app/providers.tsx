"use client";

import { type ReactNode } from "react";

import { QueryProvider } from "@/lib/providers";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { GlobalErrorCatcher } from "@/components/error-tracking/global-error-catcher";

import "@/lib/registrations";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <GlobalErrorCatcher />
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}
