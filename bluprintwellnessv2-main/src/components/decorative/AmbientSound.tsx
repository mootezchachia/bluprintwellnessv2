"use client";

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";

export interface AmbientSoundRef {
  start: () => void;
}

const AmbientSound = forwardRef<AmbientSoundRef>(function AmbientSound(_, ref) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const unlockedRef = useRef(false);
  const userPausedRef = useRef(false); // true when user explicitly clicked Sound to pause
  const animFrameRef = useRef<number>(0);

  // Wave animation state
  const waveRef = useRef({
    amplitude: 0,
    maxAmplitude: 6,
    length: 6,
    frequency: -60,
    increment: Math.random() * 360,
  });

  const isPlaying = useCallback(() => {
    const audio = audioRef.current;
    return audio ? audio.duration > 0 && !audio.paused : false;
  }, []);

  /** Unlock and play (only if user hasn't explicitly paused). */
  const unlockAndPlay = useCallback(() => {
    if (unlockedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    unlockedRef.current = true;
    toggleRef.current?.classList.add("ready");

    // Only auto-start if user hasn't manually paused
    if (!userPausedRef.current) {
      audio.play().then(() => {
        toggleRef.current?.classList.add("playing");
      }).catch(() => {
        // Still blocked — will retry on next interaction
        unlockedRef.current = false;
      });
    }
  }, []);

  /** Toggle: user explicitly controls sound on/off. */
  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // First click also serves as user activation
    if (!unlockedRef.current) {
      unlockedRef.current = true;
      toggleRef.current?.classList.add("ready");
    }

    if (isPlaying()) {
      audio.pause();
      userPausedRef.current = true;
      toggleRef.current?.classList.remove("playing");
    } else {
      userPausedRef.current = false;
      audio.play().catch(() => {});
      toggleRef.current?.classList.add("playing");
    }
  }, [isPlaying]);

  // Expose start method for loading sequence
  useImperativeHandle(ref, () => ({
    start: () => unlockAndPlay(),
  }), [unlockAndPlay]);

  useEffect(() => {
    // Create audio element
    const audio = new Audio("/sounds/ambience.mp3");
    audioRef.current = audio;

    // Manual loop via ended event
    audio.addEventListener("ended", function () {
      this.currentTime = 0;
      this.play();
    });

    // ---- User activation listeners ----
    // Browsers ONLY unlock audio on real user activation events:
    // click, mousedown, pointerdown, pointerup, touchstart, touchend, keydown, keyup
    // scroll and wheel are NOT user activations.
    // On mobile, touchstart fires on first scroll gesture → sound starts on first scroll.
    // On desktop, first click/keypress triggers it.
    const onUserActivation = (e: Event) => {
      if (unlockedRef.current) return;
      // Skip if clicking the Sound button — toggleAudio handles it
      if (toggleRef.current?.contains(e.target as Node)) return;
      unlockAndPlay();
      removeListeners();
    };

    const events = ["click", "mousedown", "pointerdown", "touchstart", "keydown"] as const;
    const removeListeners = () => {
      events.forEach(evt => window.removeEventListener(evt, onUserActivation));
    };
    events.forEach(evt => window.addEventListener(evt, onUserActivation, { once: false, passive: true }));

    // Also try autoplay immediately (works if site has high Media Engagement Index)
    const autoplayTimer = setTimeout(() => {
      if (unlockedRef.current) return;
      audio.play().then(() => {
        unlockedRef.current = true;
        toggleRef.current?.classList.add("ready", "playing");
        removeListeners();
      }).catch(() => { /* blocked, waiting for user gesture */ });
    }, 500);

    // Listen for start event from loading sequence
    const handleStart = () => unlockAndPlay();
    window.addEventListener("ambientSound:start", handleStart);

    // Draw procedural sine waveform
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 30;
      canvas.height = 30;
      const ctx = canvas.getContext("2d")!;
      const wave = waveRef.current;
      const centerY = canvas.height * 0.5;

      const draw = () => {
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 1.5;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 1) {
          ctx.lineTo(x, centerY + Math.sin(x / wave.length + wave.increment) * wave.amplitude);
        }
        ctx.stroke();
        ctx.closePath();
        wave.amplitude = Math.sin(wave.increment) * wave.maxAmplitude;
        wave.increment -= wave.frequency / 1000;
        animFrameRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    return () => {
      clearTimeout(autoplayTimer);
      cancelAnimationFrame(animFrameRef.current);
      audio.pause();
      audio.src = "";
      removeListeners();
      window.removeEventListener("ambientSound:start", handleStart);
    };
  }, [unlockAndPlay]);

  return (
    <button ref={toggleRef} type="button" className="ambient" onClick={toggleAudio}>
      <canvas ref={canvasRef} className="ambient_canvas" />
      <span className="ambient_label">Sound</span>
    </button>
  );
});

export default AmbientSound;
