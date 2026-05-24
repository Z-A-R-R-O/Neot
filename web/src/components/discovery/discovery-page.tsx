"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Globe, Sparkles, TrendingUp, Compass, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { PageTransition } from "@/components/ui/motion";

interface WorldNode {
  id: string; title: string; description: string | null; icon: string | null;
  color: string | null; status: string; progress: number; islandCount: number;
}

interface CuriosityItem {
  id: string; title: string; description: string | null; difficulty: number;
  difficultyLabel: string; domain: string; icon: string | null; color: string | null;
  islandTitle: string | null; worldTitle: string | null;
}

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] p-5 transition-all duration-300",
      "bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.04)] cursor-pointer",
      className,
    )}>
      {children}
    </div>
  );
}

export function DiscoveryPage() {
  const { data: worlds } = useQuery<WorldNode[]>({
    queryKey: ["worlds", "map"],
    queryFn: async () => { const r = await fetch("/api/worlds/map"); return r.json(); },
  });

  const { data: curiosities } = useQuery<CuriosityItem[]>({
    queryKey: ["curiosity", "recommendations"],
    queryFn: async () => { const r = await fetch("/api/curiosity/recommendations?count=6"); return r.json(); },
  });

  const { data: enrollments } = useQuery({
    queryKey: ["discovery", "enrollments"],
    queryFn: async () => { const r = await fetch("/api/enrollments?limit=6"); return r.json(); },
  });

  if (!worlds && !curiosities) {
    return (
      <PageTransition>
        <div className="space-y-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Discover</h1>
            <p className="mt-1 text-muted-foreground">Explore worlds, courses, and topics tailored for you</p>
          </div>
          <EmptyState
            icon={Search}
            title="Loading your recommendations..."
            description="We're personalizing your discovery feed"
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Discover</h1>
          <p className="mt-1 text-muted-foreground">Explore worlds, courses, and topics tailored for you</p>
        </motion.div>

        {/* Continue Learning */}
        {enrollments && enrollments.length > 0 ? (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Continue Learning</h2>
              </div>
              <Link href="/dashboard" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
              {enrollments.map((enrollment: { id: string; course: { id: string; title: string; thumbnailUrl: string | null; difficulty: string }; progress: number }) => (
                <Link key={enrollment.id} href={`/courses/${enrollment.course.id}`} className="snap-start shrink-0">
                  <motion.div whileHover={{ y: -4 }} className="w-64 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                    <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl">
                      {enrollment.course.thumbnailUrl ? (
                        <img src={enrollment.course.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-foreground truncate">{enrollment.course.title}</p>
                      <div className="mt-2 h-1.5 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${enrollment.progress}%` }} />
                      </div>
                      <p className="mt-1 text-[10px] text-muted-foreground">{Math.round(enrollment.progress)}% complete</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Continue Learning</h2>
            </div>
            <EmptyState
              title="No courses in progress"
              description="Start exploring a learning world to pick up where you left off"
              actionLabel="Explore Worlds"
              actionHref="/worlds"
            />
          </motion.section>
        )}

        {/* Worlds */}
        {worlds && worlds.length > 0 ? (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Learning Worlds</h2>
              </div>
              <Link href="/worlds" className="text-xs text-primary hover:underline flex items-center gap-1">
                Explore all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {worlds.slice(0, 6).map((world, i) => (
                <motion.div key={world.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/worlds/${world.id}`}>
                    <SectionCard>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ backgroundColor: world.color ? `${world.color}20` : "rgba(59,130,246,0.1)" }}>
                          {world.icon ?? "🌍"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">{world.title}</p>
                          <p className="text-xs text-muted-foreground">{world.islandCount} islands</p>
                        </div>
                        <div className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-medium",
                          world.status === "mastered" ? "bg-green-500/20 text-green-400" :
                          world.status === "exploring" ? "bg-blue-500/20 text-blue-400" :
                          world.status === "unlocked" ? "bg-accent/20 text-accent" :
                          "bg-muted text-muted-foreground",
                        )}>
                          {world.status}
                        </div>
                      </div>
                    </SectionCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-bold text-foreground">Learning Worlds</h2>
            </div>
            <EmptyState
              title="No worlds available yet"
              description="Learning worlds are being prepared. Check back soon!"
            />
          </motion.section>
        )}

        {/* Curiosity Picks */}
        {curiosities && curiosities.length > 0 ? (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-foreground">Curiosity Picks</h2>
              </div>
              <Link href="/dashboard" className="text-xs text-primary hover:underline flex items-center gap-1">
                Explore more <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
              {curiosities.map((item) => (
                <div key={item.id} className="snap-start shrink-0 w-72">
                  <motion.div whileHover={{ y: -3 }} className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4 h-full">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg text-base" style={{ backgroundColor: item.color ? `${item.color}20` : "rgba(139,92,246,0.1)" }}>
                        {item.icon ?? <Compass className="h-4 w-4" style={{ color: item.color ?? "#8b5cf6" }} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground">{item.worldTitle ?? item.domain}</p>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground/70 line-clamp-2">{item.description}</p>
                    )}
                    <div className="mt-2 flex gap-2">
                      <span className="rounded-full bg-[rgba(255,255,255,0.04)] px-2 py-0.5 text-[10px] text-muted-foreground">
                        {item.difficultyLabel}
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-bold text-foreground">Curiosity Picks</h2>
            </div>
            <EmptyState
              title="No recommendations yet"
              description="Start learning to get personalized curiosity picks"
            />
          </motion.section>
        )}
      </div>
    </PageTransition>
  );
}
