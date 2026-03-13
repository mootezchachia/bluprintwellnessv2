"use client";

import { useCallback, useEffect } from "react";
import { LenisProvider, useLenis } from "@/hooks/useLenis";
import { scrollEvents } from "@/lib/scroll-events";
import SplitTypeInit from "@/components/SplitTypeInit";
import AnimationController from "@/components/AnimationController";
import CustomCursor from "@/components/decorative/CustomCursor";
import JonathanContent from "@/components/jonathan/JonathanContent";

function JonathanInner() {
  const { start } = useLenis();

  useEffect(() => {
    const timer = setTimeout(() => start(), 100);
    return () => clearTimeout(timer);
  }, [start]);

  return (
    <>
      <SplitTypeInit />
      <AnimationController />
      <JonathanContent />
      <CustomCursor />
    </>
  );
}

export default function JonathanPage() {
  const handleScroll = useCallback(
    (args: { scroll: number; limit: number; velocity: number; direction: number; progress: number }) => {
      scrollEvents.emit("scrollUpdate", args);
    },
    []
  );

  return (
    <LenisProvider onScroll={handleScroll}>
      <JonathanInner />
    </LenisProvider>
  );
}
