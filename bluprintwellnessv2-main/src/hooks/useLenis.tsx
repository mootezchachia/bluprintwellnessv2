"use client";

import { createContext, useContext, useEffect, useRef, useMemo, ReactNode } from "react";

interface ScrollContextType {
  scrollTo: (target: HTMLElement | string | number, options?: any) => void;
  start: () => void;
  stop: () => void;
}

const ScrollContext = createContext<ScrollContextType>({
  scrollTo: () => {},
  start: () => {},
  stop: () => {},
});

export function useLenis() {
  return useContext(ScrollContext);
}

// Adaptive wheelMultiplier based on viewport height (from original)
function getWheelMultiplier() {
  if (typeof window === "undefined") return 0.9;
  const h = window.innerHeight;
  if (h < 700) return 0.6;
  if (h < 800) return 0.7;
  if (h < 900) return 0.8;
  return 0.9;
}

export function LenisProvider({
  children,
  onScroll,
}: {
  children: ReactNode;
  onScroll?: (args: {
    scroll: number;
    limit: number;
    velocity: number;
    direction: number;
    progress: number;
  }) => void;
}) {
  const instanceRef = useRef<any>(null);
  const onScrollRef = useRef(onScroll);
  onScrollRef.current = onScroll;

  // Stable context value — methods always read from instanceRef.current
  // so they work even after the async locomotive-scroll load
  const contextValue = useMemo<ScrollContextType>(() => ({
    scrollTo: (target, options) => {
      instanceRef.current?.scrollTo(target, {
        duration: 1,
        lerp: 0.1,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        ...options,
      });
    },
    start: () => instanceRef.current?.start?.(),
    stop: () => instanceRef.current?.stop?.(),
  }), []);

  useEffect(() => {
    // Reset scroll position on load
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let instance: any;

    import("locomotive-scroll").then((mod) => {
      const LocomotiveScroll = mod.default;
      instance = new LocomotiveScroll({
        autoStart: false,
        scrollCallback: (args: any) => {
          onScrollRef.current?.(args);
        },
        lenisOptions: {
          wheelMultiplier: getWheelMultiplier(),
          syncTouch: true,
          touchMultiplier: 12,
          lerp: 0.1,
          duration: 0.75,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        },
      });

      instanceRef.current = instance;
    });

    return () => {
      instance?.destroy?.();
    };
  }, []);

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
}
