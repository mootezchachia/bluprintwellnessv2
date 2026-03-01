"use client";

import { recognitionContent } from "@/data/content";

export default function RecognitionSection() {
  const { slides, label } = recognitionContent;

  return (
    <div
      className="pSection_sub recognition"
      data-scroll-target="customers"
    >
      {/* Scroll progress tracker — drives carousel via AnimationController */}
      <div
        className="recognition_progress"
        data-scroll
        data-scroll-event-progress="recognition"
        data-scroll-repeat
        data-scroll-offset="100%,100%"
      />

      {/* Activation call for navbar + step changes */}
      <div
        className="recognition_activate"
        data-scroll
        data-scroll-call="activateSection"
        data-scroll-target="customers"
        data-scroll-offset="20%"
      />

      <div className="pSection_sticky">
        <div className="recognition_carousel">
          {/* Titles area */}
          <div className="recognition_titles">
            <span
              className="st4 ls-appear"
              data-scroll
              data-scroll-offset="20%"
              data-split
            >
              {label}
            </span>

            {slides.map((slide, i) => (
              <div
                key={i}
                className={`recognition_title${i === 0 ? " active" : ""}`}
                data-index={i}
                data-split
              >
                {slide.body}
              </div>
            ))}
          </div>

          {/* Navigation row */}
          <div className="recognition_nav">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`recognition_nav_item ls-appear${i === 0 ? " active" : ""}`}
                data-index={i}
                data-scroll
                data-scroll-offset="0%"
              >
                <span className="recognition_nav_num">{slide.navNum}</span>
                <span className="recognition_nav_progress">
                  <span className="recognition_nav_progress_bar" />
                </span>
                <span className="recognition_nav_label">{slide.navLabel}</span>
              </div>
            ))}

            {/* Mobile titles */}
            <div
              className="recognition_nav_mobileTitles ls-appear"
              data-scroll
              data-scroll-offset="0%"
            >
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className={`recognition_nav_mobileTitles_item${i === 0 ? " active" : ""}`}
                  data-index={i}
                >
                  <span className="recognition_nav_mobileTitles_item_label">
                    {slide.navLabel}
                  </span>
                  <span className="recognition_nav_mobileTitles_item_num">
                    {slide.navNum}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand overlay (shown on last slide) */}
      <div className="recognition_brands">
        <div className="recognition_brands_cartouche">
          <img src="/images/brands/maddle.svg" alt="" loading="lazy" data-brand="maddle" />
          <img src="/images/brands/mw.svg" alt="" loading="lazy" data-brand="mw" />
          <img src="/images/brands/ascend.svg" alt="" loading="lazy" data-brand="ascend" />
          <img src="/images/brands/nordik.svg" alt="" loading="lazy" data-brand="nordik" />
        </div>
      </div>

      {/* Fade out at bottom */}
      <div
        className="parentFade"
        data-scroll
        data-scroll-event-progress="parentFade"
        data-scroll-offset="0%,100%"
      />
    </div>
  );
}
