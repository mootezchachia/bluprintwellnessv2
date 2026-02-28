"use client";

import { recognitionContent } from "@/data/content";

export default function RecognitionSection() {
  const { slides, label } = recognitionContent;

  return (
    <div
      className="pSection_sub recognition"
      data-scroll
      data-scroll-target="customers"
      data-scroll-call="activateSection"
      data-scroll-event-progress="recognition"
      data-scroll-repeat
      data-scroll-offset="0%,100%"
    >
      {/* WebGL morph: manifesto → brands */}
      <div
        className="sectionTransition"
        data-scroll
        data-scroll-event-progress="sectionTransition"
        data-scroll-offset="0%,100%"
        data-from="manifesto"
        data-to="brands"
      />

      <div className="pSection_sticky">
        {/* Small label top-left */}
        <p className="recognition_label">{label}</p>

        {/* Stacked full-screen title slides — AnimationController cycles these */}
        <div className="recognition_titles">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`recognition_title${i === 0 ? " active" : ""}`}
            >
              {/* Big stat number  e.g. "+30%", "60%", "350%" */}
              <div className="recognition_title_stat">
                <div className="line">
                  <span className="word">{slide.stat}</span>
                </div>
              </div>

              {/* Stat sub-label  e.g. "Strength Results" */}
              <div className="recognition_title_sub">
                <div className="line">
                  {slide.statLabel.split(" ").map((w, wi) => (
                    <span key={wi} className="word">
                      {w}&nbsp;
                    </span>
                  ))}
                </div>
              </div>

              {/* Body paragraph */}
              <div className="recognition_title_body">
                <div className="line">
                  <span className="word">{slide.body}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom nav pills */}
        <div className="recognition_nav">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`recognition_nav_item${i === 0 ? " active" : ""}`}
            >
              <span className="recognition_nav_num">{slide.navNum}</span>
              <span className="recognition_nav_label">{slide.navLabel}</span>
              <div className="recognition_nav_progress">
                <div className="recognition_nav_progress_bar" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: visible stat titles below nav */}
        <div className="recognition_nav_mobileTitles">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`recognition_nav_mobileTitles_item${i === 0 ? " active" : ""}`}
            >
              {slide.stat}
            </div>
          ))}
        </div>
      </div>

      <div
        className="parentFade"
        data-scroll
        data-scroll-event-progress="parentFade"
        data-scroll-offset="0%,100%"
      />
    </div>
  );
}
