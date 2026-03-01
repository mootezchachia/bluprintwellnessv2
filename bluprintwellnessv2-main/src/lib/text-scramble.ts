/**
 * Text scramble effect — cycles through random characters before settling
 * on the real text. Inspired by airport departure boards.
 */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";

export function scrambleText(
  el: HTMLElement,
  {
    duration = 800,
    staggerPerChar = 30,
    initialDelay = 0,
  }: { duration?: number; staggerPerChar?: number; initialDelay?: number } = {}
) {
  const original = el.textContent || "";
  const chars = original.split("");
  const totalDuration = duration + chars.length * staggerPerChar;

  // Create spans for each character if not already split
  if (!el.querySelector(".char")) {
    el.innerHTML = chars
      .map((c) => `<span class="char" data-char="${c}">${c}</span>`)
      .join("");
  } else {
    // Existing SplitType chars — ensure data-char is set for restoration
    el.querySelectorAll(".char").forEach((span) => {
      if (!span.getAttribute("data-char")) {
        span.setAttribute("data-char", span.textContent || "");
      }
    });
  }

  const charEls = el.querySelectorAll(".char");
  const startTime = performance.now() + initialDelay;

  function update(now: number) {
    const elapsed = now - startTime;
    if (elapsed < 0) {
      requestAnimationFrame(update);
      return;
    }

    let allSettled = true;

    charEls.forEach((span, i) => {
      const charStart = i * staggerPerChar;
      const charEnd = charStart + duration;
      const char = (span as HTMLElement).getAttribute("data-char") || "";

      if (char === " ") return; // Skip spaces

      if (elapsed < charStart) {
        // Not started yet — show random
        span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        allSettled = false;
      } else if (elapsed < charEnd) {
        // Scrambling — random chars with increasing probability of settling
        const progress = (elapsed - charStart) / duration;
        if (Math.random() < progress * progress) {
          span.textContent = char;
        } else {
          span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        allSettled = false;
      } else {
        // Settled
        span.textContent = char;
      }
    });

    if (!allSettled) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Scramble reveal for elements — combines opacity fade with text scramble
 */
export function scrambleReveal(
  el: HTMLElement,
  delay = 0
) {
  el.style.opacity = "0";
  el.style.transition = "opacity 0.3s ease";

  setTimeout(() => {
    el.style.opacity = "1";
    scrambleText(el, { duration: 600, staggerPerChar: 25, initialDelay: 0 });
  }, delay);
}
