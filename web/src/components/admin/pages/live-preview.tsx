"use client";

import { usePageBuilderStore, type SectionType } from "@/stores/pageBuilderStore";

const defaultContent: Record<SectionType, Record<string, unknown>> = {
  hero: { title: "Hero Title", subtitle: "Subtitle here", ctaText: "Get Started", background: "color" },
  "feature-grid": { columns: 3, cards: [] },
  "course-carousel": { heading: "Popular Courses", count: 6 },
  "stats-bar": { items: [] },
  testimonials: { items: [] },
  "cta-banner": { text: "Call to Action", buttonText: "Get Started", background: "primary" },
  faq: { items: [] },
  "pricing-table": { plans: [] },
  "custom-html": { html: "<p>Custom content</p>" },
};

function renderSectionContent(
  blockType: SectionType,
  content: Record<string, unknown>,
) {
  switch (blockType) {
    case "hero":
      return (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {(content.title as string) || "Hero Title"}
          </h2>
          {(content.subtitle as string) && (
            <p className="max-w-lg text-gray-600">
              {content.subtitle as string}
            </p>
          )}
          {(content.ctaText as string) && (
            <span className="inline-block rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white">
              {content.ctaText as string}
            </span>
          )}
        </div>
      );

    case "feature-grid": {
      const cards = (content.cards as { title?: string; description?: string }[]) ?? [];
      return (
        <div className="py-8">
          <div className="grid grid-cols-3 gap-4">
            {cards.map((card, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-4 text-center">
                <p className="font-medium text-gray-900">{card.title || "Feature"}</p>
                {card.description && (
                  <p className="mt-1 text-xs text-gray-500">{card.description}</p>
                )}
              </div>
            ))}
            {cards.length === 0 && (
              <p className="col-span-3 text-center text-sm text-gray-400">
                No feature cards added yet
              </p>
            )}
          </div>
        </div>
      );
    }

    case "stats-bar": {
      const items = (content.items as { number?: string; label?: string }[]) ?? [];
      return (
        <div className="flex justify-center gap-8 py-8">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {item.number || "0"}
              </p>
              <p className="text-sm text-gray-500">{item.label || "Stat"}</p>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-gray-400">No stats added yet</p>
          )}
        </div>
      );
    }

    case "cta-banner":
      return (
        <div className="flex flex-col items-center gap-4 rounded-lg bg-primary-600 py-10 text-white">
          <p className="text-xl font-semibold">
            {(content.text as string) || "Call to Action"}
          </p>
          {(content.buttonText as string) && (
            <span className="inline-block rounded-lg bg-white px-6 py-2 text-sm font-medium text-primary-700">
              {content.buttonText as string}
            </span>
          )}
        </div>
      );

    case "faq": {
      const items = (content.items as { question?: string }[]) ?? [];
      return (
        <div className="divide-y divide-gray-200 py-6">
          {items.map((item, i) => (
            <div key={i} className="py-3">
              <p className="font-medium text-gray-900">
                {item.question || `Question ${i + 1}`}
              </p>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-gray-400">No questions added yet</p>
          )}
        </div>
      );
    }

    case "pricing-table": {
      const plans = (content.plans as { name?: string; price?: string; highlighted?: boolean }[]) ?? [];
      return (
        <div className="flex justify-center gap-4 py-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`w-48 rounded-lg border p-4 text-center ${
                plan.highlighted ? "border-primary-500 ring-2 ring-primary-200" : "border-gray-200"
              }`}
            >
              <p className="font-semibold text-gray-900">{plan.name || "Plan"}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {plan.price || "$0"}
              </p>
            </div>
          ))}
          {plans.length === 0 && (
            <p className="text-sm text-gray-400">No plans added yet</p>
          )}
        </div>
      );
    }

    case "course-carousel":
      return (
        <div className="py-6 text-center text-gray-500">
          <p className="text-sm">Course carousel placeholder</p>
        </div>
      );

    case "testimonials":
      return (
        <div className="py-6 text-center text-gray-500">
          <p className="text-sm">Testimonials placeholder</p>
        </div>
      );

    case "custom-html":
      return (
        <div className="py-4 text-sm text-gray-500">
          {(content.html as string) ? (
            <div dangerouslySetInnerHTML={{ __html: content.html as string }} />
          ) : (
            "Custom HTML block"
          )}
        </div>
      );

    default:
      return null;
  }
}

export function LivePreview() {
  const { sections, selectedId, selectSection } = usePageBuilderStore();

  return (
    <div className="min-h-full border-l border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
      </div>
      <div className="space-y-0">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`cursor-pointer border-b border-gray-100 px-6 transition-colors hover:bg-gray-50 ${
              selectedId === section.id ? "bg-primary-50" : ""
            }`}
            onClick={() => selectSection(section.id)}
          >
            {renderSectionContent(
              section.blockType as SectionType,
              section.content as Record<string, unknown>,
            )}
          </div>
        ))}
        {sections.length === 0 && (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            Add sections from the palette to preview
          </div>
        )}
      </div>
    </div>
  );
}
