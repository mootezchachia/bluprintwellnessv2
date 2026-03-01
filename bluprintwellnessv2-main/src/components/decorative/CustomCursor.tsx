"use client";

import { useEffect, useRef } from "react";

/**
 * 21TSI-style custom cursor — minimal dot that follows the mouse.
 *
 * The REAL cursor effect on 21TSI is the WebGL flowmap distortion
 * (handled by FluidSimulation + output shader). This component
 * only provides the small dot indicator. Invisible on touch devices.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const isTouch = useRef(false);

  useEffect(() => {
    // Detect touch device
    isTouch.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch.current) return;

    document.documentElement.classList.add("custom-cursor");

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      cursor.style.opacity = "1";
    };

    const onLeave = () => {
      cursor.style.opacity = "0";
    };

    const onEnter = () => {
      cursor.style.opacity = "1";
    };

    // Tight lerp for near-instant following (like 21TSI's dot)
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.35;
      pos.current.y += (target.current.y - pos.current.y) * 0.35;
      cursor.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafRef.current);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  return <div ref={cursorRef} className="cursor-dot" />;
}
