"use client";

import { motion } from "framer-motion";

interface FeatureCard {
  title?: string;
  description?: string;
  icon?: string;
}

const iconMap: Record<string, string> = {
  brain: "🧠",
  rocket: "🚀",
  target: "🎯",
  star: "⭐",
  lightning: "⚡",
  shield: "🛡️",
  book: "📚",
  chart: "📈",
  globe: "🌍",
  puzzle: "🧩",
};

export function FeatureGridSection({ content }: { content: Record<string, unknown> }) {
  const cards = (content.cards as FeatureCard[]) ?? [];

  if (!cards.length) {
    return (
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-muted-foreground">No feature cards added yet</p>
        </div>
      </section>
    );
  }

  const [primary, ...rest] = cards;
  const leftCol = rest.filter((_, i) => i % 2 === 0);
  const rightCol = rest.filter((_, i) => i % 2 !== 0);

  return (
    <section id="features" className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,124,255,0.05)_0%,transparent_60%)]" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
          }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-400">
            Features
          </p>
          <h2 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="gradient-text">Everything you need to learn</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {primary && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] } },
              }}
              className="glass-card group relative overflow-hidden p-8 transition-all duration-500 hover:shadow-glow sm:p-10 lg:col-span-2 lg:row-span-2"
            >
              <div className="glow-border" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10 ring-1 ring-primary-500/20 transition-all duration-300 group-hover:bg-primary-500/20 group-hover:ring-primary-500/40">
                  <span className="text-2xl">{iconMap[primary.icon ?? ""] || "✨"}</span>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">
                    {primary.title || "Feature"}
                  </h3>
                  <p className="max-w-md leading-relaxed text-muted-foreground">
                    {primary.description || ""}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col gap-6">
            {leftCol.map((card, i) => (
              <FeatureCard key={`left-${i}`} card={card} index={i} />
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {rightCol.map((card, i) => (
              <FeatureCard key={`right-${i}`} card={card} index={i + (leftCol?.length || 0)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ card, index }: { card: FeatureCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: 0.1 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      className="glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-glow-sm"
    >
      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-500/10 ring-1 ring-primary-500/20 transition-all duration-300 group-hover:bg-primary-500/20 group-hover:ring-primary-500/40">
          <span className="text-lg">{iconMap[card.icon ?? ""] || "✨"}</span>
        </div>
        <div>
          <h3 className="mb-1.5 font-semibold text-foreground">
            {card.title || "Feature"}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {card.description || ""}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
