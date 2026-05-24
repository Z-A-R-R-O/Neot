"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestCompletionAnimationProps {
  title: string;
  xpReward: number;
  color: string | null;
  show: boolean;
  onClose: () => void;
}

function SparkleBurst({ color }: { color: string }) {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: color,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos(rad) * 80,
              y: Math.sin(rad) * 80,
              scale: [0, 1.5, 0],
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.03,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        );
      })}
    </>
  );
}

export function QuestCompletionAnimation({
  title,
  xpReward,
  color,
  show,
  onClose,
}: QuestCompletionAnimationProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  const c = color ?? "#8b5cf6";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 250, damping: 18 }}
            className="relative mx-4 max-w-xs overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-black/90 p-7 text-center backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center justify-center">
              <SparkleBurst color={c} />
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.25, 1] }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Zap className="h-14 w-14" style={{ color: c }} />
              </motion.div>
            </div>

            <motion.h3
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-4 text-xl font-bold text-foreground"
            >
              Quest Complete!
            </motion.h3>

            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-1 text-sm text-muted-foreground"
            >
              {title}
            </motion.p>

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <span className="text-3xl font-bold" style={{ color: c }}>+{xpReward}</span>
              <span className="ml-1 text-sm text-muted-foreground">XP</span>
            </motion.div>

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="mt-6"
            >
              <Button onClick={onClose} variant="outline" className="w-full gap-2">
                <PartyPopper className="h-4 w-4" />
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
