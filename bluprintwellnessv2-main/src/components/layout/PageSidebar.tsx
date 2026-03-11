"use client";

import { useEffect } from "react";
import Link from "next/link";

interface PageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const pages = [
  { href: "/functional-medicine", label: "Functional Medicine", description: "Root-cause analysis & interventions" },
  { href: "/aesthetics", label: "Aesthetics", description: "Precision treatments by Suzanne Dean, RN" },
  { href: "/apply", label: "Apply for Membership", description: "Begin your wellness journey" },
];

export default function PageSidebar({ isOpen, onClose }: PageSidebarProps) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
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
      {/* Backdrop */}
      <div
        className={`pageSidebar_backdrop ${isOpen ? "pageSidebar_backdrop--open" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div className={`pageSidebar ${isOpen ? "pageSidebar--open" : ""}`}>
        <div className="pageSidebar_header">
          <span className="pageSidebar_label">Explore</span>
          <button type="button" className="pageSidebar_close" aria-label="Close sidebar" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        <nav className="pageSidebar_nav">
          {pages.map((page, i) => (
            <Link
              key={page.href}
              href={page.href}
              className="pageSidebar_link"
              onClick={onClose}
              style={{ transitionDelay: isOpen ? `${80 + i * 50}ms` : "0ms" }}
            >
              <span className="pageSidebar_link_num">.0{i + 1}</span>
              <div className="pageSidebar_link_text">
                <span className="pageSidebar_link_title">{page.label}</span>
                <span className="pageSidebar_link_desc">{page.description}</span>
              </div>
              <svg className="pageSidebar_link_arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="pageSidebar_footer">
          <a href="mailto:jonathan@bluprintwellness.com" className="pageSidebar_email">
            jonathan@bluprintwellness.com
          </a>
        </div>
      </div>
    </>
  );
}
