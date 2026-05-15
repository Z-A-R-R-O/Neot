"use client";

import { Layers, Plus, Search } from "lucide-react";
import { useState } from "react";
import { TreeNode } from "./TreeNode";
import { useDevModeStore } from "@/stores/devModeStore";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";

interface StructureTreeProps {
  blocks: TreeNodeData[];
  onAddBlock?: () => void;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

interface TreeNodeData {
  id: string;
  type: string;
  label: string;
  children?: TreeNodeData[];
  visible?: boolean;
}

export function StructureTree({ blocks, onAddBlock, onSelect, onDelete, onDuplicate }: StructureTreeProps) {
  const [search, setSearch] = useState("");

  const enabled = useDevModeStore((s) => s.enabled);
  const selectedId = useDevModeStore((s) => s.selectedId);

  if (!enabled) return null;

  function filterTree(nodes: TreeNodeData[], query: string): TreeNodeData[] {
    if (!query) return nodes;
    return nodes
      .map((node) => ({
        ...node,
        children: node.children ? filterTree(node.children, query) : undefined,
      }))
      .filter(
        (node) =>
          node.label.toLowerCase().includes(query.toLowerCase()) ||
          node.type.toLowerCase().includes(query.toLowerCase()) ||
          (node.children && node.children.length > 0),
      );
  }

  const filtered = search ? filterTree(blocks, search) : blocks;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Layers</span>
        </div>
        <button
          onClick={onAddBlock}
          className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="border-b border-border px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Find layer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs text-foreground placeholder-muted-foreground outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Layers className="mb-2 h-8 w-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              {search ? "No layers match your search" : "No blocks yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                onSelect={(id) => {
                  useDevModeStore.getState().select(id);
                  usePageBuilderStore.getState().selectSection(id);
                  onSelect?.(id);
                }}
                onToggleVisibility={(id) => {
                  // Toggle visibility - would update page store
                }}
                onDuplicate={(id) => {
                  onDuplicate?.(id);
                }}
                onDelete={(id) => {
                  onDelete?.(id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
