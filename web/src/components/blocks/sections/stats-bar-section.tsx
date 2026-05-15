"use client";

import { motion } from "framer-motion";

interface StatItem {
  number?: string;
  label?: string;
  prefix?: string;
  suffix?: string;
}

export function StatsBarSection({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as StatItem[]) ?? [];

  if (!items.length) {
    return (
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-muted-foreground">No stats added yet</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden px-6 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,124,255,0.05)_0%,transparent_60%)]" />

      <div className="mx-auto max-w-6xl">
        <div className="glass-card relative overflow-hidden border-dashed">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(79,124,255,0.08)_0%,transparent_60%)]" />

          <div className="relative z-10 grid divide-y divide-[rgba(255,255,255,0.06)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] },
                  },
                }}
                className="flex flex-col items-center gap-2 px-8 py-10 text-center"
              >
                <span className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  <span className="gradient-text-accent">
                    {item.prefix || ""}{item.number || "0"}{item.suffix || ""}
                  </span>
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.label || "Stat"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
