"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface AdSlotProps {
  page: string;
  location: string;
  className?: string;
  children?: React.ReactNode;
}

export function AdSlot({ page, location, className, children }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hasBlocker, setHasBlocker] = useState(false);

  const { data: config } = useQuery({
    queryKey: ["ads", "config", page, location],
    queryFn: async () => {
      const res = await fetch(`/api/ads/config?page=${page}&location=${location}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible && config?.enabled) {
      fetch("/api/ads/impression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, location: config.slotName }),
      }).catch(() => {});
    }
  }, [visible, config]);

  if (!config?.enabled && !children) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] p-4",
        className,
      )}
    >
      {children ?? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <div className="h-8 w-32 animate-pulse rounded bg-[rgba(255,255,255,0.04)]" />
          <span className="text-[10px] text-muted-foreground/40">Advertisement</span>
        </div>
      )}
    </div>
  );
}
