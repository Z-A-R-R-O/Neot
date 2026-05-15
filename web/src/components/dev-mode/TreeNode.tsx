"use client";

import { useState } from "react";
import { ChevronRight, GripVertical, Eye, EyeOff, Trash2, Copy } from "lucide-react";
import { useDevModeStore } from "@/stores/devModeStore";

interface TreeNodeData {
  id: string;
  type: string;
  label: string;
  children?: TreeNodeData[];
  visible?: boolean;
}

interface TreeNodeProps {
  node: TreeNodeData;
  depth: number;
  onSelect?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TreeNode({ node, depth, onSelect, onToggleVisibility, onDuplicate, onDelete }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const selectedId = useDevModeStore((s) => s.selectedId);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  function handleClick() {
    useDevModeStore.getState().select(node.id);
    onSelect?.(node.id);
  }

  return (
    <div>
      <div
        className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition-colors cursor-pointer ${
          isSelected
            ? "bg-primary-500/10 text-primary-400"
            : "text-muted-foreground hover:bg-glass hover:text-foreground"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={handleClick}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className={`flex h-4 w-4 items-center justify-center transition-transform ${
            hasChildren ? "opacity-100" : "opacity-0 pointer-events-none"
          } ${expanded ? "rotate-90" : ""}`}
        >
          <ChevronRight className="h-3 w-3" />
        </button>

        <GripVertical className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab" />

        <span className="flex-1 truncate">
          <span className="text-[10px] uppercase tracking-wider opacity-50">{node.type}</span>{" "}
          {node.label}
        </span>

        <div className="hidden items-center gap-0.5 group-hover:flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility?.(node.id);
            }}
            className="rounded p-0.5 hover:bg-glass"
          >
            {node.visible !== false ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3 opacity-40" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate?.(node.id);
            }}
            className="rounded p-0.5 hover:bg-glass"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(node.id);
            }}
            className="rounded p-0.5 hover:bg-glass hover:text-red-400"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              onToggleVisibility={onToggleVisibility}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
