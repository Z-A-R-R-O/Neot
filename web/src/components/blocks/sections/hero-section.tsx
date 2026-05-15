"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface HeroSectionProps {
  content: Record<string, unknown>;
}

export function HeroSection({ content }: HeroSectionProps) {
  const title = (content.title as string) || "Learn Anything. Built for the Future.";
  const subtitle =
    (content.subtitle as string) ||
    "Learning should adapt to humans. Humans should not adapt to systems.";
  const ctaText = (content.ctaText as string) || "Start Learning";
  const secondaryCtaText = (content.secondaryCtaText as string) || "Explore Courses";

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden px-6 pt-24">
      <div className="aurora pointer-events-none absolute inset-0" />

      <div className="noise pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,124,255,0.08)_0%,transparent_60%)]" />

      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/5 blur-[120px]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex max-w-2xl flex-col items-center gap-8 text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(79,124,255,0.2)] bg-primary-500/10 px-4 py-1.5 text-xs font-medium text-primary-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Adaptive Learning Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-hero font-heading leading-[1.05] tracking-tight sm:text-hero-xl"
          >
            <span className="text-foreground">{title.split(".")[0]}.</span>
            <br />
            <span className="gradient-text-accent">{title.split(".")[1] || "Built for the Future."}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow-sm transition-all duration-300 hover:shadow-glow"
            >
              <span className="relative z-10">{ctaText}</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary-400 to-primary-500 transition-transform duration-500 group-hover:translate-x-0" />
            </Link>
            <Link
              href="/courses"
              className="glass glass-hover rounded-xl px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:text-primary-400"
            >
              {secondaryCtaText}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative flex-shrink-0"
        >
          <div className="relative h-[320px] w-[320px] sm:h-[400px] sm:w-[400px] lg:h-[480px] lg:w-[480px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/20 via-secondary-500/10 to-accent-500/10 blur-3xl animate-aurora-drift" />

            <div className="absolute inset-x-8 top-8 bottom-8 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] backdrop-blur-2xl shadow-glass">
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/20 ring-1 ring-primary-500/30">
                  <Sparkles className="h-8 w-8 text-primary-400" />
                </div>
                <p className="text-lg font-semibold text-foreground">AI-Powered Learning</p>
                <p className="text-sm text-muted-foreground">
                  Lessons that adapt to your pace and style
                </p>
              </div>
            </div>

            <div className="absolute -left-4 top-12 h-24 w-24 animate-float-slow rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl" />
            <div className="absolute -bottom-4 right-8 h-20 w-20 animate-float rounded-2xl border border-[rgba(61,217,255,0.1)] bg-accent-500/5 backdrop-blur-xl" />
            <div className="absolute -right-6 top-1/3 h-16 w-16 animate-float-slow rounded-xl border border-[rgba(124,92,255,0.1)] bg-secondary-500/5 backdrop-blur-xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
