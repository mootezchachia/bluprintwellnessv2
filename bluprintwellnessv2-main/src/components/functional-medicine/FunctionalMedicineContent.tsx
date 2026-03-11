"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { funcMedContent } from "@/data/content";
import { scrollEvents } from "@/lib/scroll-events";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import ButtonDiscover from "@/components/ui/ButtonDiscover";

/* ── Service icon map ── */
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  consultation: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="16" cy="10" r="5" /><path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" />
    </svg>
  ),
  iv: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="12" y="2" width="8" height="12" rx="2" /><path d="M16 14v6m16 10H16m0 0-4-4m4 4 4-4" />
    </svg>
  ),
  lab: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 4v10l-6 12a2 2 0 002 2h16a2 2 0 002-2l-6-12V4M10 4h12" /><circle cx="18" cy="22" r="2" />
    </svg>
  ),
  regenerative: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4" /><path d="M16 4c-6.627 0-12 5.373-12 12s5.373 12 12 12" strokeDasharray="4 3" /><circle cx="16" cy="16" r="4" />
    </svg>
  ),
};

export default function FunctionalMedicineContent() {
  const manifestoRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  // Manifesto-style word reveal — render spans in JSX to avoid flash
  const fullBio = funcMedContent.doctor.bio + (funcMedContent.doctor.bioExtended ? " " + funcMedContent.doctor.bioExtended : "");
  const bioWords = fullBio.split(/\s+/);

  useEffect(() => {
    const el = manifestoRef.current;
    if (!el) return;
    // Collect span refs from rendered DOM
    wordsRef.current = Array.from(el.querySelectorAll<HTMLSpanElement>(".word"));

    const handleProgress = (progress: number) => {
      const allWords = wordsRef.current;
      const total = allWords.length;
      allWords.forEach((w, i) => {
        if (progress > i / total) {
          w.classList.add("active");
        } else {
          w.classList.remove("active");
        }
      });
    };
    scrollEvents.on("funcMedReadText", handleProgress);
    return () => scrollEvents.off("funcMedReadText", handleProgress);
  }, []);

  // Bridge the funcMedReadText window event to scrollEvents
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.progress !== undefined) {
        scrollEvents.emit("funcMedReadText", detail.progress);
      }
    };
    window.addEventListener("funcMedReadText", handler);
    return () => window.removeEventListener("funcMedReadText", handler);
  }, []);

  return (
    <main className="funcMedPage">
      {/* Back nav */}
      <nav className="funcMed_nav">
        <Link href="/" className="funcMed_back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span>Home</span>
        </Link>
      </nav>

      {/* ── Hero Section — custom (no scroll-call animation) ── */}
      <div className="pSection pSection--funcMedHero">
        <div className="funcMed_heroGlow" />
        <div className="pSection_header funcMed_heroHeader" data-scroll data-scroll-offset="85%">
          <div className="pSection_header_inner">
            <div className="pSection_header_content">
              <div className="pSection_header_title">
                <span className="st4">{funcMedContent.hero.label}</span>
                <h1 className="st1">
                  {funcMedContent.hero.title.split("\n").map((line, i, arr) => (
                    <span key={i} style={{ display: "block" }}>
                      {line}
                    </span>
                  ))}
                </h1>
              </div>
              <div className="pSection_header_additional">
                <div className="st3">{funcMedContent.hero.body}</div>
              </div>
            </div>
            <div className="pSection_header_footer">
              <div className="pSection_header_actions">
                <Button href="/apply">Begin Your Journey</Button>
              </div>
              <div className="pSection_header_discover">
                <ButtonDiscover label="Meet Your Guide" scrollTo="funcMedDoctor" />
              </div>
            </div>
          </div>
          <div className="parentFade" data-scroll data-scroll-event-progress="parentFade" data-scroll-offset="0%,100%" />
        </div>
      </div>

      {/* ── Section divider ── */}
      <div className="funcMed_divider" />

      {/* ── Doctor Bio — sticky split with word reveal ── */}
      <div className="pSection pSection--funcMedDoctor">
        <div className="pSection_sub funcMed_doctorContent">
          <div className="funcMed_doctorProgress" data-scroll data-scroll-event-progress="funcMedReadText" data-scroll-offset="0%,100%" />
          <div className="pSection_sticky" data-scroll-target="funcMedDoctor">
            <div className="container">
              <div className="funcMed_doctor">
                <div className="funcMed_doctor_image ls-cover ls-cover--btt" data-scroll data-scroll-offset="20%">
                  <img
                    src="/images/functional-medicine/dr-lain-lye.jpg"
                    alt="Dr. Lain Lye, ND — Naturopathic Doctor"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="funcMed_doctor_info">
                  <span className="st4 funcMed_doctorLabel ls-appear" data-scroll data-scroll-offset="20%">Meet Your Guide</span>
                  <h2 className="funcMed_doctorName ls-appear" data-scroll data-scroll-offset="15%">
                    {funcMedContent.doctor.name}
                  </h2>
                  <p className="funcMed_doctorTitle ls-appear" data-scroll data-scroll-offset="15%">{funcMedContent.doctor.title}</p>
                  <div
                    ref={manifestoRef}
                    className="funcMed_doctorManifesto"
                  >
                    {bioWords.map((word, i) => (
                      <span key={i}>
                        <span className="word">{word}</span>
                        {i < bioWords.length - 1 ? " " : ""}
                      </span>
                    ))}
                  </div>
                  <div className="funcMed_doctor_credentials ls-stagger">
                    {funcMedContent.doctor.credentials.map((c, i) => (
                      <div key={i} className="funcMed_credential ls-appear" data-scroll data-scroll-offset="15%">
                        <div className="funcMed_credential_num">.0{i + 1}</div>
                        <div className="funcMed_credential_title">{typeof c === "string" ? c : c.title}</div>
                        {typeof c !== "string" && c.body && (
                          <div className="funcMed_credential_body">{c.body}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* parentFade on doctor section exit */}
          <div className="parentFade" data-scroll data-scroll-event-progress="parentFade" data-scroll-offset="0%,100%" />
        </div>
      </div>

      {/* ── Section divider ── */}
      <div className="funcMed_divider" />

      {/* ── Journey — vertical timeline ── */}
      <div className="pSection pSection--funcMedJourney">
        <SectionHeader
          label="Your Wellness Journey"
          title={"Five Steps To\nOptimal Health"}
          body="A structured, science-backed pathway from initial consultation through ongoing optimization — personalized at every stage."
          discoverLabel="Our Services"
          discoverTarget="funcMedServices"
        />

        <div className="pSection_sub funcMed_journeySub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="funcMed_timeline">
                {funcMedContent.journey.items.map((item, i) => (
                  <div key={i} className="funcMed_timelineStep ls-appear" data-scroll data-scroll-offset="15%">
                    <div className="funcMed_timelineStep_indicator">
                      <span className="funcMed_timelineStep_num">{item.num}</span>
                      <div className="funcMed_timelineStep_line" />
                    </div>
                    <div className="funcMed_timelineStep_content">
                      <h3 className="funcMed_timelineStep_title">{item.title.replace(/\n/g, ' ')}</h3>
                      <p className="funcMed_timelineStep_body">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section divider ── */}
      <div className="funcMed_divider" />

      {/* ── Services Grid ── */}
      <div className="pSection pSection--funcMedServices" data-scroll-target="funcMedServices">
        <div className="pSection_sub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="funcMed_servicesHeader ls-appear" data-scroll data-scroll-offset="15%">
                <span className="st4">Our Offerings</span>
                <h2 className="st2 funcMed_servicesTitle" data-split>Precision<br />Wellness Services</h2>
              </div>
              <div className="funcMed_services ls-stagger">
                {funcMedContent.services.map((service, i) => (
                  <div key={i} className="funcMed_service ls-appear" data-scroll data-scroll-offset="15%">
                    <div className="funcMed_service_icon">
                      {SERVICE_ICONS[service.icon] || SERVICE_ICONS.consultation}
                    </div>
                    <div className="funcMed_service_num">.0{i + 1}</div>
                    <h3 className="funcMed_service_title">{service.title}</h3>
                    <p className="funcMed_service_body">{service.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section divider ── */}
      <div className="funcMed_divider" />

      {/* ── Partnership ── */}
      <div className="pSection pSection--funcMedPartnership" data-scroll-target="funcMedPartnership">
        <div className="pSection_sub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="funcMed_partnershipCard">
                <div className="funcMed_partnershipLayout">
                  <div className="funcMed_partnershipContent ls-appear" data-scroll data-scroll-offset="15%">
                    <span className="st4">Our Partner</span>
                    <h2 className="st2 funcMed_partnershipTitle" data-split>Amplify Health<br />&amp; Wellness</h2>
                    <p className="st3 funcMed_partnershipBody">{funcMedContent.partnership.body}</p>
                  </div>
                  <div className="funcMed_partnership_logo ls-appear" data-scroll data-scroll-offset="15%">
                    <a href={funcMedContent.partnership.href} target="_blank" rel="noopener noreferrer">
                      <img
                        src="/images/brands/amplify.png"
                        alt="Amplify Health and Wellness"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA with ambient glow ── */}
      <div className="pSection pSection--funcMedCta">
        <div className="funcMed_ctaGlow" />
        <div className="pSection_sub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="funcMed_ctaInner ls-appear" data-scroll data-scroll-offset="15%">
                <span className="st4">{funcMedContent.cta.label}</span>
                <h2 className="st1 funcMed_ctaTitle">
                  {funcMedContent.cta.title.split("\n").map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </h2>
                <p className="funcMed_ctaBody">{funcMedContent.cta.body}</p>
                <Button href={funcMedContent.cta.ctaHref}>{funcMedContent.cta.ctaLabel}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="funcMed_footer">
        <div className="container">
          <Link href="/" className="funcMed_footerLink">
            <span>&larr; Back to Bluprint Wellness</span>
          </Link>
        </div>
      </footer>
    </main>
  );
}
