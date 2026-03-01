"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { LenisProvider, useLenis } from "@/hooks/useLenis";
import { CircleStateProvider } from "@/hooks/useCircleState";
import { scrollEvents } from "@/lib/scroll-events";
import { revealAfterLoading } from "@/lib/post-loading";
import LoadingSequence from "@/components/home/LoadingSequence";
import HeroSection from "@/components/home/HeroSection";
import SportSection from "@/components/home/SportSection";
import SphereLabSection from "@/components/home/SphereLabSection";
import JoinSection from "@/components/home/JoinSection";
import InvestSection from "@/components/home/InvestSection";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";
import Circles from "@/components/decorative/Circles";
import Panels from "@/components/decorative/Panels";
import CustomCursor from "@/components/decorative/CustomCursor";
import SplitTypeInit from "@/components/SplitTypeInit";
import AnimationController from "@/components/AnimationController";

// WebGL canvas - client only, no SSR
const WebGLCanvas = dynamic(() => import("@/components/canvas/WebGLCanvas"), { ssr: false });

function HomeContent() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { start: startScroll } = useLenis();

  const handleLoadingComplete = useCallback(() => {
    setLoadingComplete(true);
    // Start Lenis smooth scroll
    startScroll();
    // Reveal navbar and hero elements with choreographed animation
    revealAfterLoading();
    // Start ambient sound
    window.dispatchEvent(new Event("ambientSound:start"));
  }, [startScroll]);

  return (
    <>
      {!loadingComplete && <LoadingSequence onComplete={handleLoadingComplete} />}

      <WebGLCanvas />

      <Navbar onMenuToggle={() => setMenuOpen(true)} />
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <SplitTypeInit />
      <AnimationController />
      <div className="scrollSection" data-scroll-target="intro" data-scroll data-scroll-event-progress="sectionProgress" data-scroll-offset="0%,100%">
        <HeroSection />
        <SportSection />
      </div>
      <SphereLabSection />
      <JoinSection />
      <InvestSection />

      <div className="scrollingMask" />
      <Circles />
      <Panels />
      <CustomCursor />

      <Footer />
    </>
  );
}

export default function HomePage() {
  const handleScroll = useCallback(
    (args: { scroll: number; limit: number; velocity: number; direction: number; progress: number }) => {
      scrollEvents.emit("scrollUpdate", args);
    },
    []
  );

  return (
    <LenisProvider onScroll={handleScroll}>
      <CircleStateProvider>
        <HomeContent />
      </CircleStateProvider>
    </LenisProvider>
  );
}
