"use client";

import { useCallback } from "react";
import { useLenis } from "@/hooks/useLenis";

interface ButtonProps {
  children: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "empty";
  scrollTo?: string;
  className?: string;
  dataSplitLabel?: string;
}

export default function Button({ children, onClick, href, variant = "default", scrollTo, className = "", dataSplitLabel = "char" }: ButtonProps) {
  const { scrollTo: lenisScrollTo } = useLenis();

  const handleClick = useCallback(() => {
    if (scrollTo) {
      const target = document.querySelector(`[data-scroll-target="${scrollTo}"]`);
      if (target) lenisScrollTo(target as HTMLElement);
    }
    onClick?.();
  }, [scrollTo, onClick, lenisScrollTo]);

  const classes = `button ${variant === "empty" ? "button--empty" : ""} ${className}`.trim();

  const inner = (
    <>
      <span className="button_circle" />
      <span className="button_label" data-split={dataSplitLabel}>{children}</span>
      <span className="button_plus">+</span>
    </>
  );

  if (href) {
    return <a href={href} className={classes} onClick={scrollTo ? handleClick : undefined}>{inner}</a>;
  }

  return <button type="button" className={classes} onClick={handleClick}>{inner}</button>;
}
