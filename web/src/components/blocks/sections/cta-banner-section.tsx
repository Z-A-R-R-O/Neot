"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { InlineEditor } from "@/components/dev-mode/InlineEditor";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";

export function CtaBannerSection({ content, blockId }: { content: Record<string, unknown>; blockId?: string }) {
  const updateSection = usePageBuilderStore((s) => s.updateSection);
  const text = (content.text as string) || "Ready to transform how you learn?";
  const buttonText = (content.buttonText as string) || "Get Started Free";
  const buttonLink = (content.buttonLink as string) || "/signup";

  const handleUpdate = (key: string, val: string) => {
    if (!blockId) return;
    updateSection(blockId, { content: { ...content, [key]: val } });
  };

  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,124,255,0.08)_0%,transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
        }}
        className="glass-card relative mx-auto max-w-4xl overflow-hidden p-10 text-center sm:p-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/5" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            <InlineEditor
              value={text}
              onChange={(v) => handleUpdate("text", v)}
              multiline
            />
          </h2>

          <div className="flex flex-col items-center gap-2">
            <Link
              href={buttonLink}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-primary-500 px-7 py-3.5 text-base font-semibold text-white shadow-glow-sm transition-all duration-300 hover:shadow-glow"
            >
              <span className="relative z-10">
                <InlineEditor
                  value={buttonText}
                  onChange={(v) => handleUpdate("buttonText", v)}
                />
              </span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary-400 to-primary-500 transition-transform duration-500 group-hover:translate-x-0" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
