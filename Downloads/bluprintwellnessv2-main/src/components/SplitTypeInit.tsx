"use client";

import { useEffect } from "react";
import SplitType from "split-type";

export default function SplitTypeInit() {
  useEffect(() => {
    // Wait for DOM to be ready (like original's 500ms delay)
    const timer = setTimeout(() => {
      document.querySelectorAll("[data-split]").forEach((el) => {
        const raw = el.getAttribute("data-split");
        const types = (!raw || raw === "true") ? "lines,words" : raw;
        new SplitType(el as HTMLElement, { types: types as any });
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  return null;
}
