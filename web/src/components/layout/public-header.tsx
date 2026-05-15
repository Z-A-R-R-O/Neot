"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Courses", href: "/courses" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          scale: scrolled ? 0.95 : 1,
          width: scrolled ? "90%" : "100%",
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className={`flex max-w-5xl items-center justify-between rounded-full px-8 transition-all duration-700 ${
          scrolled
            ? "border border-white/10 bg-background/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-3xl py-2"
            : "bg-transparent border border-transparent py-5"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 px-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-primary-500 shadow-glow-sm">
            <span className="text-[10px] font-bold text-white">N</span>
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">NEOT</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-glass hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="mr-2 h-4 w-px bg-glass-border" />
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="group relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 rounded-2xl border border-glass-border bg-background/95 p-6 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-glass hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-glass-border" />
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-glass hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
