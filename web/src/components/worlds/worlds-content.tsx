"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WorldCard } from "./world-card";
import { WorldMapView } from "./world-map";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { LazyRender } from "@/components/ui/lazy-render";
import { Button } from "@/components/ui/button";
import { Globe, Map } from "lucide-react";

interface World {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order: number;
  islandCount: number;
  progress: { completed: number; total: number } | null;
}

export function WorldsContent() {
  const [view, setView] = useState<"map" | "grid">("map");
  const { data: worlds, isLoading, error } = useQuery<World[]>({
    queryKey: ["worlds"],
    queryFn: async () => {
      const res = await fetch("/api/worlds");
      if (!res.ok) throw new Error("Failed to fetch worlds");
      return res.json();
    },
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorState message={error.message} />;
  if (!worlds?.length) {
    return (
      <EmptyState
        icon={Globe}
        title="No worlds available"
        description="Learning worlds are being created. Check back soon!"
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Worlds</h1>
          <p className="mt-1 text-muted-foreground">
            Explore themed worlds, master concepts, and unlock new adventures.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-[rgba(255,255,255,0.08)] p-1">
          <Button
            variant={view === "map" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("map")}
            className="gap-1.5"
          >
            <Map className="h-4 w-4" />
            Map
          </Button>
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
            className="gap-1.5"
          >
            <Globe className="h-4 w-4" />
            Grid
          </Button>
        </div>
      </div>

      {view === "map" ? (
        <WorldMapView />
      ) : (
        <StaggerContainer>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {worlds.map((world, i) => (
              <StaggerItem key={world.id}>
                <LazyRender>
                  <WorldCard {...world} />
                </LazyRender>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}
    </div>
  );
}
