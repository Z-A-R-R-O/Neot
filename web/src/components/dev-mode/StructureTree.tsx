"use client";

import { Layers, Plus, Search } from "lucide-react";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTreeNode } from "./sortable-tree-node";
import { useDevModeStore } from "@/stores/devModeStore";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";

interface StructureTreeProps {
  blocks: TreeNodeData[];
  onAddBlock?: () => void;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onReorder?: (activeId: string, overId: string) => void;
}

export interface TreeNodeData {
  id: string;
  type: string;
  label: string;
  children?: TreeNodeData[];
  visible?: boolean;
}

export function StructureTree({ blocks, onAddBlock, onSelect, onDelete, onDuplicate, onReorder }: StructureTreeProps) {
  const [search, setSearch] = useState("");

  const enabled = useDevModeStore((s) => s.enabled);

  if (!enabled) return null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onReorder?.(active.id as string, over.id as string);
  }

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

  function renderSortableNode(node: TreeNodeData, depth: number) {
    const hasChildren = node.children && node.children.length > 0;
    return (
      <div key={node.id}>
        <SortableTreeNode
          node={node}
          depth={depth}
          onSelect={(id) => {
            useDevModeStore.getState().select(id);
            usePageBuilderStore.getState().selectSection(id);
            onSelect?.(id);
          }}
          onToggleVisibility={() => {}}
          onDuplicate={(id) => onDuplicate?.(id)}
          onDelete={(id) => onDelete?.(id)}
        />
        {hasChildren && (
          <div>
            {node.children!.map((child) => renderSortableNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  function getAllIds(nodes: TreeNodeData[]): string[] {
    const ids: string[] = [];
    for (const n of nodes) {
      ids.push(n.id);
      if (n.children) ids.push(...getAllIds(n.children));
    }
    return ids;
  }

  const allIds = getAllIds(blocks);

  return (
    <div className="flex h-full flex-col bg-background/50 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Layers</span>
        </div>
        <button
          onClick={onAddBlock}
          className="rounded-lg p-1 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl bg-muted/20 px-3 py-2 border border-border/50 transition-all focus-within:border-primary-500/50 focus-within:bg-background">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search layers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[11px] font-medium text-foreground placeholder-muted-foreground/60 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Layers className="mb-2 h-8 w-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              {search ? "No layers match your search" : "No blocks yet"}
            </p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={allIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-0.5">
                {filtered.map((node) => renderSortableNode(node, 0))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
