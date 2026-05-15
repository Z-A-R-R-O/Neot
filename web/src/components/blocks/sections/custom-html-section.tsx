"use client";

export function CustomHtmlSection({ content }: { content: Record<string, unknown> }) {
  const html = content.html as string | undefined;

  return (
    <div className="py-4 text-sm text-gray-500">
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        "Custom HTML block"
      )}
    </div>
  );
}
