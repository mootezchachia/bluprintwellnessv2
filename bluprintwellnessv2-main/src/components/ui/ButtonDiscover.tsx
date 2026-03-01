"use client";

import { useCallback } from "react";
import { useLenis } from "@/hooks/useLenis";

interface ButtonDiscoverProps {
  label: string;
  scrollTo: string;
}

export default function ButtonDiscover({ label, scrollTo }: ButtonDiscoverProps) {
  const { scrollTo: lenisScrollTo } = useLenis();

  const handleClick = useCallback(() => {
    const target = document.querySelector(`[data-scroll-target="${scrollTo}"]`);
    if (target) lenisScrollTo(target as HTMLElement);
  }, [scrollTo, lenisScrollTo]);

  return (
    <button className="buttonDiscover" data-scroll-to={scrollTo} onClick={handleClick}>
      <span className="buttonDiscover_label">
        <span className="buttonDiscover_label_txt buttonDiscover_label_txt--1" data-split="chars">{label}</span>
        <span className="buttonDiscover_label_txt buttonDiscover_label_txt--2" data-split="chars">{label}</span>
      </span>
      <span className="buttonDiscover_border" />
      <span className="buttonDiscover_arrow">
        <svg className="buttonDiscover_arrow_icon buttonDiscover_arrow_icon--1" width="8" height="19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.646 18.354a.5.5 0 0 0 .708 0l3.182-3.182a.5.5 0 1 0-.708-.708L4 17.293l-2.828-2.829a.5.5 0 1 0-.708.708l3.182 3.182ZM3.5 0v18h1V0h-1Z" />
        </svg>
        <svg className="buttonDiscover_arrow_icon buttonDiscover_arrow_icon--2" width="8" height="19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.646 18.354a.5.5 0 0 0 .708 0l3.182-3.182a.5.5 0 1 0-.708-.708L4 17.293l-2.828-2.829a.5.5 0 1 0-.708.708l3.182 3.182ZM3.5 0v18h1V0h-1Z" />
        </svg>
      </span>
    </button>
  );
}
