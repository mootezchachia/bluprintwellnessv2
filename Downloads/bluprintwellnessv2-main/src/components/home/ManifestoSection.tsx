"use client";

import { useEffect, useRef } from "react";
import { manifestoContent } from "@/data/content";
import { scrollEvents } from "@/lib/scroll-events";

export default function ManifestoSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    // Split text into words on mount
    const el = contentRef.current;
    if (!el) return;

    const text = manifestoContent.text;
    const words = text.split(/\s+/);
    el.innerHTML = "";
    wordsRef.current = [];

    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode(" "));
      }
      wordsRef.current.push(span);
    });

    // Listen to scroll progress
    const handleProgress = (progress: number) => {
      const words = wordsRef.current;
      const totalWords = words.length;
      words.forEach((word, i) => {
        const wordProgress = i / totalWords;
        if (progress > wordProgress) {
          word.classList.add("active");
        } else {
          word.classList.remove("active");
        }
      });
    };
    scrollEvents.on("readText", handleProgress);
    return () => scrollEvents.off("readText", handleProgress);
  }, []);

  return (
    <div className="pSection_sub manifesto" data-scroll-target="manifesto" data-scroll data-scroll-event-progress="readText" data-scroll-offset="100%,100%" data-steps="0 10 20">
      <div className="sectionTransition" data-scroll data-scroll-event-progress="sectionTransition" data-scroll-offset="0%,100%" data-from="sport" data-to="manifesto" />
      <div className="pSection_triggerCircles" data-scroll data-scroll-call="triggerCircles" data-scroll-repeat data-state="2" data-scroll-offset="50%,50%" />
      <div className="pSection_sticky">
        <div className="container">
          <div className="row">
            <div className="col-3 offset-5 col-sm-4 offset-sm-4 col-xs-8 offset-xs-0">
              <div ref={contentRef} className="st2 manifesto_content">
                {manifestoContent.text}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="parentFade" data-scroll data-scroll-event-progress="parentFade" data-scroll-offset="0%,100%" />
    </div>
  );
}
