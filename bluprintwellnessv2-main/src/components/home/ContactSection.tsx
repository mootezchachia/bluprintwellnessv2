"use client";

import { contactContent } from "@/data/content";

export default function ContactSection() {
  return (
    <div className="pSection_sub joinInvest" data-scroll-target="contact">
      <div className="container">
        <div className="joinInvest_contact">
          <div className="joinInvest_contact_link ls-appear" data-scroll data-scroll-offset="20%">
            <a href={`mailto:${contactContent.email}`} target="_blank" rel="noopener noreferrer">
              <span data-split="chars">{contactContent.linkText}</span>
              <span data-split="chars">{contactContent.linkText}</span>
            </a>
            <span className="joinInvest_contact_link_border" />
          </div>
          {/* parentFade removed — contact section should stay visible */}
        </div>
      </div>
    </div>
  );
}
