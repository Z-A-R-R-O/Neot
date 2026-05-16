"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { InlineEditor } from "@/components/dev-mode/InlineEditor";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";
import { useDevModeStore } from "@/stores/devModeStore";

export function CtaBannerSection({ content, blockId }: { content: Record<string, unknown>; blockId?: string }) {
  const devModeEnabled = useDevModeStore((s) => s.enabled);
  const updateSection = usePageBuilderStore((s) => s.updateSection);
  const text = (content.text as string) || "Ready to transform how you learn?";
  const buttonText = (content.buttonText as string) || "Get Started Free";
  const buttonLink = (content.buttonLink as string) || "/signup";

  const handleUpdate = (key: string, val: string) => {
    if (!blockId) return;
    updateSection(blockId, { content: { ...content, [key]: val } });
  };

  return (
    <section className="relative overflow-hidden px-6 py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-primary-200/12 dark:bg-primary-500/6 blur-[140px] animate-ambient-float" />
        <div className="absolute right-1/3 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent-200/10 dark:bg-accent-500/5 blur-[120px] animate-ambient-float" style={{ animationDelay: "-6s" }} />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-200/8 dark:bg-purple-500/4 blur-[100px] animate-ambient-float" style={{ animationDelay: "-12s" }} />
      </div>

      {/* Floating particles around CTA */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`cta-particle-${i}`}
          className="pointer-events-none absolute z-10 h-1 w-1 rounded-full bg-primary-400/30"
          animate={{
            y: [0, -40 - i * 10, 0],
            x: [0, 20 + i * 8, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.2,
          }}
          style={{
            left: `${35 + i * 12}%`,
            top: `${25 + (i % 2) * 40}%`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="glass-hero-panel relative mx-auto max-w-5xl overflow-hidden rounded-[48px] p-12 text-center sm:p-24"
        style={{ boxShadow: "var(--hero-panel-shadow)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/8 via-transparent to-accent-500/8" />
        <div className="absolute inset-0 bg-gradient-to-bl from-white/30 via-transparent to-transparent dark:from-white/5" />
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-500/10 blur-[100px] animate-ambient-float" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-accent-500/10 blur-[100px] animate-ambient-float" style={{ animationDelay: "-8s" }} />

        <div className="relative z-10 flex flex-col items-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-primary-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Start your journey
          </motion.div>

          <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-6xl max-w-3xl leading-[1.1]">
            {devModeEnabled ? (
              <InlineEditor
                value={text}
                onChange={(v) => handleUpdate("text", v)}
                multiline
              />
            ) : text}
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href={buttonLink}
              className="group relative inline-flex h-16 items-center gap-3 overflow-hidden rounded-2xl bg-foreground px-10 text-lg font-bold text-background transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(79,124,255,0.2)] shadow-2xl active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative z-10">
                {devModeEnabled ? (
                  <InlineEditor
                    value={buttonText}
                    onChange={(v) => handleUpdate("buttonText", v)}
                  />
                ) : buttonText}
              </span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
