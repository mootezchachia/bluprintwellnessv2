"use client";

import { useEffect } from "react";
import Link from "next/link";

interface PageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const pages = [
  { href: "/functional-medicine", label: "Functional\nMedicine", description: "Root-cause analysis & interventions" },
  { href: "/aesthetics", label: "Precision\nAesthetics", description: "Advanced treatments by Suzanne Dean, RN" },
  { href: "/apply", label: "Apply for\nMembership", description: "Begin your wellness journey" },
];

export default function PageSidebar({ isOpen, onClose }: PageSidebarProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`pageSidebar_backdrop ${isOpen ? "pageSidebar_backdrop--open" : ""}`}
        onClick={onClose}
      />

      <div className={`pageSidebar ${isOpen ? "pageSidebar--open" : ""}`}>
        {/* Warm ambient glow — matches hero/CTA glow pattern */}
        <div className="pageSidebar_glow" />

        <div className="pageSidebar_header">
          <span className="pageSidebar_label">Explore</span>
          <button type="button" className="pageSidebar_close" aria-label="Close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>
        </div>

        {/* Gradient divider — same pattern as section dividers */}
        <div className="pageSidebar_divider" />

        <nav className="pageSidebar_nav">
          {pages.map((page, i) => (
            <Link
              key={page.href}
              href={page.href}
              className="pageSidebar_link"
              onClick={onClose}
              style={{ transitionDelay: isOpen ? `${120 + i * 70}ms` : "0ms" }}
            >
              <span className="pageSidebar_link_num">.0{i + 1}</span>
              <div className="pageSidebar_link_text">
                <span className="pageSidebar_link_title">
                  {page.label.split("\n").map((line, j) => (
                    <span key={j} style={{ display: "block" }}>{line}</span>
                  ))}
                </span>
                <span className="pageSidebar_link_desc">{page.description}</span>
              </div>
              <svg className="pageSidebar_link_arrow" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M4 10h12M12 6l4 4-4 4" />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="pageSidebar_divider" />

        <div className="pageSidebar_footer">
          <span className="pageSidebar_footer_label">Contact</span>
          <a href="mailto:jonathan@bluprintwellness.com" className="pageSidebar_email">
            jonathan@bluprintwellness.com
          </a>
          <span className="pageSidebar_footer_address">
            137 Lomas Santa Fe Drive, Solana Beach
          </span>
        </div>
      </div>
    </>
  );
}
