"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ArrowRight, BookOpen, User as UserIcon, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SearchCourse {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  difficulty: string;
  subject: string | null;
  teacher: { fullName: string | null } | null;
}

interface SearchTeacher {
  id: string;
  fullName: string | null;
  email: string | null;
}

export function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ courses: SearchCourse[]; teachers: SearchTeacher[] } | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setResults(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 250);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const hasResults = results && (results.courses.length > 0 || results.teachers.length > 0);

  return (
    <div ref={ref} className="relative">
      <div className="flex h-9 w-48 items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 transition-all focus-within:w-64 focus-within:border-primary-500/30 focus-within:bg-[rgba(79,124,255,0.06)] lg:w-56">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search courses..."
          className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/40"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults(null); }} className="text-muted-foreground/30 hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,12,16,0.98)] shadow-2xl backdrop-blur-xl"
          >
            {loading ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground/50">Searching...</div>
            ) : !hasResults ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground/50">No results found</div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {results.courses.length > 0 && (
                  <div>
                    <p className="px-4 pb-1 pt-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">Courses</p>
                    {results.courses.map((c) => (
                      <Link
                        key={c.id}
                        href={`/courses/${c.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[rgba(255,255,255,0.04)]"
                      >
                        <BookOpen className="h-4 w-4 shrink-0 text-primary-400" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
                          <p className="truncate text-xs text-muted-foreground/60">
                            {c.teacher?.fullName ?? "Unknown"} · {c.difficulty}
                          </p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30" />
                      </Link>
                    ))}
                  </div>
                )}
                {results.teachers.length > 0 && (
                  <div className="border-t border-[rgba(255,255,255,0.06)]">
                    <p className="px-4 pb-1 pt-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">Teachers</p>
                    {results.teachers.map((t) => (
                      <div key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                        <UserIcon className="h-4 w-4 shrink-0 text-accent-400" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{t.fullName ?? "Unknown"}</p>
                          <p className="truncate text-xs text-muted-foreground/60">{t.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
