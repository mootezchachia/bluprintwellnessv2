"use client";

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";

export interface AmbientSoundRef {
  start: () => void;
}

const AmbientSound = forwardRef<AmbientSoundRef>(function AmbientSound(_, ref) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const unmutedRef = useRef(false);   // true once we've unmuted after user gesture
  const userPausedRef = useRef(false); // true when user explicitly clicked Sound to mute
  const animFrameRef = useRef<number>(0);

  // Wave animation state
  const waveRef = useRef({
    amplitude: 0,
    maxAmplitude: 6,
    length: 6,
    frequency: -60,
    increment: Math.random() * 360,
  });

  const isAudible = useCallback(() => {
    const audio = audioRef.current;
    return audio ? !audio.paused && !audio.muted : false;
  }, []);

  /** Unmute the already-playing audio on first user gesture. */
  const unmute = useCallback(() => {
    if (unmutedRef.current || userPausedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    unmutedRef.current = true;
    audio.muted = false;
    toggleRef.current?.classList.add("ready", "playing");
  }, []);

  /** Toggle: user explicitly controls sound on/off. */
  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isAudible()) {
      // User wants to mute
      audio.muted = true;
      userPausedRef.current = true;
      unmutedRef.current = false;
      toggleRef.current?.classList.remove("playing");
    } else {
      // User wants to unmute
      userPausedRef.current = false;
      unmutedRef.current = true;
      audio.muted = false;
      // If audio somehow got paused, restart it
      if (audio.paused) audio.play().catch(() => {});
      toggleRef.current?.classList.add("playing");
    }
  }, [isAudible]);

  // Expose start method for loading sequence
  useImperativeHandle(ref, () => ({
    start: () => unmute(),
  }), [unmute]);

  useEffect(() => {
    // ---- Core trick: muted autoplay is ALWAYS allowed by all browsers ----
    // We start the audio muted so it begins playing immediately on page load.
    // Then on first user interaction we unmute it — instant sound, no delay.
    const audio = new Audio("/sounds/ambience.mp3");
    audio.muted = true;
    audio.loop = true;
    audioRef.current = audio;

    // Start playing immediately (muted — always allowed)
    audio.play().catch(() => {});

    // ---- Unmute on first user gesture ----
    // These are all real "user activation" events that browsers recognize.
    // On mobile, touchstart fires on first scroll gesture → instant unmute.
    // On desktop, first click or keypress → instant unmute.
    const onUserGesture = (e: Event) => {
      if (unmutedRef.current || userPausedRef.current) return;
      // Skip Sound button — toggleAudio handles it
      if (toggleRef.current?.contains(e.target as Node)) return;
      unmute();
      removeListeners();
    };

    const gestureEvents = ["click", "mousedown", "pointerdown", "touchstart", "keydown"] as const;
    const removeListeners = () => {
      gestureEvents.forEach(evt => window.removeEventListener(evt, onUserGesture));
    };
    gestureEvents.forEach(evt =>
      window.addEventListener(evt, onUserGesture, { passive: true })
    );

    // Also listen for loading sequence completion
    const handleStart = () => {
      // Can't unmute here (no user gesture), but mark ready
      toggleRef.current?.classList.add("ready");
    };
    window.addEventListener("ambientSound:start", handleStart);

    // Also attempt full unmuted autoplay (works on high-MEI sites)
    const autoplayTimer = setTimeout(() => {
      if (unmutedRef.current) return;
      audio.muted = false;
      // If browser re-pauses, go back to muted
      setTimeout(() => {
        if (audio.paused && !userPausedRef.current) {
          audio.muted = true;
          audio.play().catch(() => {});
        } else if (!audio.paused && !audio.muted) {
          // Unmuted autoplay worked!
          unmutedRef.current = true;
          toggleRef.current?.classList.add("ready", "playing");
          removeListeners();
        }
      }, 100);
    }, 800);

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
  }, [unmute]);

  return (
    <button ref={toggleRef} type="button" className="ambient" onClick={toggleAudio}>
      <canvas ref={canvasRef} className="ambient_canvas" />
      <span className="ambient_label">Sound</span>
    </button>
  );
});

export default AmbientSound;
