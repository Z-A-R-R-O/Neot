"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { SkillTreeNode } from "./skill-tree-node";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { LazyRender } from "@/components/ui/lazy-render";
import { GitBranch } from "lucide-react";

interface Node {
  id: string;
  title: string;
  difficulty: number;
  color: string | null;
  islandId: string | null;
}

interface Edge {
  from: string;
  to: string;
}

interface SkillTreeData {
  nodes: Node[];
  edges: Edge[];
}

export function SkillTree({ params }: { params: Promise<{ worldId: string }> }) {
  const { worldId } = use(params);

  const { data, isLoading, error } = useQuery<SkillTreeData>({
    queryKey: ["skill-tree", worldId],
    queryFn: async () => {
      const res = await fetch(`/api/worlds/${worldId}/skill-tree`);
      if (!res.ok) throw new Error("Failed to fetch skill tree");
      return res.json();
    },
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorState message={error.message} />;
  if (!data || data.nodes.length === 0) {
    return (
      <EmptyState
        icon={GitBranch}
        title="No skill tree available"
        description="This world has no concept data yet."
      />
    );
  }

  const islandGroups: Record<string, { label: string; nodes: Node[] }> = {};
  for (const node of data.nodes) {
    const key = node.islandId ?? "unknown";
    if (!islandGroups[key]) islandGroups[key] = { label: key, nodes: [] };
    islandGroups[key].nodes.push(node);
  }

  const objectKeys = Object.keys(islandGroups);
  const columns = objectKeys.length;
  const NODE_W = 140;
  const NODE_H = 60;
  const GAP_X = 60;
  const GAP_Y = 30;
  const PADDING = 40;
  const COL_WIDTH = NODE_W + GAP_X;
  const ROW_HEIGHT = NODE_H + GAP_Y;

  const layout = data.nodes.map((node) => {
    const col = Math.min(
      objectKeys.findIndex((k) => islandGroups[k].nodes.includes(node)),
      columns - 1,
    );
    const group = islandGroups[objectKeys[col]];
    const row = group.nodes.indexOf(node);
    return {
      ...node,
      position: {
        x: PADDING + col * COL_WIDTH + COL_WIDTH / 2,
        y: PADDING + row * ROW_HEIGHT + ROW_HEIGHT / 2,
      },
    };
  });

  const width = columns * COL_WIDTH + PADDING * 2;
  const maxRows = Math.max(...objectKeys.map((k) => islandGroups[k].nodes.length));
  const height = maxRows * ROW_HEIGHT + PADDING * 2;

  return (
    <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-2 sm:p-4">
      <div className="relative" style={{ width: Math.max(width, 320), height }}>
        <svg className="absolute inset-0 h-full w-full" style={{ pointerEvents: "none" }}>
          {data.edges.map((edge, idx) => {
            const from = layout.find((n) => n.id === edge.from);
            const to = layout.find((n) => n.id === edge.to);
            if (!from || !to) return null;
            return (
              <line
                key={idx}
                x1={from.position.x}
                y1={from.position.y + NODE_H / 2}
                x2={to.position.x}
                y2={to.position.y - NODE_H / 2}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={2}
              />
            );
          })}
        </svg>

        {layout.map((node) => (
          <LazyRender key={node.id} rootMargin="300px" placeholder={<div style={{ position: "absolute", left: node.position.x - NODE_W / 2, top: node.position.y - NODE_H / 2, width: NODE_W, height: NODE_H }} />}>
            <SkillTreeNode
              id={node.id}
              title={node.title}
              difficulty={node.difficulty}
              color={node.color}
              isMastered={false}
              isInProgress={false}
              isLocked={false}
              position={node.position}
            />
          </LazyRender>
        ))}
      </div>
    </div>
  );
}
