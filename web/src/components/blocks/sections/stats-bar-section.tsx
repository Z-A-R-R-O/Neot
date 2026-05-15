"use client";

interface StatItem {
  number?: string;
  label?: string;
}

export function StatsBarSection({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as StatItem[]) ?? [];

  return (
    <div className="flex justify-center gap-8 py-8">
      {items.length > 0 ? (
        items.map((item, i) => (
          <div key={i} className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {item.number || "0"}
            </p>
            <p className="text-sm text-gray-500">{item.label || "Stat"}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400">No stats added yet</p>
      )}
    </div>
  );
}
