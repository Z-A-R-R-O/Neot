"use client";

interface FeatureCard {
  title?: string;
  description?: string;
}

export function FeatureGridSection({ content }: { content: Record<string, unknown> }) {
  const cards = (content.cards as FeatureCard[]) ?? [];

  return (
    <div className="py-8">
      <div className="grid grid-cols-3 gap-4">
        {cards.length > 0 ? (
          cards.map((card, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 text-center">
              <p className="font-medium text-gray-900">{card.title || "Feature"}</p>
              {card.description && (
                <p className="mt-1 text-xs text-gray-500">{card.description}</p>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-sm text-gray-400">
            No feature cards added yet
          </p>
        )}
      </div>
    </div>
  );
}
