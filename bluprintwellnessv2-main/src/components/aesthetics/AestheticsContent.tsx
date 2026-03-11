"use client";

import Link from "next/link";
import { aestheticsContent } from "@/data/content";
import Button from "@/components/ui/Button";
import ButtonDiscover from "@/components/ui/ButtonDiscover";

/* ── Service icon map ── */
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  morpheus: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="8" cy="8" r="1.5" /><circle cx="16" cy="8" r="1.5" /><circle cx="24" cy="8" r="1.5" />
      <circle cx="8" cy="16" r="1.5" /><circle cx="16" cy="16" r="1.5" /><circle cx="24" cy="16" r="1.5" />
      <circle cx="8" cy="24" r="1.5" /><circle cx="16" cy="24" r="1.5" /><circle cx="24" cy="24" r="1.5" />
    </svg>
  ),
  injectables: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M20 4l8 8-14 14-8-8L20 4z" /><path d="M18 6l8 8" /><path d="M6 26l-2 2" /><path d="M14 10l8 8" />
    </svg>
  ),
  laser: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="16" cy="16" r="6" /><circle cx="16" cy="16" r="2" />
      <path d="M16 2v6M16 24v6M2 16h6M24 16h6" />
      <path d="M6.1 6.1l4.24 4.24M21.66 21.66l4.24 4.24M6.1 25.9l4.24-4.24M21.66 10.34l4.24-4.24" />
    </svg>
  ),
};

