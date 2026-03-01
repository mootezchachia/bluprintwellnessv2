"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, remove } from "animejs";
import { scrambleReveal, scrambleText } from "@/lib/text-scramble";
import { initMagnetic, destroyAllMagnetic } from "@/lib/magnetic";

// Smart scroll-to function with scrollingMask for long distances
function scrollToTarget(target: HTMLElement, lenis: any) {
  if (!target || !lenis) return;
  const rect = target.getBoundingClientRect();
  const distance = Math.abs(rect.top);

  if (distance > window.innerHeight * 2) {
    // Show scrolling mask briefly for long scrolls
    const mask = document.querySelector(".scrollingMask");
    if (mask) {
      mask.classList.add("visible");
      setTimeout(() => {
        lenis.scrollTo(target, {
          duration: 1,
          lerp: 0.1,
          easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        });
        setTimeout(() => mask.classList.remove("visible"), 500);
      }, 100);
    }
  } else {
    lenis.scrollTo(target, {
      duration: 1,
      lerp: 0.1,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    });
  }
}

export default function AnimationController() {
  const heroStep = useRef(1);
  const lastStepChange = useRef(0);

  useEffect(() => {
    // ====== SECTION HEADER REVEAL ======
    const handleSectionHeader = (e: Event) => {
      const { target, way } = (e as CustomEvent).detail;
      if (way !== "enter") return;

      const label = target.querySelector(".st4");
      const titleWords = [...(target.querySelector(".st1")?.querySelectorAll(".word") || [])];
      const footer = target.querySelector(".pSection_header_footer");
      const buttons = footer ? [...footer.querySelectorAll(".button")] : [];
      const bodyEl = target.querySelector(".st3");
      const bodyLines = bodyEl ? [...bodyEl.querySelectorAll(".line")] : [];
      const discover = target.querySelector(".buttonDiscover");

      // Remove any existing animations
      if (label) remove(label);
      titleWords.forEach(w => remove(w));

      let delay = 0;

      // Label reveal — scramble text effect
      if (label) {
        scrambleReveal(label as HTMLElement, 200);
        delay = 400;
      }

      // Title words reveal with 3D perspective rotation
      if (titleWords.length) {
        // Set perspective on parent for 3D effect
        const titleEl = target.querySelector(".st1");
        if (titleEl) (titleEl as HTMLElement).style.perspective = "600px";
        animate(titleWords, {
          translateY: ["110%", "0%"],
          rotateX: [45, 0],
          rotate: [8, 0],
          opacity: [0, 1],
          duration: 1000,
          easing: "easeOutExpo",
          delay: stagger(50, { start: delay > 0 ? 100 : 0 }),
        });
      }

      // Buttons stagger
      if (buttons.length) {
        animate(buttons, {
          translateY: [40, 0],
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 600,
          delay: stagger(100, { start: 600 }),
        });
      }

      // Body lines reveal
      bodyLines.forEach((line, i) => {
        const words = [...line.querySelectorAll(".word")];
        if (words.length) {
          animate(words, {
            translateY: ["100%", "0"],
            opacity: [0, 1],
            duration: 600,
            easing: "easeOutExpo",
            delay: stagger(0, { start: 1000 + i * 120 }),
          });
        }
      });

      // ButtonDiscover reveal
      if (discover) {
        const border = discover.querySelector(".buttonDiscover_border");
        const label = discover.querySelector(".buttonDiscover_label");
        const arrow = discover.querySelector(".buttonDiscover_arrow");
        if (border) {
          animate(border, { scale: [0, 1], duration: 600, easing: "easeOutExpo", delay: 1200 });
        }
        if (label) {
          animate(label, { translateX: ["-105%", "0%"], duration: 600, easing: "easeOutExpo", delay: 1000 });
        }
        if (arrow) {
          animate(arrow, { translateY: [-40, 0], duration: 600, easing: "easeOutExpo", delay: 1050 });
        }
      }
    };

    // ====== PARENT FADE (blur + fade on scroll) ======
    const handleParentFade = (e: Event) => {
      const { target, progress } = (e as CustomEvent).detail;
      let parent = target.parentElement;
      const fadeTarget = target.getAttribute("data-fade-target");
      if (fadeTarget) parent = document.querySelector(fadeTarget);
      if (parent) {
        parent.style.opacity = String(1 - progress);
        parent.style.filter = `blur(${20 * progress}px)`;
      }
    };

    // ====== HERO BLUR ======
    const handleHeroBlur = (e: Event) => {
      const { progress } = (e as CustomEvent).detail;
      const blur = document.querySelector(".render_blur");
      if (blur) {
        (blur as HTMLElement).style.opacity = String(1 - progress);
      }
    };

    // ====== HERO STEP TRANSITION ======
    const handleTriggerStep = (e: Event) => {
      const { target, way } = (e as CustomEvent).detail;
      const step = parseInt(target.getAttribute("data-step") || "1");
      const now = Date.now();
      // Cooldown prevents rapid-fire transitions when triggers are near each other
      if (way === "enter" && step !== heroStep.current && now - lastStepChange.current > 800) {
        lastStepChange.current = now;
        const oldStep = heroStep.current;
        heroStep.current = step;

        const heroTitles = document.querySelector(".hero_titles");
        if (!heroTitles) return;

        // Get old and new step elements
        const oldWords = [...heroTitles.querySelectorAll(`[data-step="${oldStep}"] .word`)];
        const newStepEl = heroTitles.querySelector(`[data-step="${step}"]`);
        const newWords = newStepEl ? [...newStepEl.querySelectorAll(".word")] : [];

        const scrollBtn = document.querySelector(".hero_scroll");
        const discoverBtn = document.querySelector(".hero .buttonDiscover");
        const subtitle = document.querySelector(".hero_subtitle");
        const subtitleLines = subtitle ? [...subtitle.querySelectorAll(".line")] : [];

        if (step === 2) {
          // Step 1 -> 2: words slide up and out
          if (oldWords.length) {
            animate(oldWords, {
              translateY: ["0", "-100%"],
              rotate: [0, -10],
              opacity: [1, 0],
              duration: 800,
              easing: "easeOutExpo",
              delay: stagger(40),
            });
          }
          if (scrollBtn) {
            animate(scrollBtn, {
              scale: [1, 0.6],
              opacity: [1, 0],
              duration: 400,
              easing: "easeOutExpo",
            });
          }
          // Step 2 words slide in
          if (newWords.length) {
            animate(newWords, {
              translateY: ["100%", "0%"],
              rotate: [10, 0],
              opacity: [0, 1],
              duration: 800,
              easing: "easeOutExpo",
              delay: stagger(40, { start: 300 }),
            });
          }
          // Subtitle lines
          subtitleLines.forEach((line, i) => {
            const words = [...line.querySelectorAll(".word")];
            if (words.length) {
              animate(words, {
                translateY: ["100%", "0%"],
                opacity: [0, 1],
                duration: 600,
                easing: "easeOutExpo",
                delay: stagger(0, { start: 700 + i * 100 }),
              });
            }
          });
          // Show discover button
          if (discoverBtn) {
            animate(discoverBtn, { opacity: [0, 1], duration: 600, easing: "easeOutExpo", delay: 800 });
          }
        } else if (step === 1) {
          // Step 2 -> 1: reverse
          if (oldWords.length) {
            animate(oldWords, {
              translateY: ["0%", "100%"],
              rotate: [0, 10],
              opacity: [1, 0],
              duration: 800,
              easing: "easeOutExpo",
              delay: stagger(40, { from: "last" }),
            });
          }
          if (newWords.length) {
            animate(newWords, {
              translateY: ["-100%", "0%"],
              rotate: [-10, 0],
              opacity: [0, 1],
              duration: 800,
              easing: "easeOutExpo",
              delay: stagger(40, { start: 300 }),
            });
          }
          if (scrollBtn) {
            animate(scrollBtn, {
              scale: [0.6, 1],
              opacity: [0, 1],
              duration: 600,
              easing: "easeOutExpo",
              delay: 400,
            });
          }
          if (discoverBtn) {
            animate(discoverBtn, { opacity: [1, 0], duration: 400, easing: "easeOutExpo" });
          }
        }
      }
    };

    // ====== SPHERE TITLE REVEAL ======
    const handleSphereTitle = (e: Event) => {
      const { target, way } = (e as CustomEvent).detail;
      if (way !== "enter") return;
      // Set perspective for 3D word rotation
      (target as HTMLElement).style.perspective = "500px";
      const lines = [...target.querySelectorAll(".line")];
      lines.forEach((line, i) => {
        const words = [...(line as Element).querySelectorAll(".word")];
        if (words.length) {
          animate(words, {
            translateY: ["100%", "0"],
            rotateX: [30, 0],
            opacity: [0, 1],
            duration: 800,
            easing: "easeOutExpo",
            delay: stagger(40, { start: i * 120 }),
          });
        }
      });
    };

    // ====== ACTIVATE SECTION (navbar active link) ======
    const handleActivateSection = (e: Event) => {
      const { target, way } = (e as CustomEvent).detail;
      const scrollTarget = target.getAttribute("data-scroll-target");

      if (way === "enter") {
        // Remove active from all nav links
        document.querySelector(".navbar a.active")?.classList.remove("active");
        // Map scroll targets to nav link data-scroll-to values
        let navTarget = scrollTarget;
        if (["hero", "sport", "manifesto", "customers"].includes(scrollTarget)) navTarget = "hero";
        const link = document.querySelector(`.navbar a[data-scroll-to="${navTarget}"]`);
        if (link) {
          link.classList.add("active");
          // Animate chars if it's a nav link
          if (link.classList.contains("navbar_nav_link")) {
            const chars = [...link.querySelectorAll(".char")];
            const span = link.querySelector("span:first-child");
            if (chars.length && span) {
              animate([span, ...chars], {
                translateX: "1.2em",
                duration: 400,
                easing: "easeOutExpo",
                delay: stagger(9, { from: "last" }),
              });
              setTimeout(() => {
                animate([span, ...chars], {
                  translateX: "0",
                  duration: 400,
                  easing: "easeOutExpo",
                  delay: stagger(9, { from: "first" }),
                });
              }, 500);
            }
          }
        }
      } else if (way === "leave") {
        const link = document.querySelector(`.navbar a[data-scroll-to="${scrollTarget}"]`);
        link?.classList.remove("active");
      }
    };

    // ====== RECOGNITION CAROUSEL (scroll-driven) ======
    const recognitionState = { currentSlide: 0, initialized: false, unlocked: false };
    const handleRecognition = (e: Event) => {
      const { progress } = (e as CustomEvent).detail;
      const container = document.querySelector(".recognition");
      if (!container) return;

      const titles = container.querySelectorAll(".recognition_title");
      const navItems = container.querySelectorAll(".recognition_nav_item");
      const mobileItems = container.querySelectorAll(".recognition_nav_mobileTitles_item");
      const brandsContainer = container.querySelector(".recognition_brands");
      const totalSlides = titles.length;
      if (totalSlides === 0) return;

      // State machine: initialize on entry, lock during section, unlock at exit
      if (!recognitionState.initialized && progress > 0 && progress < 0.95) {
        recognitionState.initialized = true;
        recognitionState.unlocked = false;
        window.dispatchEvent(new CustomEvent("webgl:changeSlide", {
          detail: { index: 0, step: "brands" }
        }));
        window.dispatchEvent(new CustomEvent("webgl:lockCarousel"));
      }

      // Unlock once at end of section (no re-lock/unlock thrashing)
      if (progress >= 0.95 && !recognitionState.unlocked) {
        recognitionState.unlocked = true;
        window.dispatchEvent(new CustomEvent("webgl:unlockCarousel"));
      }

      // Re-lock if user scrolls back into section from the end
      if (progress < 0.90 && recognitionState.unlocked) {
        recognitionState.unlocked = false;
        window.dispatchEvent(new CustomEvent("webgl:lockCarousel"));
      }

      // Reset when section fully exits (for next scroll-through)
      if (progress <= 0 || progress >= 1) {
        recognitionState.initialized = false;
        recognitionState.unlocked = false;
      }

      const newSlide = Math.min(Math.floor(progress * totalSlides), totalSlides - 1);

      // Update progress bars — active fills proportionally, past = full, future = empty
      navItems.forEach((item, i) => {
        const bar = item.querySelector(".recognition_nav_progress_bar") as HTMLElement;
        if (!bar) return;
        if (i === newSlide) {
          const sliceSize = 1 / totalSlides;
          const sliceStart = newSlide * sliceSize;
          const sliceProgress = Math.max(0, Math.min(1, (progress - sliceStart) / sliceSize));
          bar.style.transform = `scaleX(${sliceProgress})`;
        } else if (i < newSlide) {
          bar.style.transform = "scaleX(1)";
        } else {
          bar.style.transform = "scaleX(0)";
        }
      });

      if (newSlide !== recognitionState.currentSlide && progress > 0 && progress < 1) {
        const oldSlide = recognitionState.currentSlide;
        recognitionState.currentSlide = newSlide;

        // Deactivate old
        titles[oldSlide]?.classList.remove("active");
        navItems[oldSlide]?.classList.remove("active");
        mobileItems[oldSlide]?.classList.remove("active");

        // Animate old title words OUT
        const oldTitle = titles[oldSlide];
        if (oldTitle) {
          [...oldTitle.querySelectorAll(".line")].forEach((line, i) => {
            const words = [...(line as Element).querySelectorAll(".word")];
            animate(words, {
              translateY: ["0%", "-100%"],
              opacity: [1, 0],
              duration: 600,
              easing: "easeOutExpo",
              delay: stagger(30, { start: i * 100 }),
            });
          });
        }

        // Activate new
        titles[newSlide]?.classList.add("active");
        navItems[newSlide]?.classList.add("active");
        mobileItems[newSlide]?.classList.add("active");

        // Animate new title words IN
        const newTitle = titles[newSlide];
        if (newTitle) {
          [...newTitle.querySelectorAll(".line")].forEach((line, i) => {
            const words = [...(line as Element).querySelectorAll(".word")];
            animate(words, {
              translateY: ["100%", "0%"],
              opacity: [0, 1],
              duration: 800,
              easing: "easeOutExpo",
              delay: stagger(30, { start: 300 + i * 150 }),
            });
          });
        }

        // Show/hide brand logos cartouche on last slide
        if (brandsContainer) {
          if (newSlide === totalSlides - 1) {
            brandsContainer.classList.add("active");
          } else {
            brandsContainer.classList.remove("active");
          }
        }

        // Trigger WebGL texture change (include step to prevent race with activateSection)
        window.dispatchEvent(new CustomEvent("webgl:changeSlide", {
          detail: { index: newSlide, step: "brands" }
        }));
      }
    };

    // ====== MANIFESTO TEXT REVEAL ======
    let readTextCurrentStep = 0;
    const handleReadText = (e: Event) => {
      const { target, progress } = (e as CustomEvent).detail;
      const words = target.querySelectorAll(".word");
      if (!words.length) return;

      const steps = (target.getAttribute("data-steps") || "").split(" ").map(Number);
      const activeIndex = Math.round((words.length + 5) * progress);

      // Track step changes for WebGL transitions
      const stepMap: number[] = [];
      let stepIdx = 0;
      words.forEach((_: Element, i: number) => {
        if (steps.indexOf(i) !== -1) stepIdx = steps.indexOf(i);
        stepMap.push(stepIdx);
      });

      if (activeIndex > 0 && activeIndex < words.length) {
        const newStep = stepMap[activeIndex];
        if (newStep !== readTextCurrentStep) {
          readTextCurrentStep = newStep;
          window.dispatchEvent(new CustomEvent("webgl:changeSlide", {
            detail: { index: newStep, step: "manifesto" }
          }));
        }
      }

      words.forEach((word: Element, i: number) => {
        if (i < activeIndex) word.classList.add("active");
        else word.classList.remove("active");
      });
    };

    // ====== INITIAL COLLAPSE ======
    const handleInitFirstCollapse = (e: Event) => {
      const { target, way } = (e as CustomEvent).detail;
      if (way !== "enter") return;
      const defaultItem = target.querySelector(".collapse.default");
      if (defaultItem) {
        defaultItem.classList.add("active");
        animateCollapseOpen(defaultItem);
      }
    };

    // ====== COLLAPSE PROGRESS (scroll-driven accordion) ======
    const handleCollapseProgress = (e: Event) => {
      const { target, progress } = (e as CustomEvent).detail;
      const collapseName = target.getAttribute("data-collapse");
      const container = document.querySelector(`.collapses[data-collapse="${collapseName}"]`);
      if (!container) return;

      const items = container.querySelectorAll(".collapse");
      const count = items.length;
      const currentIndex = parseInt(container.getAttribute("data-current-index") || "0");

      if (progress > 0 && progress < 1) {
        const newIndex = Math.min(Math.floor(progress * count), count - 1);
        if (newIndex !== currentIndex) {
          container.setAttribute("data-current-index", String(newIndex));
          const oldItem = container.querySelector(".collapse.active");
          const newItem = items[newIndex];
          if (oldItem) {
            oldItem.classList.remove("active");
            animateCollapseClose(oldItem as HTMLElement);
          }
          if (newItem) {
            newItem.classList.add("active");
            animateCollapseOpen(newItem as HTMLElement);
          }
          // WebGL texture change (collapseName = step key: "experimentation" or "focus")
          window.dispatchEvent(new CustomEvent("webgl:changeSlide", {
            detail: { index: newIndex, step: collapseName }
          }));
        }
      }
    };

    // ====== NAVBAR LINK HOVER ======
    document.querySelectorAll(".navbar_nav_link").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        const span = link.querySelector("span:first-child");
        const chars = [...link.querySelectorAll(".char")];
        if (span && chars.length) {
          animate([span, ...chars], {
            translateX: "1.2em",
            duration: 400,
            easing: "easeOutExpo",
            delay: stagger(9, { from: "last" }),
          });
        }
      });
      link.addEventListener("mouseleave", () => {
        const span = link.querySelector("span:first-child");
        const chars = [...link.querySelectorAll(".char")];
        if (span && chars.length) {
          animate([span, ...chars], {
            translateX: "0",
            duration: 400,
            easing: "easeOutExpo",
            delay: stagger(9, { from: "first" }),
          });
        }
      });
    });

    // ====== BUTTON HOVER — scramble + slide ======
    document.querySelectorAll(".button:not(.button--empty)").forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        const label = btn.querySelector(".button_label") as HTMLElement;
        if (label) scrambleText(label, { duration: 400, staggerPerChar: 20 });
        const chars = [...btn.querySelectorAll(".char")];
        if (chars.length) {
          animate(chars, {
            translateX: -18,
            duration: 450,
            easing: "easeOutExpo",
            delay: stagger(9, { from: "first" }),
          });
        }
      });
      btn.addEventListener("mouseleave", () => {
        const chars = [...btn.querySelectorAll(".char")];
        if (chars.length) {
          animate(chars, {
            translateX: 0,
            duration: 450,
            easing: "easeOutExpo",
            delay: stagger(9, { from: "last" }),
          });
        }
      });
    });

    // ====== CONTACT LINK HOVER ======
    const contactLink = document.querySelector(".joinInvest_contact_link a");
    if (contactLink) {
      contactLink.addEventListener("mouseenter", () => {
        const spans = contactLink.querySelectorAll("span");
        if (spans[0]) {
          const chars1 = [...spans[0].querySelectorAll(".char")];
          animate(chars1, {
            translateX: "1.2em",
            duration: 400,
            easing: "easeOutExpo",
            delay: stagger(9, { from: "last" }),
          });
        }
        if (spans[1]) {
          const chars2 = [...spans[1].querySelectorAll(".char")];
          animate(chars2, {
            translateX: 0,
            duration: 400,
            easing: "easeOutExpo",
            delay: stagger(9, { from: "first" }),
          });
        }
      });
      contactLink.addEventListener("mouseleave", () => {
        const spans = contactLink.querySelectorAll("span");
        if (spans[0]) {
          const chars1 = [...spans[0].querySelectorAll(".char")];
          animate(chars1, {
            translateX: 0,
            duration: 400,
            easing: "easeOutExpo",
            delay: stagger(9, { from: "first" }),
          });
        }
        if (spans[1]) {
          const chars2 = [...spans[1].querySelectorAll(".char")];
          animate(chars2, {
            translateX: "-1.2em",
            duration: 400,
            easing: "easeOutExpo",
            delay: stagger(9, { from: "last" }),
          });
        }
      });
    }

    // ====== MAGNETIC INTERACTIONS ======
    const magneticCleanups: (() => void)[] = [];

    // Wait for DOM to be ready (after SplitType runs)
    const magneticTimer = setTimeout(() => {
      // Magnetic buttons
      document.querySelectorAll(".button:not(.button--empty)").forEach((btn) => {
        magneticCleanups.push(
          initMagnetic(btn as HTMLElement, {
            strength: 0.25,
            innerStrength: 0.4,
            innerSelector: ".button_label",
          })
        );
      });

      // Magnetic discover buttons (circular — stronger pull)
      document.querySelectorAll(".buttonDiscover").forEach((btn) => {
        magneticCleanups.push(
          initMagnetic(btn as HTMLElement, {
            strength: 0.35,
            innerStrength: 0.5,
            innerSelector: ".buttonDiscover_label",
            threshold: 120,
          })
        );
      });

      // Magnetic nav links (subtle)
      document.querySelectorAll(".navbar_nav_link").forEach((link) => {
        magneticCleanups.push(
          initMagnetic(link as HTMLElement, {
            strength: 0.15,
            innerStrength: 0,
            threshold: 60,
          })
        );
      });

      // Magnetic hero scroll button
      const heroScroll = document.querySelector(".hero_scroll");
      if (heroScroll) {
        magneticCleanups.push(
          initMagnetic(heroScroll as HTMLElement, {
            strength: 0.3,
            innerStrength: 0.5,
            innerSelector: ".hero_scroll_label",
            threshold: 100,
          })
        );
      }
    }, 600);

    // Register all event listeners
    window.addEventListener("sectionHeader", handleSectionHeader);
    window.addEventListener("parentFade", handleParentFade);
    window.addEventListener("heroBlur", handleHeroBlur);
    window.addEventListener("triggerStep", handleTriggerStep);
    window.addEventListener("sphereTitle", handleSphereTitle);
    window.addEventListener("activateSection", handleActivateSection);
    window.addEventListener("recognition", handleRecognition);
    window.addEventListener("readText", handleReadText);
    window.addEventListener("initFirstCollapse", handleInitFirstCollapse);
    window.addEventListener("collapseProgress", handleCollapseProgress);

    return () => {
      clearTimeout(magneticTimer);
      magneticCleanups.forEach(fn => fn());
      destroyAllMagnetic();
      window.removeEventListener("sectionHeader", handleSectionHeader);
      window.removeEventListener("parentFade", handleParentFade);
      window.removeEventListener("heroBlur", handleHeroBlur);
      window.removeEventListener("triggerStep", handleTriggerStep);
      window.removeEventListener("sphereTitle", handleSphereTitle);
      window.removeEventListener("activateSection", handleActivateSection);
      window.removeEventListener("recognition", handleRecognition);
      window.removeEventListener("readText", handleReadText);
      window.removeEventListener("initFirstCollapse", handleInitFirstCollapse);
      window.removeEventListener("collapseProgress", handleCollapseProgress);
    };
  }, []);

  return null;
}

