"use client";

import { useEffect, useRef, type RefObject } from "react";
import SplitType from "split-type";

interface SplitTypeOptions {
  types?: string;
  tagName?: string;
  splitClass?: string;
}

export function useSplitType(
  ref: RefObject<HTMLElement | null>,
  options: SplitTypeOptions = {}
) {
  const instanceRef = useRef<SplitType | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const { types = "lines,words", ...rest } = options;

    const split = () => {
      if (instanceRef.current) {
        instanceRef.current.revert();
      }
      instanceRef.current = new SplitType(ref.current!, {
        types: types as any,
        ...rest,
      });
    };

    split();

    let debounceTimer: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        split();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("resize", handleResize);
      if (instanceRef.current) {
        instanceRef.current.revert();
        instanceRef.current = null;
      }
    };
  }, [ref, options]);

  return instanceRef.current;
}
