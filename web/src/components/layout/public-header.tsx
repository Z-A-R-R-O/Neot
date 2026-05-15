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
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500 ${
          scrolled
            ? "border border-glass-border bg-background/80 shadow-glass backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
            <span className="text-sm font-bold text-white">N</span>
          </div>
          <span className="text-lg font-semibold text-foreground">NEOT</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-primary-600"
          >
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary-400 to-primary-500 transition-transform duration-300 group-hover:translate-x-0" />
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
