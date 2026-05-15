"use client";

import { motion } from "framer-motion";
import { InlineEditor } from "@/components/dev-mode/InlineEditor";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";

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

export function FeatureGridSection({ content, blockId }: { content: Record<string, unknown>; blockId?: string }) {
  const updateSection = usePageBuilderStore((s) => s.updateSection);
  const cards = (content.cards as FeatureCard[]) ?? [];

  const handleCardUpdate = (index: number, key: string, value: string) => {
    if (!blockId) return;
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [key]: value };
    updateSection(blockId, { content: { ...content, cards: newCards } });
  };

  if (!cards.length) {
    return (
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-muted-foreground">No feature cards added yet</p>
        </div>
      </section>
    );
  }


  return (
    <section id="features" className="relative overflow-hidden px-6 py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,124,255,0.08)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(61,217,255,0.05)_0%,transparent_60%)]" />

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
          <h2 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
            Everything you need to learn
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:grid-rows-2 gap-6">
          {cards[0] && (
            <BentoCard
              card={cards[0]}
              className="lg:col-span-3 lg:row-span-2"
              index={0}
              onUpdate={(key, val) => handleCardUpdate(0, key, val)}
              large
            />
          )}
          {cards[1] && (
            <BentoCard
              card={cards[1]}
              className="lg:col-span-3 lg:row-span-1"
              index={1}
              onUpdate={(key, val) => handleCardUpdate(1, key, val)}
            />
          )}
          {cards[2] && (
            <BentoCard
              card={cards[2]}
              className="lg:col-span-2 lg:row-span-1"
              index={2}
              onUpdate={(key, val) => handleCardUpdate(2, key, val)}
            />
          )}
          {cards[3] && (
            <BentoCard
              card={cards[3]}
              className="lg:col-span-1 lg:row-span-1"
              index={3}
              onUpdate={(key, val) => handleCardUpdate(3, key, val)}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  card,
  className,
  index,
  onUpdate,
  large = false,
}: {
  card: FeatureCard;
  className?: string;
  index: number;
  onUpdate: (key: string, val: string) => void;
  large?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className={`glass group relative overflow-hidden rounded-[40px] p-10 shadow-2xl transition-shadow hover:shadow-primary-500/5 ${className}`}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/5 blur-[80px] transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex flex-col gap-6">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-2xl transition-all duration-300 group-hover:bg-primary-500/10 group-hover:border-primary-500/20"
          >
            <span className="text-2xl">{iconMap[card.icon ?? ""] || "✨"}</span>
          </motion.div>
          <div>
            <h3 className={`${large ? "text-3xl" : "text-xl"} font-bold text-foreground mb-3`}>
              <InlineEditor
                value={card.title || "Feature"}
                onChange={(v) => onUpdate("title", v)}
              />
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              <InlineEditor
                value={card.description || ""}
                onChange={(v) => onUpdate("description", v)}
                multiline
              />
            </p>
          </div>
        </div>
        
        {large && (
          <div className="mt-12 h-40 w-full rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
            <div className="flex h-full items-center justify-center">
              <div className="h-20 w-40 rounded-full bg-primary-500/20 blur-3xl" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
