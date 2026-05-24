"use client";

import { useQuery } from "@tanstack/react-query";
import { Compass, RefreshCw } from "lucide-react";
import { CuriosityCard } from "./curiosity-card";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import type { CuriosityRecommendation } from "@/lib/curiosity/curiosity-recommender";

export function ExploreTab() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery<CuriosityRecommendation[]>({
    queryKey: ["curiosity", "recommendations"],
    queryFn: async () => {
      const res = await fetch("/api/curiosity/recommendations?count=8");
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      return res.json();
    },
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.length) {
    return (
      <EmptyState
        icon={Compass}
        title="Nothing new to explore"
        description="You've explored everything! Check back later for new content."
        actionLabel="Refresh"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Explore</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover new concepts and topics you haven&apos;t explored yet
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          disabled={isRefetching}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <StaggerContainer>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((item) => (
            <StaggerItem key={item.id}>
              <CuriosityCard {...item} />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </div>
  );
}
