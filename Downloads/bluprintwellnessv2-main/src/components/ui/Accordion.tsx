"use client";

interface AccordionItem {
  num: string;
  title: string;
  body: string;
  image?: string;
  desktopImage?: string;
  mobileImage?: string;
}

interface AccordionProps {
  items: AccordionItem[];
  collapseName: string;
  variant?: "media" | "cols";
  className?: string;
}

function TextWithBreaks({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

/**
 * Scroll-driven accordion. The AnimationController handles all state:
 * - `initFirstCollapse` opens the first (default) item on enter
 * - `collapseProgress` switches items based on scroll progress
 * No React state — DOM classes are managed directly by the controller.
 */
export default function Accordion({ items, collapseName, variant = "media", className = "" }: AccordionProps) {
  return (
    <div
      className={`collapses ${className}`}
      data-collapse={collapseName}
      data-scroll
      data-scroll-offset="20%"
      data-scroll-call="initFirstCollapse"
    >
      {items.map((item, i) => {
        const imgSrc = item.image || item.desktopImage;
        return (
          <div
            key={i}
            className={`collapse collapse--${variant}${i === 0 ? " default active" : ""}`}
            data-index={i}
            data-scroll
            data-scroll-offset="5%"
          >
            <div className="collapse_title">
              <div className="collapse_title_num">{item.num}</div>
              <div className="collapse_title_txt" data-split="words">
                <TextWithBreaks text={item.title} />
              </div>
            </div>
            <div className="collapse_content">
              <div className="collapse_content_title" data-split="lines">
                <TextWithBreaks text={item.title} />
              </div>
              <div className="collapse_content_body">
                <div className="collapse_content_txt" data-split="lines">{item.body}</div>
                {imgSrc && (
                  <div className="collapse_content_media">
                    <img src={imgSrc} alt="" loading="lazy" decoding="async" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
