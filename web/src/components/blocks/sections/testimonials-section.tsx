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
    <section className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,124,255,0.04)_0%,transparent_60%)]" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
          }}
          className="mb-14 text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-400">
            Testimonials
          </p>
          <h2 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="gradient-text">Loved by learners</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      className="glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-glow-sm sm:p-8"
    >
      <div className="relative z-10 flex h-full flex-col gap-5">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="h-4 w-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {item.text || "Great platform for learning!"}
        </p>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 text-xs font-semibold text-primary-400 ring-1 ring-primary-500/20">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{item.name || "User"}</p>
            {item.role && (
              <p className="text-xs text-muted-foreground">{item.role}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
