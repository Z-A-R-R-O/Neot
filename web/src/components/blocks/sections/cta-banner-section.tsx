"use client";

export function CtaBannerSection({ content }: { content: Record<string, unknown> }) {
  const text = content.text as string | undefined;
  const buttonText = content.buttonText as string | undefined;

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-blue-600 py-10 text-white">
      <p className="text-xl font-semibold">
        {text || "Call to Action"}
      </p>
      {buttonText && (
        <span className="inline-block rounded-lg bg-white px-6 py-2 text-sm font-medium text-blue-700">
          {buttonText}
        </span>
      )}
    </div>
  );
}
