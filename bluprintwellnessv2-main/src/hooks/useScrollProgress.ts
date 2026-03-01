"use client";

import { useState, useEffect, type RefObject } from "react";

export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    let raf: number;

    const update = () => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.max(
          0,
          Math.min(1, (vh - rect.top) / (vh + rect.height))
        );
        setProgress(p);
      }
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    return () => cancelAnimationFrame(raf);
  }, [ref]);

  return progress;
}
