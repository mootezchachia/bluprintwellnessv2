"use client";

import ButtonDiscover from "./ButtonDiscover";

interface SectionHeaderProps {
  label?: string;
  title: string;
  titleTag?: "h1" | "h2";
  body?: string;
  actions?: React.ReactNode;
  discoverLabel?: string;
  discoverTarget?: string;
  className?: string;
  triggerCirclesState?: string;
}

function TextWithBreaks({ text, className, dataSplit }: { text: string; className?: string; dataSplit?: string }) {
  const parts = text.split("\n");
  return (
    <span className={className} {...(dataSplit ? { "data-split": dataSplit } : {})}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </span>
  );
}

export default function SectionHeader({
  label, title, titleTag = "h1", body, actions, discoverLabel, discoverTarget, className = "", triggerCirclesState
}: SectionHeaderProps) {
  const TitleTag = titleTag;
  const titleParts = title.split("\n");

  return (
    <div className={`pSection_header ${className}`} data-scroll data-scroll-call="sectionHeader" data-scroll-offset="85%">
      {triggerCirclesState !== undefined && (
        <div className="pSection_triggerCircles" data-scroll data-scroll-call="triggerCircles" data-scroll-repeat data-state={triggerCirclesState} data-scroll-offset="50%,50%" />
      )}
      <div className="pSection_header_inner">
        <div className="pSection_header_content">
          <div className="pSection_header_title">
            {label && <span className="st4">{label}</span>}
            <TitleTag className="st1" data-split>
              {titleParts.map((part, i) => (
                <span key={i}>
                  {part}
                  {i < titleParts.length - 1 && <br />}
                </span>
              ))}
            </TitleTag>
          </div>
          {body && (
            <div className="pSection_header_additional">
              <div className="st3" data-split>{body}</div>
            </div>
          )}
        </div>
        <div className="pSection_header_footer">
          <div className="pSection_header_actions">{actions}</div>
          <div className="pSection_header_discover">
            {discoverLabel && discoverTarget && (
              <ButtonDiscover label={discoverLabel} scrollTo={discoverTarget} />
            )}
          </div>
        </div>
      </div>
      <div className="parentFade" data-scroll data-scroll-event-progress="parentFade" data-scroll-offset="0%,100%" />
    </div>
  );
}
