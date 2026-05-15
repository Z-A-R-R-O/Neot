"use client";

import { useEffect } from "react";
import { useTheme } from "@/lib/theme/useTheme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { cssVars, isLoading } = useTheme();

  useEffect(() => {
    if (isLoading) return;
    const root = document.documentElement;
    for (const [key, value] of Object.entries(cssVars)) {
      root.style.setProperty(key, value);
    }

    return () => {
      for (const key of Object.keys(cssVars)) {
        root.style.removeProperty(key);
      }
    };
  }, [cssVars, isLoading]);

  return <>{children}</>;
}
