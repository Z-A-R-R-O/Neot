"use client";

import { motion } from "framer-motion";

interface TestimonialItem {
  name?: string;
  role?: string;
  text?: string;
  avatar?: string;
}

export function TestimonialsSection({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as TestimonialItem[]) ?? [];

  if (!items.length) {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-muted-foreground">No testimonials added yet</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden px-6 py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(79,124,255,0.05)_0%,transparent_70%)]" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-400">
            Social Proof
          </p>
          <h2 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
            Loved by elite learners
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <TestimonialCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item, index }: { item: TestimonialItem; index: number }) {
  const initials = (item.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass group relative overflow-hidden rounded-[32px] p-8 shadow-xl transition-all duration-300"
    >
      <div className="noise absolute inset-0 opacity-10" />
      <div className="relative z-10 flex h-full flex-col gap-6">
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary-500/60" />
          ))}
        </div>

        <p className="flex-1 text-base leading-relaxed text-foreground/80 font-medium italic">
          &quot;{item.text || "Great platform for learning!"}&quot;
        </p>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10 text-sm font-bold text-primary-400 border border-primary-500/20 shadow-glow-sm">
            {initials}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{item.name || "User"}</p>
            {item.role && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.role}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
