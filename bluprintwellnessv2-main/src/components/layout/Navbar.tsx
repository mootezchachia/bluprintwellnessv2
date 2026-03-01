"use client";

import { useState, useEffect, useCallback } from "react";
import { useLenis } from "@/hooks/useLenis";
import { scrollEvents } from "@/lib/scroll-events";
import Button from "@/components/ui/Button";
import AmbientSound from "@/components/decorative/AmbientSound";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("intro");
  const [progressWidth, setProgressWidth] = useState(0);
  const { scrollTo } = useLenis();

  // Navbar visibility is controlled by post-loading revealAfterLoading()
  // which sets opacity: 1 directly on the navbar element

  // Listen for scroll data from LenisProvider to update progress bar
  useEffect(() => {
    const handleScrollUpdate = (args: { progress: number }) => {
      setProgressWidth(args.progress * 100);
    };
    scrollEvents.on("scrollUpdate", handleScrollUpdate);
    return () => { scrollEvents.off("scrollUpdate", handleScrollUpdate); };
  }, []);

  const handleNavClick = useCallback((target: string) => {
    const el = document.querySelector(`[data-scroll-target="${target}"]`);
    if (el) scrollTo(el as HTMLElement);
  }, [scrollTo]);

  const navLinks = [
    { target: "sphere", label: "The Studio", section: "sphere" },
    { target: "join", label: "Membership", section: "join" },
    { target: "invest", label: "Testimonials", section: "invest" },
  ];

  return (
    <div className="navbar" style={{ opacity: 0 }}>
      <div className="navbar_main">
        <div className="navbar_logo">
          <a href="#home" className="active" data-scroll-to="hero" onClick={(e) => { e.preventDefault(); handleNavClick("hero"); }}>
            <img src="/images/logo-small.svg" alt="Bluprint Wellness" />
          </a>
        </div>

        <nav className="navbar_nav">
          {navLinks.map((link) => (
            <a
              key={link.target}
              href={`#${link.target}`}
              className={`navbar_nav_link ${activeSection === link.section ? "active" : ""}`}
              data-scroll-to={link.target}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.target); }}
            >
              <span />
              <span data-split="chars">{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="navbar_progress">
          <div className="navbar_progress_track" />
          <div className="navbar_progress_bar" style={{ transform: `scaleX(${progressWidth / 100})` }} />
          {["intro", "sphere", "join", "invest"].map((section) => (
            <span
              key={section}
              className={`navbar_progress_section ${activeSection === section ? "active" : ""}`}
              data-section={section}
              onClick={() => {
                const targets: Record<string, string> = { intro: "hero", sphere: "sphere", join: "join", invest: "invest" };
                handleNavClick(targets[section]);
              }}
            >
              <span />
            </span>
          ))}
        </div>
      </div>

      <div className="navbar_actions">
        <Button scrollTo="contact" dataSplitLabel="char">Contact</Button>
        <AmbientSound />
      </div>

      <button type="button" className="navbar_menuToggle" aria-label="Toggle menu" onClick={onMenuToggle}>
        <span /><span /><span />
      </button>
    </div>
  );
}
