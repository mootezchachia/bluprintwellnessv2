"use client";

import { useCallback, useEffect } from "react";
import { LenisProvider, useLenis } from "@/hooks/useLenis";
import { scrollEvents } from "@/lib/scroll-events";
import SplitTypeInit from "@/components/SplitTypeInit";
import AnimationController from "@/components/AnimationController";
import CustomCursor from "@/components/decorative/CustomCursor";
import FunctionalMedicineContent from "@/components/functional-medicine/FunctionalMedicineContent";

function FuncMedInner() {
  const { start } = useLenis();

  useEffect(() => {
    // Start scroll immediately (no loading sequence on sub-pages)
    const timer = setTimeout(() => start(), 100);
    return () => clearTimeout(timer);
  }, [start]);

  return (
    <>
      <SplitTypeInit />
      <AnimationController />
      <FunctionalMedicineContent />
      <CustomCursor />
    </>
  );
}

export default function FunctionalMedicinePage() {
  const handleScroll = useCallback(
    (args: { scroll: number; limit: number; velocity: number; direction: number; progress: number }) => {
      scrollEvents.emit("scrollUpdate", args);
    },
    []
  );

  return (
    <LenisProvider onScroll={handleScroll}>
      <FuncMedInner />
    </LenisProvider>
  );
}
