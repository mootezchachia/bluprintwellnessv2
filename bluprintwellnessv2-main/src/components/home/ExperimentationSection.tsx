"use client";

import { experimentationContent } from "@/data/content";
import Accordion from "@/components/ui/Accordion";

export default function ExperimentationSection() {
  return (
    <div className="pSection_sub sphereExperimentation" data-scroll data-scroll-call="togglePanel" data-scroll-offset="30%,65%" data-scroll-repeat data-panel="right">
      <div className="sectionTransition" data-scroll data-scroll-event-progress="sectionTransition" data-scroll-offset="0%,100%" data-from="sphere" data-to="experimentation" />
      <div className="sphereExperimentation_progress" data-scroll data-scroll-event-progress="collapseProgress" data-collapse="experimentation" data-scroll-offset="100%,100%" />
      <div className="pSection_triggerCircles" data-scroll data-scroll-call="triggerCircles" data-scroll-repeat data-state="5" data-scroll-offset="50%,50%" />

      <div className="pSection_sticky" data-scroll-target="experimentation">
        <div className="container">
          <div className="row row--bottom">
            <div className="col-4 hide-sm">
              <div
                className="sphereTitle"
                data-split
                data-scroll
                data-scroll-call="sphereTitle"
                data-scroll-offset="15%"
              >
                {experimentationContent.sideTitle.split("\n").map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </div>
            </div>
            <div className="col-3 offset-1 col-md-4 offset-md-0 offset-sm-4 col-xs-8 offset-xs-0">
              <Accordion
                items={experimentationContent.items}
                collapseName="experimentation"
                variant="media"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="parentFade" data-scroll data-scroll-event-progress="parentFade" data-scroll-offset="0%,100%" />
    </div>
  );
}
