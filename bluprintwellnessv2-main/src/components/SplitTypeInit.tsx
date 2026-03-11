"use client";

import { useEffect } from "react";
import SplitType from "split-type";

export default function SplitTypeInit() {
  useEffect(() => {
    // Wait for DOM to be ready (like original's 500ms delay)
    const timer = setTimeout(() => {
      document.querySelectorAll("[data-split]").forEach((el) => {
        // Replace <br> with a space so SplitType preserves word boundaries.
        // SplitType destroys <br> tags during splitting, causing adjacent words to merge.
        // We replace each <br> with a space text node before SplitType processes.
        el.querySelectorAll("br").forEach((br) => {
          const space = document.createTextNode(" ");
          br.parentNode?.replaceChild(space, br);
        });
        const raw = el.getAttribute("data-split");
        const types = (!raw || raw === "true") ? "lines,words" : raw;
        new SplitType(el as HTMLElement, { types: types as any });
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  return null;
}
