"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface LazyRenderProps {
  children: ReactNode;
  rootMargin?: string;
  placeholder?: ReactNode;
}

export function LazyRender({ children, rootMargin = "200px", placeholder }: LazyRenderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {visible ? children : placeholder ?? <div className="h-32 rounded-xl bg-[rgba(255,255,255,0.02)]" />}
    </div>
  );
}
