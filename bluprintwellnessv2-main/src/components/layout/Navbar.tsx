"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { scrollEvents } from "@/lib/scroll-events";
import Button from "@/components/ui/Button";
import AmbientSound from "@/components/decorative/AmbientSound";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const handleScrollUpdate = (args: { progress: number }) => {
      setProgressWidth(args.progress * 100);
    };
    scrollEvents.on("scrollUpdate", handleScrollUpdate);
    return () => { scrollEvents.off("scrollUpdate", handleScrollUpdate); };
  }, []);

  const pageLinks = [
    { href: "/functional-medicine", label: "Functional Medicine" },
    { href: "/aesthetics", label: "Aesthetics" },
  ];

  return (
    <div className="navbar" style={{ opacity: 0 }}>
      <div className="navbar_main">
        <div className="navbar_logo">
          <Link href="/">
            <img src="/images/logo-small.svg" alt="Bluprint Wellness" />
          </Link>
        </div>

        <nav className="navbar_nav">
          {pageLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="navbar_nav_link"
            >
              <span />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="navbar_progress">
          <div className="navbar_progress_track" />
          <div className="navbar_progress_bar" style={{ transform: `scaleX(${progressWidth / 100})` }} />
        </div>
      </div>

      <div className="navbar_actions">
        <Button href="/apply" dataSplitLabel="char">Apply</Button>
        <AmbientSound />
      </div>

      <button type="button" className="navbar_menuToggle" aria-label="Toggle menu" onClick={onMenuToggle}>
        <span /><span /><span />
      </button>
    </div>
  );
}
