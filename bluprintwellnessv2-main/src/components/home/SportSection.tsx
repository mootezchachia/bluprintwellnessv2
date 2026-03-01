"use client";

import { sportContent } from "@/data/content";
import SectionHeader from "@/components/ui/SectionHeader";
import ManifestoSection from "./ManifestoSection";
import RecognitionSection from "./RecognitionSection";

export default function SportSection() {
  return (
    <div className="pSection pSection--sport" data-scroll-target="sport">
      <div className="sectionTransition" data-scroll data-scroll-event-progress="sectionTransition" data-scroll-offset="0%,100%" data-from="hero" data-to="sport" />

      <SectionHeader
        label={sportContent.label}
        title={sportContent.title}
        body={sportContent.body}
        discoverLabel={sportContent.discoverLabel}
        discoverTarget="manifesto"
        triggerCirclesState="1"
      />

      <ManifestoSection />
      <RecognitionSection />
    </div>
  );
}
