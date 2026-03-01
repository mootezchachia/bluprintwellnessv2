import { animate, stagger } from "animejs";

export function revealWords(element: HTMLElement, delay = 0) {
  const words = element.querySelectorAll(".word");
  if (!words.length) return;

  return animate(words, {
    translateY: ["110%", "0%"],
    opacity: [0, 1],
    delay: stagger(30, { start: delay }),
    easing: "cubicBezier(0.19, 1, 0.22, 1)",
    duration: 1200,
  });
}

export function revealChars(element: HTMLElement, delay = 0) {
  const chars = element.querySelectorAll(".char");
  if (!chars.length) return;

  return animate(chars, {
    translateY: ["110%", "0%"],
    opacity: [0, 1],
    delay: stagger(20, { start: delay }),
    easing: "cubicBezier(0.19, 1, 0.22, 1)",
    duration: 1200,
  });
}

export function fadeIn(element: HTMLElement, duration = 600) {
  return animate(element, {
    opacity: [0, 1],
    duration,
    easing: "easeOutCubic",
  });
}

export function fadeOut(element: HTMLElement, duration = 600) {
  return animate(element, {
    opacity: [1, 0],
    duration,
    easing: "easeOutCubic",
  });
}
