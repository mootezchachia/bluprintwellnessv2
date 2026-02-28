"use client";

import { sphereLabContent } from "@/data/content";
import SectionHeader from "@/components/ui/SectionHeader";
import ExperimentationSection from "./ExperimentationSection";
import FocusSection from "./FocusSection";

export default function SphereLabSection() {
  return (
    <div className="pSection pSection--sphere">
      <div className="pSection_progress" data-scroll-target="sphere" data-scroll data-scroll-call="activateSection" data-scroll-event-progress="sectionProgress" data-scroll-repeat data-scroll-offset="0%,100%" />
      <div className="sectionTransition" data-scroll data-scroll-event-progress="sectionTransition" data-scroll-offset="0%,100%" data-from="brands" data-to="sphere" />

      <SectionHeader
        label={sphereLabContent.label}
        title={sphereLabContent.title}
        titleTag="h2"
        body={sphereLabContent.body}
        discoverLabel={sphereLabContent.discoverLabel}
        discoverTarget="experimentation"
      />

      <ExperimentationSection />
      <FocusSection />
    </div>
  );
}
