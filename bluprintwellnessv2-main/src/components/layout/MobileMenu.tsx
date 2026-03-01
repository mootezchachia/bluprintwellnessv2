"use client";

import { useCallback, useEffect } from "react";
import { useLenis } from "@/hooks/useLenis";
import { menuContent } from "@/data/content";
import Button from "@/components/ui/Button";
import AmbientSound from "@/components/decorative/AmbientSound";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { scrollTo, start, stop } = useLenis();

  // Stop/start Lenis when menu opens/closes
  useEffect(() => {
    if (isOpen) {
      stop();
    } else {
      start();
    }
  }, [isOpen, start, stop]);

  const handleNavigate = useCallback((target: string) => {
    onClose();
    start(); // Re-enable Lenis
    // Small delay to let menu close, then scroll
    setTimeout(() => {
      const el = document.querySelector(`[data-scroll-target="${target}"]`);
      if (el) scrollTo(el as HTMLElement);
    }, 150);
  }, [onClose, scrollTo, start]);

  return (
    <div className={`menu ${isOpen ? "open" : ""}`} data-lenis-prevent>
      <div className="menu_scroller">
        <div className="menu_header">
          <span>MENU</span>
          <button type="button" className="menu_close" aria-label="Close menu" onClick={onClose}>
            <svg width="11" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M.686 9.406c-.33.303-.337.612-.02.929.316.316.625.31.928-.02L5.27 6.68l3.674 3.633c.303.33.613.337.93.02.316-.316.309-.625-.021-.928L6.218 5.73l3.634-3.674c.33-.303.337-.613.02-.93-.316-.316-.626-.309-.929.022L5.27 4.782 1.594 1.149C1.291.819.982.81.665 1.128c-.316.316-.31.626.02.929L4.32 5.73.686 9.406Z" fill="#fff"/>
            </svg>
          </button>
        </div>

        <nav className="menu_nav">
          <ul>
            {menuContent.nav.map((item, i) => (
              <li key={i}>
                <a
                  href={item.href}
                  data-menu-target={item.target}
                  onClick={(e) => { e.preventDefault(); handleNavigate(item.target); }}
                >
                  {item.isLogo ? (
                    <img src="/images/logo-small.svg" alt="Bluprint Wellness" />
                  ) : (
                    item.label
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu_actions">
          <Button scrollTo="contact" onClick={onClose} dataSplitLabel="char">Contact</Button>
          <AmbientSound />
        </div>

        <div className="menu_footer">
          <h5 className="st5">{menuContent.footerTitle}</h5>
          <p>
            <a href={`mailto:${menuContent.footerEmail}`}>{menuContent.footerEmail}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
