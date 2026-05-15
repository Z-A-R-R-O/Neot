"use client";

interface FaqItem {
  question?: string;
}

export function FaqSection({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as FaqItem[]) ?? [];

  return (
    <div className="divide-y divide-gray-200 py-6">
      {items.length > 0 ? (
        items.map((item, i) => (
          <div key={i} className="py-3">
            <p className="font-medium text-gray-900">
              {item.question || `Question ${i + 1}`}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400">No questions added yet</p>
      )}
    </div>
  );
}
