"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function InvisibleContinuity() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 0.15, 0.15, 0]);
  const gradientPos = useTransform(scrollYProgress, [0, 0.5, 1], [0, 50, 100]);

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-40 h-full w-full">
      {/* Persistent energy line on the left edge */}
      <div className="absolute left-8 top-0 h-full w-px hidden lg:block">
        <motion.div
          className="h-full w-full"
          style={{ opacity: pathOpacity }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 1 1000">
            <defs>
              <linearGradient id="continuity-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
                <stop offset="15%" stopColor="var(--color-primary)" stopOpacity="0.08" />
                <stop offset="35%" stopColor="var(--color-accent)" stopOpacity="0.06" />
                <stop offset="55%" stopColor="var(--color-primary)" stopOpacity="0.08" />
                <stop offset="75%" stopColor="var(--color-accent)" stopOpacity="0.06" />
                <stop offset="90%" stopColor="var(--color-primary)" stopOpacity="0.04" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.line
              x1="0.5" y1="0" x2="0.5" y2="1000"
              stroke="url(#continuity-grad)"
              strokeWidth="0.5"
              style={{ pathLength }}
            />
          </svg>

          {/* Pulse dot traveling the line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary-400/40 shadow-[0_0_6px_rgba(79,124,255,0.3)]"
            style={{ top: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
          />
        </motion.div>
      </div>

      {/* Subtle bottom-right energy marker */}
      <div className="absolute bottom-12 right-8 hidden lg:block">
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.8, 1], [0, 0.3]) }}
          className="flex items-center gap-2"
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary-400/20" />
          <span className="text-[8px] font-mono text-primary-400/20 tracking-widest uppercase">
            {">"}_AI.continuous
          </span>
        </motion.div>
      </div>
    </div>
  );
}
