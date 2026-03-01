import { animate, stagger } from "animejs";

// Called after loading sequence completes — reveals navbar + hero elements
export function revealAfterLoading() {
  const navbar = document.querySelector(".navbar");
  const progressTrack = document.querySelector(".navbar_progress");
  const heroProgressSection = document.querySelector('.navbar_progress_section[data-section="intro"] span');
  const logo = document.querySelector(".navbar_logo a");
  const navChars = document.querySelectorAll(".navbar_nav_link .char");
  const menuToggle = document.querySelector(".navbar_menuToggle");
  const buttons = document.querySelectorAll(".navbar_actions .button");
  const heroWords = document.querySelectorAll('.hero_titles [data-step="1"] .word');
  const scrollBtn = document.querySelector(".hero_scroll");

  if (navbar) {
    (navbar as HTMLElement).style.opacity = "1";
  }

  if (progressTrack) {
    animate(progressTrack, { scaleX: [0, 1], duration: 1800, easing: "easeOutExpo" });
  }
  if (heroProgressSection) {
    animate(heroProgressSection, { scaleX: [0, 1], duration: 1200, easing: "easeOutExpo", delay: 100 });
  }
  if (logo) {
    animate(logo, { translateX: ["-100%", "0%"], opacity: [0, 1], duration: 600, easing: "easeOutExpo", delay: 200 });
  }
  if (navChars.length) {
    animate(navChars, {
      translateX: ["-100%", "0%"],
      opacity: [0, 1],
      duration: 600,
      easing: "easeOutExpo",
      delay: stagger(150, { start: 300 }),
    });
  }
  if (menuToggle) {
    animate(menuToggle, { scale: [0.75, 1], translateX: [-20, 0], opacity: [0, 1], duration: 500, easing: "easeOutExpo", delay: 700 });
  }
  if (buttons.length) {
    animate(buttons, {
      scale: [0.75, 1],
      translateX: [-40, 0],
      opacity: [0, 1],
      duration: 600,
      easing: "easeOutExpo",
      delay: stagger(120, { start: 900 }),
    });
  }
  if (heroWords.length) {
    animate(heroWords, {
      translateY: ["100%", "0%"],
      rotate: [10, 0],
      opacity: [0, 1],
      duration: 800,
      easing: "easeOutExpo",
      delay: stagger(60, { start: 900 }),
    });
  }
  if (scrollBtn) {
    animate(scrollBtn, { scale: [0.6, 1], opacity: [0, 1], duration: 600, easing: "easeOutExpo", delay: 1400 });
  }
}
