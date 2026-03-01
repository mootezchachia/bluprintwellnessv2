"use client";

import { investContent } from "@/data/content";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import ContactSection from "./ContactSection";

export default function InvestSection() {
  return (
    <div className="pSection pSection--invest">
      <div className="pSection_progress" data-scroll-target="invest" data-scroll data-scroll-call="activateSection" data-scroll-event-progress="sectionProgress" data-scroll-repeat data-scroll-offset="0%,100%" />
      <div className="sectionTransition" data-scroll data-scroll-event-progress="sectionTransition" data-scroll-offset="0%,100%" data-from="join" data-to="invest" />

      <SectionHeader
        title={investContent.title}
        actions={<Button scrollTo="contact">{investContent.ctaLabel}</Button>}
        discoverLabel={investContent.discoverLabel}
        discoverTarget="contact"
      />

      <div className="invest_testimonials ls-stagger">
        {investContent.testimonials.map((t, i) => (
          <div key={i} className="invest_testimonial ls-appear" data-scroll data-scroll-offset="20%">
            <div className="invest_testimonial_quote">&ldquo;{t.quote}&rdquo;</div>
            <div className="invest_testimonial_author">— {t.author}</div>
          </div>
        ))}
      </div>

      <ContactSection />
    </div>
  );
}
