"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { ListChecks } from "lucide-react";
import { QuestCard } from "./quest-card";
import { QuestCompletionAnimation } from "./quest-completion-animation";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

interface QuestData {
  id: string;
  status: string;
  progress: number;
  target: number;
  claimedAt: string | null;
  quest: {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    icon: string | null;
    color: string | null;
    type: string;
  };
}

interface QuestsResponse {
  quests: QuestData[];
}

export function DailyQuestsPanel() {
  const queryClient = useQueryClient();
  const [lastClaimed, setLastClaimed] = useState<{ title: string; xpReward: number; color: string | null } | null>(null);

  const { data, isLoading, error } = useQuery<QuestsResponse>({
    queryKey: ["daily-quests"],
    queryFn: async () => {
      const res = await fetch("/api/quests/daily");
      if (!res.ok) throw new Error("Failed to fetch quests");
      return res.json();
    },
  });

  const claimMutation = useMutation({
    mutationFn: async (questId: string) => {
      const res = await fetch(`/api/quests/${questId}/claim`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to claim reward");
      return res.json();
    },
    onSuccess: (_data, questId) => {
      const sq = data?.quests.find((q) => q.id === questId);
      if (sq) {
        setLastClaimed({ title: sq.quest.title, xpReward: sq.quest.xpReward, color: sq.quest.color });
      }
      queryClient.invalidateQueries({ queryKey: ["daily-quests"] });
    },
  });

  if (isLoading) return <div className="h-32 animate-pulse rounded-xl bg-muted" />;
  if (error) return <ErrorState message={error.message} />;
  if (!data || data.quests.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No quests today"
        description="Complete some lessons to unlock daily quests!"
      />
    );
  }

  return (
    <div className="space-y-3">
      {lastClaimed && (
        <QuestCompletionAnimation
          title={lastClaimed.title}
          xpReward={lastClaimed.xpReward}
          color={lastClaimed.color}
          show={!!lastClaimed}
          onClose={() => setLastClaimed(null)}
        />
      )}

      <div className="flex items-center gap-2">
        <ListChecks className="h-5 w-5 text-primary-400" />
        <h3 className="font-semibold text-foreground">Daily Quests</h3>
      </div>

      <div className="grid gap-3">
        {data.quests.map((sq, idx) => (
          <motion.div
            key={sq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <QuestCard
              id={sq.id}
              title={sq.quest.title}
              description={sq.quest.description}
              xpReward={sq.quest.xpReward}
              icon={sq.quest.icon}
              color={sq.quest.color}
              status={sq.status}
              progress={sq.progress}
              target={sq.target}
              claimedAt={sq.claimedAt}
              onClaim={(id) => claimMutation.mutate(id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
