"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Star, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface IslandCompletionRewardProps {
  islandTitle: string;
  islandColor: string | null;
  xpEarned: number;
  worldCompleted: boolean;
  worldXpEarned: number;
  worldId: string;
  show: boolean;
  onClose: () => void;
}

function FloatingParticles({ color }: { color: string }) {
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            borderRadius: "50%",
            backgroundColor: color,
          }}
          initial={{ scale: 0, opacity: 1, y: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 0.8, 0],
            y: -60 - Math.random() * 80,
            x: (Math.random() - 0.5) * 60,
          }}
          transition={{
            duration: 1.5 + Math.random() * 1.5,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </>
  );
}

export function IslandCompletionReward({
  islandTitle,
  islandColor,
  xpEarned,
  worldCompleted,
  worldXpEarned,
  worldId,
  show,
  onClose,
}: IslandCompletionRewardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  const color = islandColor ?? "#6366f1";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative mx-4 max-w-sm overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-black/90 p-8 text-center backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <FloatingParticles color={color} />

            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Star className="mx-auto h-16 w-16" style={{ color }} />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-2xl font-bold text-foreground"
            >
              Island Complete!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-1 text-muted-foreground"
            >
              You conquered <span className="font-semibold" style={{ color }}>{islandTitle}</span>
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex justify-center gap-6"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">+{xpEarned}</p>
                <p className="text-xs text-muted-foreground">XP earned</p>
              </div>
            </motion.div>

            {worldCompleted && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3"
              >
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-300">World Mastered!</span>
                </div>
                <p className="mt-1 text-xs text-yellow-400/80">
                  Bonus: +{worldXpEarned} XP for completing the entire world
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 flex flex-col gap-3"
            >
              {worldCompleted ? (
                <>
                  <Button asChild variant="default" className="w-full">
                    <Link href={`/worlds/${worldId}`}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      View World Progress
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/worlds">
                      <PartyPopper className="mr-2 h-4 w-4" />
                      Explore Next World
                    </Link>
                  </Button>
                </>
              ) : (
                <Button onClick={onClose} variant="default" className="w-full">
                  Continue Learning
                </Button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
