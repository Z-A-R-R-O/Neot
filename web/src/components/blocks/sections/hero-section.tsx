"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { InlineEditor } from "@/components/dev-mode/InlineEditor";
import { useDevModeStore } from "@/stores/devModeStore";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";

interface HeroSectionProps {
  content: Record<string, unknown>;
  blockId?: string;
}

export function HeroSection({ content, blockId }: HeroSectionProps) {
  const devModeEnabled = useDevModeStore((s) => s.enabled);
  const updateSection = usePageBuilderStore((s) => s.updateSection);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const title = (content.title as string) || "Adaptive Learning. Built for Humans.";
  const subtitle =
    (content.subtitle as string) ||
    "Personalized learning experiences powered by adaptive AI that evolves with your pace.";
  const ctaText = (content.ctaText as string) || "Start Learning";
  const secondaryCtaText = (content.secondaryCtaText as string) || "Explore Courses";

  function handleContentChange(key: string, value: string) {
    if (!blockId) return;
    updateSection(blockId, { content: { ...content, [key]: value } });
  }

  function renderTitle() {
    if (!devModeEnabled) {
      const parts = title.split(".");
      return (
        <span className="flex flex-col gap-2">
          <span className="text-foreground text-tight">{parts[0]}.</span>
          <span className="gradient-text-accent text-pacing">{parts[1] || "Built for the Future."}</span>
        </span>
      );
    }

    return (
      <InlineEditor
        value={title}
        onChange={(v) => handleContentChange("title", v)}
        className="text-tight"
      />
    );
  }

  function renderSubtitle() {
    if (!devModeEnabled) {
      return <span className="text-muted-foreground/80 leading-relaxed">{subtitle}</span>;
    }

    return (
      <InlineEditor
        value={subtitle}
        onChange={(v) => handleContentChange("subtitle", v)}
        className=""
        multiline
      />
    );
  }

  return (
    <section className="noise aurora-cinematic relative flex min-h-[90vh] items-center overflow-hidden px-6 pb-20 pt-32">
      {/* Cinematic Lighting System */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Asymmetric Glows */}
        <div className="absolute -left-1/4 -top-1/4 h-[1000px] w-[1000px] rounded-full bg-secondary-500/10 blur-[180px] animate-pulse-glow" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[1000px] w-[1000px] rounded-full bg-accent-500/10 blur-[180px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-primary-400"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1.5,
              }}
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          background: `radial-gradient(circle 500px at var(--x) var(--y), rgba(79,124,255,0.1), transparent 80%)`,
          // @ts-expect-error: Framer motion custom properties
          "--x": springX,
          "--y": springY,
        }}
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-16 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        {/* Left Side: Emotional Copy */}
        <div className="z-10 flex max-w-2xl flex-col items-center gap-8 text-center lg:items-start lg:text-left lg:translate-x-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-primary-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Adaptive Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-5xl leading-[1.05] tracking-tighter sm:text-7xl lg:text-[84px] text-balance"
          >
            {renderTitle()}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[460px] text-lg leading-relaxed text-muted-foreground/90 md:text-xl"
          >
            {renderSubtitle()}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-6"
          >
            <Link
              href="/signup"
              className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-2xl bg-foreground px-8 text-base font-bold text-background transition-all hover:scale-[1.02] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative z-10">{ctaText}</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/courses"
              className="glass glass-hover h-14 rounded-2xl px-8 flex items-center text-base font-semibold text-foreground transition-all duration-300 border-white/5 shadow-xl"
            >
              {secondaryCtaText}
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Structured Visual Ecosystem */}
        <div className="relative z-10 hidden h-[700px] w-full max-w-[700px] items-center justify-center lg:flex">
          {/* Central Focal Point: Adaptive Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-thick relative h-[480px] w-[560px] overflow-hidden rounded-[40px] border-white/10 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent" />
            <div className="flex h-full flex-col p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/40" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/40" />
                  <div className="h-3 w-3 rounded-full bg-green-500/40" />
                </div>
                <div className="h-7 w-36 rounded-full bg-white/5 border border-white/5" />
              </div>
              
              <div className="space-y-6">
                <div className="h-10 w-2/3 rounded-xl bg-white/10" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="group relative h-40 rounded-[24px] bg-primary-500/10 border border-primary-500/20 overflow-hidden">
                    <motion.div 
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-primary-500/5" 
                    />
                    <div className="absolute inset-x-6 bottom-6 space-y-2">
                      <div className="h-3 w-20 rounded-full bg-primary-400/30" />
                      <div className="h-4 w-12 rounded-full bg-primary-400/50" />
                    </div>
                  </div>
                  <div className="h-40 rounded-[24px] bg-white/5 border border-white/5" />
                </div>
                <div className="h-28 w-full rounded-[24px] bg-white/5 border border-white/5 flex items-center px-8 gap-4">
                  <div className="h-12 w-12 rounded-full bg-accent-500/10 border border-accent-500/20" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-1/2 rounded-full bg-white/10" />
                    <div className="h-2 w-1/3 rounded-full bg-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Orbiting Elements */}
          
          {/* AI Knowledge Node */}
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              x: [0, 10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="glass-morphic absolute -left-4 top-12 h-36 w-36 rounded-[32px] p-8 flex flex-col items-center justify-center gap-3 shadow-2xl"
          >
            <div className="h-12 w-12 rounded-2xl bg-accent-500/20 flex items-center justify-center border border-accent-500/30 relative">
              <div className="absolute inset-0 rounded-2xl bg-accent-400/20 blur-lg animate-pulse" />
              <Sparkles className="h-6 w-6 text-accent-400 relative z-10" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-400">AI Engine</span>
          </motion.div>

          {/* Adaptive Progress */}
          <motion.div
            animate={{ 
              y: [0, 30, 0],
              x: [0, -15, 0]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
            className="glass-morphic absolute -right-6 bottom-24 h-44 w-48 rounded-[32px] p-8 shadow-2xl"
          >
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Adaptive Path</div>
            <div className="h-2.5 w-full rounded-full bg-white/5 mb-6 overflow-hidden border border-white/5">
              <motion.div 
                animate={{ width: ["10%", "85%"] }}
                transition={{ duration: 3, delay: 1.5, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500" 
              />
            </div>
            <div className="space-y-3">
              <div className="h-3 w-3/4 rounded-full bg-white/10" />
              <div className="h-3 w-1/2 rounded-full bg-white/5" />
            </div>
          </motion.div>

          {/* Analytics Pulse */}
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
              rotate: [0, -2, 0],
              y: [0, 10, 0]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
            className="glass-morphic absolute left-12 -bottom-4 h-28 w-56 rounded-[24px] px-8 py-6 flex items-center gap-6 shadow-xl border-white/10"
          >
            <div className="relative h-12 w-2">
              <div className="absolute inset-0 bg-white/10 rounded-full" />
              <motion.div 
                animate={{ height: ["20%", "80%", "40%"] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-0 w-full bg-gradient-to-t from-primary-500 to-accent-500 rounded-full shadow-[0_0_15px_rgba(79,124,255,0.5)]" 
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Efficiency</div>
              <div className="text-2xl font-bold tracking-tight text-foreground">+98.4%</div>
            </div>
          </motion.div>

          {/* Ambient Particles */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-primary-500/5 blur-[120px] rounded-full" />
          </div>
        </div>
      </div>

      {/* Section Transition Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/20 to-transparent z-20 pointer-events-none" />
    </section>
  );
}
