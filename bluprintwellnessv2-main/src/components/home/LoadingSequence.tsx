"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

const LOADING_IMAGES = [
  "/images/desktop/hero.webp",
  "/images/desktop/customer-1.webp",
  "/images/desktop/customer-2.webp",
  "/images/desktop/customer-3.webp",
  "/images/desktop/customer-4.webp",
  "/images/desktop/focus-1.webp",
  "/images/desktop/focus-2.webp",
  "/images/desktop/focus-3.webp",
  "/images/desktop/focus-4.webp",
];

interface LoadingSequenceProps {
  onComplete: () => void;
}

export default function LoadingSequence({ onComplete }: LoadingSequenceProps) {
  const [phase, setPhase] = useState<"active" | "done">("active");
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Preload images
    LOADING_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const container = containerRef.current;
    const icon = iconRef.current;
    const pulse = pulseRef.current;
    const wordmark = wordmarkRef.current;
    const subline = sublineRef.current;
    const items = container?.querySelectorAll(".loading_sequence_item");
    if (!container || !icon || !pulse || !wordmark || !subline || !items) return;

    const letters = wordmark.querySelectorAll(".loading_letter");

    // Phase 1 (300ms): B icon fades in with scale
    setTimeout(() => {
      animate(icon, {
        opacity: [0, 1],
        scale: [1.15, 1],
        duration: 900,
        ease: "outExpo",
      });
    }, 300);

    // Phase 2 (1000ms): Background images start appearing
    setTimeout(() => {
      animate(items, {
        scale: [1.5, 1],
        opacity: [0, 1],
        rotate: [8, 0],
        duration: 800,
        ease: "outExpo",
        delay: stagger(120, { start: 0 }),
      });
    }, 1000);

    // Phase 3 (1200ms): Pulse ring expands from icon
    setTimeout(() => {
      animate(pulse, {
        scale: [0.5, 3],
        opacity: [0.6, 0],
        duration: 1200,
        ease: "outExpo",
      });
    }, 1200);

    // Phase 4 (1800ms): Letters cascade in one by one
    setTimeout(() => {
      animate(letters, {
        translateY: ["110%", "0%"],
        opacity: [0, 1],
        duration: 700,
        ease: "outExpo",
        delay: stagger(50),
      });
    }, 1800);

    // Phase 5 (2600ms): "WELLNESS" subline fades in
    setTimeout(() => {
      animate(subline, {
        opacity: [0, 1],
        translateY: [10, 0],
        letterSpacing: ["0.3em", "0.5em"],
        duration: 800,
        ease: "outExpo",
      });
    }, 2600);

    // Phase 6 (3600ms): Everything scales up + blurs away
    setTimeout(() => {
      const brandGroup = container.querySelector(".loading_brand");
      if (brandGroup) {
        animate(brandGroup, {
          scale: [1, 1.15],
          opacity: [1, 0],
          filter: ["blur(0px)", "blur(30px)"],
          duration: 700,
          ease: "outExpo",
        });
      }
    }, 3600);

    // Phase 7 (4000ms): Container hides
    setTimeout(() => {
      container.classList.add("hidden");
    }, 4100);

    // Phase 8 (4100ms): Complete
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 4200);
  }, [onComplete]);

  if (phase === "done") return null;

  const wordmarkText = "BLUPRINT";

  return (
    <div ref={containerRef} className="loading">
      {/* Background image montage */}
      <div className="loading_sequence">
        <div className="loading_sequence_mask" />
        <div className="loading_sequence_items">
          {LOADING_IMAGES.map((src, i) => (
            <div
              key={i}
              className="loading_sequence_item"
              style={{ backgroundImage: `url(${src})`, opacity: 0 }}
            />
          ))}
        </div>
      </div>

      {/* Brand reveal group */}
      <div className="loading_brand">
        {/* B icon mark */}
        <div ref={iconRef} className="loading_icon" style={{ opacity: 0 }}>
          <img src="/images/logo-small.svg" alt="" />
        </div>

        {/* Pulse ring */}
        <div ref={pulseRef} className="loading_pulse" />

        {/* BLUPRINT wordmark */}
        <div ref={wordmarkRef} className="loading_wordmark">
          {wordmarkText.split("").map((char, i) => (
            <span key={i} className="loading_letter" style={{ opacity: 0 }}>
              {char}
            </span>
          ))}
        </div>

        {/* WELLNESS subline */}
        <div ref={sublineRef} className="loading_subline" style={{ opacity: 0 }}>
          WELLNESS
        </div>
      </div>
    </div>
  );
}
