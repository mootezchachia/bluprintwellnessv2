"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLenis } from "@/hooks/useLenis";
import { menuContent } from "@/data/content";
import AmbientSound from "@/components/decorative/AmbientSound";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { start, stop } = useLenis();

  useEffect(() => {
    if (isOpen) {
      stop();
    } else {
      start();
    }
  }, [isOpen, start, stop]);

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
                <Link href={item.href} onClick={onClose}>
                  {item.isLogo ? (
                    <img src="/images/logo-small.svg" alt="Bluprint Wellness" />
                  ) : (
                    item.label
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu_actions">
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
