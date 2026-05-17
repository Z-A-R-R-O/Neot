"use client";

import { useState, useCallback } from "react";

type ResultStatus = "pass" | "warning" | "fail";

interface CheckResult {
  id: number;
  check: string;
  status: ResultStatus;
  message: string;
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number {
  const l1 = luminance(c1.r, c1.g, c1.b);
  const l2 = luminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getCSS(el: Element, prop: string): string {
  return window.getComputedStyle(el).getPropertyValue(prop);
}

function checkContrast(): CheckResult[] {
  const results: CheckResult[] = [];
  const textEls = document.querySelectorAll<HTMLElement>("p, h1, h2, h3, h4, h5, h6, span, a, li, label, button");
  let id = 0;
  const checked = new Set<Element>();
  textEls.forEach((el) => {
    if (checked.has(el)) return;
    checked.add(el);
    const color = getCSS(el, "color");
    const bg = getCSS(el, "background-color");
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    const bgMatch = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!rgbMatch || !bgMatch) return;
    const fg = { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
    const bgRgb = { r: parseInt(bgMatch[1]), g: parseInt(bgMatch[2]), b: parseInt(bgMatch[3]) };
    const ratio = contrastRatio(fg, bgRgb);
    if (ratio < 3) {
      results.push({ id: id++, check: "Contrast", status: "fail", message: `${el.tagName.toLowerCase()} has contrast ratio ${ratio.toFixed(2)}:1 (needs ≥ 3:1 for large text)` });
    } else if (ratio < 4.5) {
      const tag = el.tagName.toLowerCase();
      const isLarge = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag);
      if (!isLarge) {
        results.push({ id: id++, check: "Contrast", status: "warning", message: `${tag} has contrast ratio ${ratio.toFixed(2)}:1 (needs ≥ 4.5:1 for body text)` });
      }
    }
  });
  if (results.length === 0) {
    results.push({ id: id++, check: "Contrast", status: "pass", message: "All checked elements meet contrast requirements" });
  }
  return results;
}

function checkHeadings(): CheckResult[] {
  const results: CheckResult[] = [];
  const headings = Array.from(document.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"));
  let id = 0;
  if (headings.length === 0) {
    results.push({ id: id++, check: "Headings", status: "warning", message: "No heading elements found on the page" });
    return results;
  }
  if (!headings.some((h) => h.tagName === "H1")) {
    results.push({ id: id++, check: "Headings", status: "fail", message: "Page is missing an h1 element" });
  }
  let prevLevel = 0;
  let hasGap = false;
  headings.forEach((h) => {
    const level = parseInt(h.tagName[1]);
    if (prevLevel !== 0 && level > prevLevel + 1 && !hasGap) {
      hasGap = true;
    }
    prevLevel = level;
  });
  if (hasGap) {
    results.push({ id: id++, check: "Headings", status: "warning", message: "Heading hierarchy has gaps (e.g. h1→h3 without h2)" });
  }
  if (results.length === 0) {
    results.push({ id: id++, check: "Headings", status: "pass", message: "Heading hierarchy looks correct" });
  }
  return results;
}

function checkAltText(): CheckResult[] {
  const results: CheckResult[] = [];
  const images = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
  let id = 0;
  if (images.length === 0) {
    results.push({ id: id++, check: "Alt Text", status: "pass", message: "No images found on the page" });
    return results;
  }
  images.forEach((img) => {
    const alt = img.getAttribute("alt");
    if (alt === null) {
      results.push({ id: id++, check: "Alt Text", status: "fail", message: `Image src="${img.src.split("/").pop()}" has no alt attribute` });
    } else if (alt.trim() === "") {
      results.push({ id: id++, check: "Alt Text", status: "warning", message: `Image src="${img.src.split("/").pop()}" has empty alt text (acceptable for decorative images)` });
    }
  });
  if (results.length === 0) {
    results.push({ id: id++, check: "Alt Text", status: "pass", message: "All images have appropriate alt text" });
  }
  return results;
}

function checkAria(): CheckResult[] {
  const results: CheckResult[] = [];
  let id = 0;
  const buttons = document.querySelectorAll<HTMLElement>("[role='button']");
  buttons.forEach((btn) => {
    if (!btn.getAttribute("tabindex") && !(btn instanceof HTMLButtonElement)) {
      results.push({ id: id++, check: "ARIA", status: "warning", message: "Element with role='button' is missing tabindex" });
    }
  });
  const images = document.querySelectorAll<HTMLElement>("[role='img']");
  images.forEach((img) => {
    if (!img.getAttribute("aria-label")) {
      results.push({ id: id++, check: "ARIA", status: "fail", message: "Element with role='img' is missing aria-label" });
    }
  });
  const dialogs = document.querySelectorAll<HTMLElement>("[role='dialog'], [role='alertdialog']");
  dialogs.forEach((d) => {
    if (!d.getAttribute("aria-labelledby") && !d.getAttribute("aria-label")) {
      results.push({ id: id++, check: "ARIA", status: "warning", message: "Dialog is missing accessible name (aria-labelledby or aria-label)" });
    }
  });
  const liveRegions = document.querySelectorAll<HTMLElement>("[aria-live]");
  liveRegions.forEach((r) => {
    const val = r.getAttribute("aria-live");
    if (val !== "polite" && val !== "assertive" && val !== "off") {
      results.push({ id: id++, check: "ARIA", status: "warning", message: `Invalid aria-live value "${val}" on element` });
    }
  });
  const inputs = document.querySelectorAll<HTMLElement>("input, textarea, select");
  inputs.forEach((el) => {
    const labelledby = el.getAttribute("aria-labelledby");
    const label = el.getAttribute("aria-label");
    if (!labelledby && !label) {
      const elId = el.getAttribute("id");
      if (elId) {
        const labelEl = document.querySelector(`label[for="${elId}"]`);
        if (!labelEl) {
          results.push({ id: id++, check: "ARIA", status: "warning", message: `${el.tagName.toLowerCase()} element lacks accessible label` });
        }
      } else {
        results.push({ id: id++, check: "ARIA", status: "warning", message: `${el.tagName.toLowerCase()} element lacks accessible label` });
      }
    }
  });
  if (results.length === 0) {
    results.push({ id: id++, check: "ARIA", status: "pass", message: "No common ARIA violations detected" });
  }
  return results;
}

type CheckFn = () => CheckResult[];

const checks: { key: string; label: string; fn: CheckFn }[] = [
  { key: "contrast", label: "Check Contrast", fn: checkContrast },
  { key: "headings", label: "Check Headings", fn: checkHeadings },
  { key: "alt", label: "Check Alt Text", fn: checkAltText },
  { key: "aria", label: "Check ARIA", fn: checkAria },
];

function Badge({ status }: { status: ResultStatus }) {
  const colors: Record<ResultStatus, string> = {
    pass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    fail: "bg-red-500/15 text-red-400 border-red-500/25",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${colors[status]}`}>
      {status}
    </span>
  );
}

export function AccessibilityTools() {
  const [results, setResults] = useState<CheckResult[]>([]);
  const [running, setRunning] = useState<string | null>(null);

  const runCheck = useCallback((key: string, fn: CheckFn) => {
    setRunning(key);
    setResults([]);
    requestAnimationFrame(() => {
      const res = fn();
      setResults((prev) => [...prev, ...res]);
      setRunning(null);
    });
  }, []);

  const runAll = useCallback(() => {
    setResults([]);
    setRunning("all");
    requestAnimationFrame(() => {
      const all: CheckResult[] = [];
      for (const c of checks) {
        all.push(...c.fn());
      }
      setResults(all);
      setRunning(null);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Accessibility Tools</h2>
        <p className="text-sm text-muted-foreground">
          Run accessibility checks on the current page
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {checks.map((c) => (
          <button
            key={c.key}
            onClick={() => runCheck(c.key, c.fn)}
            disabled={running !== null}
            className="inline-flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2 text-xs font-medium text-foreground outline-none ring-1 ring-border/50 transition-all hover:bg-muted/50 disabled:opacity-50"
          >
            {running === c.key && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            )}
            {c.label}
          </button>
        ))}
        <button
          onClick={runAll}
          disabled={running !== null}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500/20 px-3 py-2 text-xs font-medium text-primary-400 outline-none ring-1 ring-primary-500/30 transition-all hover:bg-primary-500/30 disabled:opacity-50"
        >
          {running === "all" && (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
          )}
          Run All
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r) => (
            <div
              key={r.id}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/10 px-4 py-3"
            >
              <Badge status={r.status} />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  {r.check}
                </p>
                <p className="text-xs text-foreground">{r.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && running === null && (
        <div className="rounded-lg border border-dashed border-border/50 px-6 py-12 text-center">
          <p className="text-xs text-muted-foreground">
            Click a check above to scan the page
          </p>
        </div>
      )}
    </div>
  );
}
