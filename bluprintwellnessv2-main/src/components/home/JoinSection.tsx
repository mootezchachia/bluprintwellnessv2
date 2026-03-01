"use client";

import { joinContent } from "@/data/content";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

export default function JoinSection() {
  return (
    <div className="pSection pSection--join">
      <div className="pSection_progress" data-scroll-target="join" data-scroll data-scroll-call="activateSection" data-scroll-event-progress="sectionProgress" data-scroll-repeat data-scroll-offset="0%,100%" />
      <div className="sectionTransition" data-scroll data-scroll-event-progress="sectionTransition" data-scroll-offset="0%,100%" data-from="focus" data-to="join" />

      <SectionHeader
        label={joinContent.label}
        title={joinContent.title}
        body={joinContent.body}
        actions={<Button href={joinContent.ctaHref}>{joinContent.ctaLabel}</Button>}
        discoverLabel={joinContent.discoverLabel}
        discoverTarget="invest"
      />
    </div>
  );
}
