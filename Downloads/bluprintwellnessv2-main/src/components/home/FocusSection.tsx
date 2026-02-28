"use client";

import { focusContent } from "@/data/content";
import Accordion from "@/components/ui/Accordion";

export default function FocusSection() {
  return (
    <div className="pSection_sub sphereFocus" data-scroll-target="focus" data-scroll data-scroll-call="togglePanel" data-scroll-offset="5%,80%" data-scroll-repeat data-panel="left">
      <div className="sectionTransition" data-scroll data-scroll-event-progress="sectionTransition" data-scroll-offset="0%,100%" data-from="experimentation" data-to="focus" />
      <div className="sphereFocus_progress sphereFocus_progress--contents" data-scroll data-scroll-event-progress="collapseProgress" data-collapse="focus" data-scroll-offset="100%,100%" />
      <div className="pSection_triggerCircles" data-scroll data-scroll-call="triggerCircles" data-scroll-repeat data-state="7" data-scroll-offset="5%,50%" />

      <div className="pSection_sticky sphereFocus_contents">
        <div className="container">
          <div className="row row--bottom">
            <div className="col-3 col-md-4 col-xs-8">
              <Accordion
                items={focusContent.items}
                collapseName="focus"
                variant="cols"
              />
            </div>
            <div className="col-4 col-md-3 offset-1 offset-md-0 hide-sm">
              <div
                className="sphereTitle sphereTitle--right"
                data-split
                data-scroll
                data-scroll-call="sphereTitle"
                data-scroll-offset="15%"
              >
                {focusContent.sideTitle}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="parentFade" data-scroll data-scroll-event-progress="parentFade" data-scroll-offset="0%,100%" />
    </div>
  );
}