// Helper: animate collapse open
function animateCollapseOpen(el: HTMLElement) {
  const content = el.querySelector(".collapse_content");
  const titleSmall = el.querySelector(".collapse_title_txt");
  const num = el.querySelector(".collapse_title_num");
  const contentTitle = el.querySelector(".collapse_content_title");
  const contentTxt = el.querySelector(".collapse_content_txt");
  const contentMedia = el.querySelector(".collapse_content_media");
  const contentAction = el.querySelector(".collapse_content_action");

  if (titleSmall) {
    animate(titleSmall, {
      opacity: [1, 0],
      translateY: [0, 30],
      duration: 600,
      easing: "easeOutExpo",
    });
  }
  if (num) {
    animate(num, { opacity: 1, translateY: 30, duration: 600, easing: "easeOutExpo" });
  }
  if (content) {
    animate(content, { opacity: [0, 1], translateY: 0, duration: 1, easing: "linear" });
  }
  if (contentTitle) {
    const lines = [...contentTitle.querySelectorAll(".line")];
    lines.forEach((line, i) => {
      animate(line, {
        translateY: [80, 0],
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutExpo",
        delay: 300 + i * 100,
      });
    });
  }
  if (contentTxt) {
    const lines = [...contentTxt.querySelectorAll(".line")];
    lines.forEach((line, i) => {
      animate(line, {
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600,
        easing: "easeOutExpo",
        delay: 200 + i * 75,
      });
    });
  }
  if (contentMedia) {
    animate(contentMedia, {
      clipPath: ["polygon(0 0,100% 0,100% 0,0 0)", "polygon(0 0,100% 0,100% 100%,0 100%)"],
      duration: 800,
      easing: "easeOutExpo",
      delay: 200,
    });
  }
  if (contentAction) {
    animate(contentAction, {
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
      easing: "easeOutExpo",
      delay: 200,
    });
  }
}

// Helper: animate collapse close
function animateCollapseClose(el: HTMLElement) {
  const content = el.querySelector(".collapse_content");
  const titleSmall = el.querySelector(".collapse_title_txt");
  const num = el.querySelector(".collapse_title_num");

  if (content) {
    animate(content, { opacity: [1, 0], translateY: [0, 80], duration: 800, easing: "easeOutExpo" });
  }
  if (num) {
    animate(num, { translateY: 0, duration: 600, easing: "easeOutExpo" });
  }
  if (titleSmall) {
    animate(titleSmall, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      easing: "easeOutExpo",
    });
  }
}
