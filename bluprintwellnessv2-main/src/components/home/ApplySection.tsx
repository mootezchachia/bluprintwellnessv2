"use client";

import { applyContent } from "@/data/content";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

export default function ApplySection() {
  return (
    <div className="pSection pSection--apply">
      <div className="pSection_progress" data-scroll-target="apply" data-scroll data-scroll-call="activateSection" data-scroll-event-progress="sectionProgress" data-scroll-repeat data-scroll-offset="0%,100%" />
      <div className="sectionTransition" data-scroll data-scroll-event-progress="sectionTransition" data-scroll-offset="0%,100%" data-from="invest" data-to="apply" />

      <SectionHeader
        label={applyContent.label}
        title={applyContent.title}
        body={applyContent.body}
        actions={<Button href="/apply">{applyContent.ctaLabel}</Button>}
        discoverLabel={applyContent.discoverLabel}
        discoverTarget="footer"
      />

      <div className="pSection_sub joinInvest" data-scroll-target="applyLink">
        <div className="container">
          <div className="joinInvest_contact">
            <div className="joinInvest_contact_link ls-appear" data-scroll data-scroll-offset="20%">
              <a href="/apply">
                <span data-split="chars">{applyContent.linkText}</span>
                <span data-split="chars">{applyContent.linkText}</span>
              </a>
              <span className="joinInvest_contact_link_border" />
            </div>
            <div className="parentFade" data-scroll data-scroll-event-progress="parentFade" data-scroll-offset="0%,100%" />
          </div>
        </div>
      </div>
    </div>
  );
}