export default function AestheticsContent() {
  const featured = aestheticsContent.services[0]; // Morpheus8
  const secondary = aestheticsContent.services.slice(1); // Injectables + Laser

  return (
    <main className="aestheticsPage">
      {/* Back nav */}
      <nav className="aesthetics_nav">
        <Link href="/" className="aesthetics_back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 4l-6 6 6 6" />
          </svg>
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* ══ HERO ══ */}
      <div className="pSection pSection--aestheticsHero">
        <div className="aesthetics_heroImage">
          <img
            src={aestheticsContent.hero.image}
            alt="Morpheus8 precision device"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="aesthetics_heroGlow" />
        <div className="pSection_header aesthetics_heroHeader" data-scroll data-scroll-offset="85%">
          <div className="pSection_header_inner">
            <div className="pSection_header_content">
              <div className="pSection_header_title">
                <span className="st4">{aestheticsContent.hero.tagline}</span>
                <h1 className="st1">
                  {aestheticsContent.hero.title.split("\n").map((line, i) => (
                    <span key={i} style={{ display: "block" }}>{line}</span>
                  ))}
                </h1>
              </div>
              <div className="pSection_header_additional">
                <p className="st3">{aestheticsContent.hero.body}</p>
              </div>
            </div>
          </div>
          <div className="pSection_header_footer">
            <Button href="/apply">Begin Your Journey</Button>
            <ButtonDiscover label="Meet Your Specialist" scrollTo="aestheticsProvider" />
          </div>
        </div>
        <div className="parentFade" data-scroll data-scroll-event-progress="parentFade" data-scroll-offset="0%,100%" />
      </div>

      {/* ══ PROVIDER ══ */}
      <div className="pSection pSection--aestheticsProvider" id="aestheticsProvider">
        <div className="aesthetics_divider" />
        <div className="pSection_sub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="aesthetics_provider">
                <div className="aesthetics_provider_image ls-cover ls-cover--btt" data-scroll data-scroll-offset="15%">
                  <img
                    src="/images/desktop/focus-4.webp"
                    alt={aestheticsContent.provider.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="aesthetics_provider_info">
                  <span className="st4 ls-appear" data-scroll data-scroll-offset="15%">Meet Your Guide</span>
                  <h2 className="aesthetics_providerName ls-appear" data-scroll data-scroll-offset="15%">{aestheticsContent.provider.name}</h2>
                  <p className="aesthetics_providerTitle ls-appear" data-scroll data-scroll-offset="15%">{aestheticsContent.provider.title}</p>
                  <p className="aesthetics_providerBio ls-appear" data-scroll data-scroll-offset="15%">{aestheticsContent.provider.bio}</p>
                  <div className="aesthetics_credentials">
                    {aestheticsContent.provider.credentials.map((cred, i) => (
                      <div key={i} className="aesthetics_credential ls-appear" data-scroll data-scroll-offset="15%">
                        <span className="aesthetics_credential_title">{cred.title}</span>
                        <span className="aesthetics_credential_body">{cred.body}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="aesthetics_divider" />
      </div>

      {/* ══ SERVICES — editorial showcase ══ */}
      <div className="pSection pSection--aestheticsServices" id="aestheticsServices">
        <div className="pSection_sub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="aesthetics_servicesHeader ls-appear" data-scroll data-scroll-offset="15%">
                <span className="st4">Signature Services</span>
                <h2 className="st2">
                  {"Our Signature\nTreatments".split("\n").map((line, i) => (
                    <span key={i} style={{ display: "block" }}>{line}</span>
                  ))}
                </h2>
              </div>

              {/* Featured service — Morpheus8 — large split layout */}
              <div className="aesthetics_serviceFeatured ls-appear" data-scroll data-scroll-offset="15%">
                <div className="aesthetics_serviceFeatured_image ls-cover ls-cover--btt" data-scroll data-scroll-offset="10%">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="aesthetics_serviceFeatured_content">
                  <div className="aesthetics_service_icon">{SERVICE_ICONS[featured.icon]}</div>
                  <span className="aesthetics_service_tag">{featured.tag}</span>
                  <h3 className="aesthetics_serviceFeatured_title">{featured.title}</h3>
                  <span className="aesthetics_service_subtitle">{featured.subtitle}</span>
                  <p className="aesthetics_service_body">{featured.body}</p>
                </div>
              </div>

              {/* Secondary services — 2 column */}
              <div className="aesthetics_servicesSecondary">
                {secondary.map((service, i) => (
                  <div key={i} className={`aesthetics_service ${!service.image ? 'aesthetics_service--noImage' : ''} ls-appear`} data-scroll data-scroll-offset="15%">
                    {service.image ? (
                      <div className="aesthetics_service_imageWrap">
                        <img
                          src={service.image}
                          alt={service.title}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : (
                      <div className="aesthetics_service_gradientBg">
                        <div className="aesthetics_service_iconLarge">{SERVICE_ICONS[service.icon]}</div>
                      </div>
                    )}
                    <div className="aesthetics_service_content">
                      {service.image && <div className="aesthetics_service_icon">{SERVICE_ICONS[service.icon]}</div>}
                      <span className="aesthetics_service_tag">{service.tag}</span>
                      <h3 className="aesthetics_service_title">{service.title}</h3>
                      <span className="aesthetics_service_subtitle">{service.subtitle}</span>
                      <p className="aesthetics_service_body">{service.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="aesthetics_divider" />
      </div>

      {/* ══ PHILOSOPHY — pure typographic showpiece ══ */}
      <div className="pSection pSection--aestheticsPhilosophy" id="aestheticsPhilosophy">
        <div className="pSection_sub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="aesthetics_philosophy">
                <div className="aesthetics_philosophy_intro ls-appear" data-scroll data-scroll-offset="15%">
                  <span className="st4">{aestheticsContent.philosophy.eyebrow}</span>
                  <h2 className="st2">
                    {aestheticsContent.philosophy.heading.split("\n").map((line, i) => (
                      <span key={i} style={{ display: "block" }}>{line}</span>
                    ))}
                  </h2>
                  <p className="st3">{aestheticsContent.philosophy.body}</p>
                </div>
                <div className="aesthetics_philosophy_quote ls-appear" data-scroll data-scroll-offset="15%">
                  <span className="aesthetics_quoteMark">&ldquo;</span>
                  <blockquote>{aestheticsContent.philosophy.quote}</blockquote>
                </div>
                <div className="aesthetics_pillars">
                  {aestheticsContent.philosophy.pillars.map((pillar, i) => (
                    <div key={i} className="aesthetics_pillar ls-appear" data-scroll data-scroll-offset="15%">
                      <span className="aesthetics_pillar_num">.0{i + 1}</span>
                      <h3 className="aesthetics_pillar_title">{pillar.title}</h3>
                      <p className="aesthetics_pillar_body">{pillar.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="aesthetics_divider" />
      </div>

      {/* ══ TESTIMONIALS ══ */}
      <div className="pSection pSection--aestheticsTestimonials">
        <div className="pSection_sub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="aesthetics_testimonialsHeader ls-appear" data-scroll data-scroll-offset="15%">
                <span className="st4">{aestheticsContent.testimonials.label}</span>
                <h2 className="st2">
                  {aestheticsContent.testimonials.title.split("\n").map((line, i) => (
                    <span key={i} style={{ display: "block" }}>{line}</span>
                  ))}
                </h2>
              </div>
              <div className="aesthetics_testimonials">
                {aestheticsContent.testimonials.items.map((item, i) => (
                  <div key={i} className="aesthetics_testimonial ls-appear" data-scroll data-scroll-offset="15%">
                    <div className="aesthetics_testimonial_avatar">
                      <span>{item.initials}</span>
                    </div>
                    <blockquote className="aesthetics_testimonial_quote">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="aesthetics_divider" />
      </div>

      {/* ══ CTA ══ */}
      <div className="pSection pSection--aestheticsCta">
        <div className="aesthetics_ctaGlow" />
        <div className="pSection_sub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="aesthetics_ctaInner ls-appear" data-scroll data-scroll-offset="15%">
                <span className="st4">{aestheticsContent.cta.label}</span>
                <h2 className="st1">
                  {aestheticsContent.cta.title.split("\n").map((line, i) => (
                    <span key={i} style={{ display: "block" }}>{line}</span>
                  ))}
                </h2>
                <p className="st3">{aestheticsContent.cta.body}</p>
                <Button href={aestheticsContent.cta.ctaHref}>{aestheticsContent.cta.ctaLabel}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="aesthetics_footer">
        <div className="container">
          <Link href="/" className="aesthetics_back">
            <span>&larr; Back to Home</span>
          </Link>
        </div>
      </footer>
    </main>
  );
}
