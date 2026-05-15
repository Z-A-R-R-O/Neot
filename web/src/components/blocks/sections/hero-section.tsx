"use client";

interface HeroSectionProps {
  content: Record<string, unknown>;
}

export function HeroSection({ content }: HeroSectionProps) {
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const ctaText = content.ctaText as string | undefined;

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <h2 className="text-3xl font-bold text-gray-900">
        {title || "Hero Title"}
      </h2>
      {subtitle && (
        <p className="max-w-lg text-gray-600">{subtitle}</p>
      )}
      {ctaText && (
        <span className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white">
          {ctaText}
        </span>
      )}
    </div>
  );
}
