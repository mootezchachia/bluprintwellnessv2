"use client";

import { useEffect, useRef, useCallback } from "react";
import { animate, remove } from "animejs";
import { scrollEvents } from "@/lib/scroll-events";
import { useCircleState } from "@/hooks/useCircleState";

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */
function vwToPx(vw: number) {
  return (vw / 100) * window.innerWidth;
}
function vhToPx(vh: number) {
  return (vh / 100) * window.innerHeight;
}
function cSize() {
  return vhToPx(66);
}

/* ────────────────────────────────────────────
   State transition configs
   ──────────────────────────────────────────── */
type CircleTarget = {
  opacity?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
};

interface StateConfig {
  c1: CircleTarget;
  c2: CircleTarget;
  c3: CircleTarget;
  duration: number;
  easing: string;
  staggerDelay?: number;
}

function getStateConfig(state: number, prevState: number): StateConfig {
  const s = cSize();

  switch (state) {
    case 0:
      return {
        c1: { scale: 0.5, opacity: 0, translateX: 0 },
        c2: { scale: 0.5, opacity: 0, translateX: 0 },
        c3: { opacity: 0 },
        duration: 1000,
        easing: "easeOutExpo",
      };

    case 1:
      return {
        c1: { opacity: 1, scale: 1, translateX: s / 4, translateY: 0 },
        c2: { opacity: 1, scale: 1, translateX: -s / 4, translateY: 0 },
        c3: { opacity: 0 },
        duration: 1200,
        easing: "easeInOutExpo",
        staggerDelay: 50,
      };

    case 2:
      return {
        c1: { opacity: 1, scale: 1, translateX: vwToPx(-10) },
        c2: { opacity: 1, scale: 1, translateX: vwToPx(-10) - s / 2 },
        c3: prevState >= 3 ? { opacity: 0 } : { opacity: 0 },
        duration: 1200,
        easing: "easeInOutExpo",
      };

    case 3:
      return {
        c1: { opacity: 1, scale: 1, translateX: 0, translateY: vhToPx(-3) },
        c2: { opacity: 1, scale: 1, translateX: s / 2, translateY: vhToPx(-3) },
        c3: { opacity: 1, scale: 1, translateX: -s / 2, translateY: vhToPx(-3) },
        duration: 1200,
        easing: "easeInOutExpo",
        staggerDelay: 50,
      };

    case 4:
      return {
        c1: { opacity: 1, scale: 1, translateX: vwToPx(5), translateY: 0 },
        c2: { opacity: 1, scale: 1, translateX: vwToPx(5) + s / 2, translateY: 0 },
        c3: { opacity: 0, translateX: vwToPx(5) },
        duration: 900,
        easing: "easeInOutExpo",
      };

    case 5:
      return {
        c1: { opacity: 1, scale: 1, translateX: vwToPx(-25), translateY: 0 },
        c2: { opacity: 0, translateX: vwToPx(-25), translateY: 0 },
        c3: { opacity: 0, translateX: vwToPx(-25), translateY: 0 },
        duration: 1200,
        easing: "easeInOutExpo",
      };

    case 6:
      return {
        c1: { opacity: 1, translateX: vwToPx(-25) },
        c2: { opacity: 1, translateX: vwToPx(-25) - s / 2 },
        c3: { opacity: 1, translateX: vwToPx(-25) - s },
        duration: 1200,
        easing: "easeInOutExpo",
      };

    case 7:
      return {
        c1: { opacity: 1, translateX: vwToPx(22), translateY: vhToPx(5) },
        c2: { opacity: 1, translateX: vwToPx(22), translateY: vhToPx(5) - s / 2 },
        c3: { opacity: 0, translateX: vwToPx(22) },
        duration: 1200,
        easing: "easeInOutExpo",
      };

    case 8:
      return {
        c1: { opacity: 1, translateX: vwToPx(7.5) + s / 4, translateY: 0 },
        c2: { opacity: 1, translateX: vwToPx(7.5) - s / 4, translateY: 0 },
        c3: { opacity: 0, translateX: vwToPx(7.5) },
        duration: 1200,
        easing: "easeInOutExpo",
      };

    default:
      return {
        c1: {},
        c2: {},
        c3: {},
        duration: 1200,
        easing: "easeInOutExpo",
      };
  }
}

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */
export default function Circles() {
  const { state, setState } = useCircleState();
  const prevStateRef = useRef(0);

  const circlesRef = useRef<HTMLDivElement>(null);
  const c1Ref = useRef<HTMLDivElement>(null);
  const c2Ref = useRef<HTMLDivElement>(null);
  const c3Ref = useRef<HTMLDivElement>(null);

  const c1InnerRef = useRef<HTMLDivElement>(null);
  const c2InnerRef = useRef<HTMLDivElement>(null);
  const c3InnerRef = useRef<HTMLDivElement>(null);

  const value1Ref = useRef<HTMLSpanElement>(null);
  const value2Ref = useRef<HTMLSpanElement>(null);
  const value3Ref = useRef<HTMLSpanElement>(null);
  const value4Ref = useRef<HTMLSpanElement>(null);

  /* ── Mouse-following parallax ── */
  useEffect(() => {
    const circlesEl = circlesRef.current;
    if (!circlesEl) return;

    // Normalized mouse position: -1 (left/top) to 1 (right/bottom)
    const mouse = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      // Lerp for smooth following
      smoothed.x += (mouse.x - smoothed.x) * 0.06;
      smoothed.y += (mouse.y - smoothed.y) * 0.06;

      circlesEl.style.setProperty("--mx", String(smoothed.x.toFixed(4)));
      circlesEl.style.setProperty("--my", String(smoothed.y.toFixed(4)));
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── Scroll-driven rotation, scale, and counter values ── */
  useEffect(() => {
    const handleScroll = (args: {
      scroll: number;
      limit: number;
      velocity: number;
      direction: number;
      progress: number;
    }) => {
      const { scroll, velocity, direction } = args;
      const circlesEl = circlesRef.current;
      if (!circlesEl) return;

      // CSS custom properties for rotation and scale
      const rotate = scroll * 0.015;
      const rotateInverse = scroll * -0.005;
      const scaleValue = 1 + (Math.abs(velocity / 1500)) * direction * -1;

      circlesEl.style.setProperty("--c-rotate", `${rotate}deg`);
      circlesEl.style.setProperty("--c-rotate-inverse", `${rotateInverse}deg`);
      circlesEl.style.setProperty("--c-scale", `${scaleValue}`);

      // Counter values: scrollPosition / dividor
      if (value1Ref.current) value1Ref.current.textContent = String(Math.floor(scroll / 17));
      if (value2Ref.current) value2Ref.current.textContent = String(Math.floor(scroll / 12));
      if (value3Ref.current) value3Ref.current.textContent = String(Math.floor(scroll / 7));
      if (value4Ref.current) value4Ref.current.textContent = String(Math.floor(scroll / 19));
    };

    scrollEvents.on("scrollUpdate", handleScroll);
    return () => scrollEvents.off("scrollUpdate", handleScroll);
  }, []);

  /* ── Trigger circle state changes from Locomotive Scroll ── */
  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const { target, way } = (e as CustomEvent).detail;
      // Only fire on enter
      if (way !== "enter") return;
      const stateAttr = target?.getAttribute?.("data-state");
      const newState = parseInt(stateAttr ?? "0", 10);
      if (!isNaN(newState)) {
        setState(newState);
      }
    };

    window.addEventListener("triggerCircles", handleTrigger);
    return () => window.removeEventListener("triggerCircles", handleTrigger);
  }, [setState]);

  /* ── Animate on state change ── */
  const animateState = useCallback(
    (newState: number, prevState: number) => {
      const c1 = c1Ref.current;
      const c2 = c2Ref.current;
      const c3 = c3Ref.current;
      if (!c1 || !c2 || !c3) return;

      // Cancel all running animations on these targets
      remove(c1);
      remove(c2);
      remove(c3);

      const config = getStateConfig(newState, prevState);
      const goingForward = newState > prevState;

      // Build targets array with stagger order based on direction
      const targets = goingForward ? [c1, c2, c3] : [c3, c2, c1];
      const configs = goingForward
        ? [config.c1, config.c2, config.c3]
        : [config.c3, config.c2, config.c1];

      targets.forEach((target, i) => {
        const props = configs[i];
        if (!props || Object.keys(props).length === 0) return;

        const delay = config.staggerDelay ? config.staggerDelay * i : 0;

        animate(target, {
          ...props,
          easing: config.easing,
          duration: config.duration,
          delay,
        });
      });
    },
    []
  );

  useEffect(() => {
    animateState(state, prevStateRef.current);
    prevStateRef.current = state;
  }, [state, animateState]);

  return (
    <div className="circles" ref={circlesRef}>
      <div className="circle circle--1" ref={c1Ref}>
        <div className="circle_inner" ref={c1InnerRef}>
          <div className="circle_border">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="49" />
            </svg>
          </div>
          <div className="circle_crosshair" />
          <span className="circle_value" data-dividor="17" ref={value1Ref}>
            0
          </span>
        </div>
      </div>

      <div className="circle circle--2" ref={c2Ref}>
        <div className="circle_inner" ref={c2InnerRef}>
          <div className="circle_border">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="49" />
            </svg>
          </div>
          <div className="circle_crosshair" />
          <span className="circle_value" data-dividor="12" ref={value2Ref}>
            0
          </span>
          <span className="circle_value circle_value--second" data-dividor="7" ref={value3Ref}>
            0
          </span>
        </div>
      </div>

      <div className="circle circle--3" ref={c3Ref}>
        <div className="circle_inner" ref={c3InnerRef}>
          <div className="circle_border">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="49" />
            </svg>
          </div>
          <div className="circle_crosshair" />
          <span className="circle_value" data-dividor="19" ref={value4Ref}>
            0
          </span>
        </div>
      </div>
    </div>
  );
}
