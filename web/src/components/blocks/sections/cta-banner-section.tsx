"use client";

import { ArrowRight } from "lucide-react";
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,124,255,0.05)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="glass-thick relative mx-auto max-w-5xl overflow-hidden rounded-[48px] p-12 text-center sm:p-24 shadow-2xl"
      >
        <div className="noise absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-500/10 blur-[100px]" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-accent-500/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center gap-10">
          <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-6xl max-w-2xl leading-[1.1]">
            {devModeEnabled ? (
              <InlineEditor
                value={text}
                onChange={(v) => handleUpdate("text", v)}
                multiline
              />
            ) : text}
          </h2>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <Link
              href={buttonLink}
              className="group relative inline-flex h-16 items-center gap-3 overflow-hidden rounded-2xl bg-foreground px-10 text-lg font-bold text-background transition-all shadow-2xl"
            >
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
