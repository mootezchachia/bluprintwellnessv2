"use client";

import { useRef, useEffect, useState } from "react";
import { heroContent } from "@/data/content";
import ButtonDiscover from "@/components/ui/ButtonDiscover";
import { scrollEvents } from "@/lib/scroll-events";

export default function HeroSection() {
  const [step, setStep] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollBtnRef = useRef<HTMLButtonElement>(null);
  const [scrollVisible, setScrollVisible] = useState(false);

  useEffect(() => {
    // Show scroll button after a delay
    const timer = setTimeout(() => setScrollVisible(true), 3000);

    // Listen for step triggers
    const handleStep = (data: { step: string }) => {
      setStep(parseInt(data.step, 10));
    };
    scrollEvents.on("triggerStep", handleStep);

    return () => {
      clearTimeout(timer);
      scrollEvents.off("triggerStep", handleStep);
    };
  }, []);

  const titleLines = (text: string) => text.split("\n").map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ));

  return (
      <div ref={sectionRef} className="pSection pSection--hero" data-step={step}>
        <div className="pSection_progress" data-scroll-target="hero" data-scroll data-scroll-call="activateSection" data-scroll-repeat data-scroll-offset="0%,100%" />
        <div className="pSection_triggerCircles" data-scroll data-scroll-call="triggerCircles" data-scroll-repeat data-state="0" data-scroll-offset="50%,50%" />
        <div className="pSection_triggeSteps" data-scroll data-scroll-call="triggerStep" data-scroll-repeat data-step="1" data-scroll-offset="50%,50%" />
        <div className="pSection_triggeSteps" data-scroll data-scroll-call="triggerStep" data-scroll-repeat data-step="2" data-scroll-offset="50%,50%" style={{ top: '50%' }} />
        <div className="pSection_progress pSection_progress--blur" data-scroll data-scroll-event-progress="heroBlur" data-scroll-offset="0%,50%" />
        <div className="pSection_target" data-scroll-target="hero-step2" />
        <div className="heroBlur" />

        <div className="hero">
          <div className="pSection_header">
            <div className="pSection_header_inner">
              <div className="pSection_header_content">
                <div className="pSection_header_title">
                  <h1 className="hero_titles">
                    {heroContent.titles.map((t) => (
                      <span key={t.step} data-step={t.step} data-split="lines,words" style={t.step === 2 ? { opacity: step >= 2 ? 1 : 0 } : undefined}>
                        {titleLines(t.text)}
                      </span>
                    ))}
                  </h1>
                </div>
                <div className="pSection_header_additional">
                  <div className="st3" data-split>{heroContent.subtitle}</div>
                </div>
              </div>
              <div className="pSection_header_footer">
                <div className="pSection_header_actions" />
                <div className="pSection_header_discover">
                  <ButtonDiscover label={heroContent.discoverLabel} scrollTo="sport" />
                </div>
              </div>
            </div>

            <button
              ref={scrollBtnRef}
              type="button"
              className={`hero_scroll ${scrollVisible ? "visible" : ""}`}
              data-scroll-to="hero-step2"
              onClick={() => {
                const target = document.querySelector('[data-scroll-target="hero-step2"]');
                if (target) target.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="hero_scroll_label" data-split="chars">{heroContent.scrollLabel}</span>
              <svg width="16" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1a1 1 0 0 0-2 0h2ZM7.293 31.707a1 1 0 0 0 1.414 0l6.364-6.364a1 1 0 0 0-1.414-1.414L8 29.586l-5.657-5.657A1 1 0 0 0 .93 25.343l6.364 6.364ZM7 1v30h2V1H7Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="parentFade" data-scroll data-scroll-event-progress="parentFade" data-fade-target=".hero" data-scroll-offset="0%,100%" />
      </div>
  );
}
