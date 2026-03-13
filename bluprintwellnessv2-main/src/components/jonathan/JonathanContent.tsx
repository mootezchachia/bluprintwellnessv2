"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { jonathanContent } from "@/data/content";
import { scrollEvents } from "@/lib/scroll-events";
import Button from "@/components/ui/Button";
import ButtonDiscover from "@/components/ui/ButtonDiscover";

export default function JonathanContent() {
  const manifestoRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const bioWords = jonathanContent.bio.split(/\s+/);

  useEffect(() => {
    const el = manifestoRef.current;
    if (!el) return;
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
    scrollEvents.on("jonathanReadText", handleProgress);
    return () => scrollEvents.off("jonathanReadText", handleProgress);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.progress !== undefined) {
        scrollEvents.emit("jonathanReadText", detail.progress);
      }
    };
    window.addEventListener("jonathanReadText", handler);
    return () => window.removeEventListener("jonathanReadText", handler);
  }, []);

  return (
    <main className="jonathanPage">
      {/* Back nav */}
      <nav className="jonathan_nav">
        <Link href="/" className="jonathan_back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span>Home</span>
        </Link>
      </nav>

      {/* ── Hero — editorial split layout ── */}
      <div className="pSection pSection--jonathanHero">
        <div className="jonathan_heroGlow" />
        <div className="container">
          <div className="jonathan_heroGrid">
            <div className="jonathan_heroText">
              <span className="st4 jonathan_heroLabel ls-appear" data-scroll data-scroll-offset="20%">
                {jonathanContent.hero.subtitle}
              </span>
              <h1 className="jonathan_heroName">
                {jonathanContent.hero.name.split("\n").map((line, i) => (
                  <span key={i} style={{ display: "block" }}>{line}</span>
                ))}
              </h1>
              <div className="jonathan_heroLine" />
              <p className="jonathan_heroTitle ls-appear" data-scroll data-scroll-offset="15%">
                {jonathanContent.hero.title}
              </p>
              <div className="jonathan_heroActions ls-appear" data-scroll data-scroll-offset="15%">
                <ButtonDiscover label="Discover" scrollTo="jonathanStats" />
              </div>
            </div>
            <div className="jonathan_heroPortrait ls-cover ls-cover--btt" data-scroll data-scroll-offset="10%">
              <picture>
                <source media="(max-width: 767px)" srcSet="/images/mobile/jonathan-portrait.webp" />
                <img
                  src="/images/desktop/jonathan-portrait.webp"
                  alt="Jonathan Uphoff — Founder of Bluprint Wellness"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>
        <div className="parentFade" data-scroll data-scroll-event-progress="parentFade" data-scroll-offset="0%,100%" />
      </div>

      {/* ── Stats Ribbon ── */}
      <div className="jonathan_stats" data-scroll-target="jonathanStats">
        <div className="container">
          <div className="jonathan_statsInner ls-stagger">
            {jonathanContent.stats.map((stat, i) => (
              <div key={i} className="jonathan_stat ls-appear" data-scroll data-scroll-offset="15%">
                <span className="jonathan_stat_value">{stat.value}</span>
                <span className="jonathan_stat_label">
                  {stat.label.split("\n").map((line, j) => (
                    <span key={j} style={{ display: "block" }}>{line}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="jonathan_divider" />

      {/* ── Bio — word reveal ── */}
      <div className="pSection pSection--jonathanBio">
        <div className="pSection_sub jonathan_bioContent">
          <div
            className="jonathan_bioProgress"
            data-scroll
            data-scroll-event-progress="jonathanReadText"
            data-scroll-offset="0%,100%"
          />
          <div className="pSection_sticky">
            <div className="container">
              <div className="jonathan_bioLayout">
                <div className="jonathan_bioSide">
                  <span className="st4 ls-appear" data-scroll data-scroll-offset="20%">The Founder</span>
                  <h2 className="jonathan_bioSideTitle ls-appear" data-scroll data-scroll-offset="15%">
                    A Vision<br />Realized
                  </h2>
                  <div className="jonathan_bioSideLine" />
                </div>
                <div
                  ref={manifestoRef}
                  className="jonathan_bioManifesto"
                >
                  {bioWords.map((word, i) => (
                    <span key={i}>
                      <span className="word">{word}</span>
                      {i < bioWords.length - 1 ? " " : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="parentFade" data-scroll data-scroll-event-progress="parentFade" data-scroll-offset="0%,100%" />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="jonathan_divider" />

      {/* ── Philosophy ── */}
      <div className="pSection pSection--jonathanPhilosophy">
        <div className="pSection_sub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="jonathan_philosophyLayout">
                <div className="jonathan_philosophyQuote ls-appear" data-scroll data-scroll-offset="15%">
                  <div className="jonathan_philosophyAccent" />
                  <span className="jonathan_philosophyMark">&ldquo;</span>
                  <blockquote className="jonathan_philosophyBlockquote">
                    {jonathanContent.philosophy.quote}
                  </blockquote>
                  <span className="jonathan_philosophyAttr">— Jonathan Uphoff</span>
                </div>
                <div className="jonathan_philosophyBody ls-appear" data-scroll data-scroll-offset="15%">
                  <p>{jonathanContent.philosophy.body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="jonathan_divider" />

      {/* ── Credentials ── */}
      <div className="pSection pSection--jonathanCredentials">
        <div className="pSection_sub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="jonathan_credentialsHeader ls-appear" data-scroll data-scroll-offset="15%">
                <span className="st4">Education & Certifications</span>
                <h2 className="st2 jonathan_credentialsTitle" data-split>Credentials</h2>
              </div>
              <div className="jonathan_credentials ls-stagger">
                {jonathanContent.credentials.map((cred, i) => (
                  <div key={i} className="jonathan_credential ls-appear" data-scroll data-scroll-offset="15%">
                    <div className="jonathan_credential_num">.0{i + 1}</div>
                    <h3 className="jonathan_credential_title">{cred.title}</h3>
                    <p className="jonathan_credential_body">{cred.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="jonathan_divider" />

      {/* ── CTA ── */}
      <div className="pSection pSection--jonathanCta">
        <div className="jonathan_ctaGlow" />
        <div className="pSection_sub">
          <div className="pSection_sticky">
            <div className="container">
              <div className="jonathan_ctaInner ls-appear" data-scroll data-scroll-offset="15%">
                <span className="st4">{jonathanContent.cta.label}</span>
                <h2 className="st1 jonathan_ctaTitle">
                  {jonathanContent.cta.title.split("\n").map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </h2>
                <p className="jonathan_ctaBody">{jonathanContent.cta.body}</p>
                <Button href={jonathanContent.cta.ctaHref}>{jonathanContent.cta.ctaLabel}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="jonathan_footer">
        <div className="container">
          <Link href="/" className="jonathan_footerLink">
            <span>&larr; Back to Bluprint Wellness</span>
          </Link>
        </div>
      </footer>
    </main>
  );
}
