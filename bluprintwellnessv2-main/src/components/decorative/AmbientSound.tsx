"use client";

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";

export interface AmbientSoundRef {
  start: () => void;
}

const AmbientSound = forwardRef<AmbientSoundRef>(function AmbientSound(_, ref) {
  const audioElRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const unmutedRef = useRef(false);
  const userPausedRef = useRef(false);
  const animFrameRef = useRef<number>(0);

  const waveRef = useRef({
    amplitude: 0,
    maxAmplitude: 6,
    length: 6,
    frequency: -60,
    increment: Math.random() * 360,
  });

  const isAudible = useCallback(() => {
    const audio = audioElRef.current;
    return audio ? !audio.paused && !audio.muted : false;
  }, []);

  /** Unmute the already-playing audio. */
  const unmute = useCallback(() => {
    if (unmutedRef.current || userPausedRef.current) return;
    const audio = audioElRef.current;
    if (!audio) return;

    unmutedRef.current = true;
    audio.muted = false;
    // If browser paused it when we unmuted, re-play
    if (audio.paused) {
      audio.play().catch(() => {});
    }
    toggleRef.current?.classList.add("ready", "playing");
  }, []);

  const toggleAudio = useCallback(() => {
    const audio = audioElRef.current;
    if (!audio) return;

    if (isAudible()) {
      audio.muted = true;
      userPausedRef.current = true;
      unmutedRef.current = false;
      toggleRef.current?.classList.remove("playing");
    } else {
      userPausedRef.current = false;
      unmutedRef.current = true;
      audio.muted = false;
      if (audio.paused) audio.play().catch(() => {});
      toggleRef.current?.classList.add("playing");
    }
  }, [isAudible]);

  useImperativeHandle(ref, () => ({
    start: () => unmute(),
  }), [unmute]);

  useEffect(() => {
    const audio = audioElRef.current;
    if (!audio) return;

    // The <audio> element is rendered with autoPlay + muted in JSX.
    // Browsers always allow muted autoplay via HTML attributes.
    // Ensure it's playing (React strict mode may re-mount).
    if (audio.paused) {
      audio.muted = true;
      audio.play().catch(() => {});
    }

    // ---- Unmute on first real user gesture ----
    const onUserGesture = (e: Event) => {
      if (unmutedRef.current || userPausedRef.current) return;
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

    const handleStart = () => {
      toggleRef.current?.classList.add("ready");
    };
    window.addEventListener("ambientSound:start", handleStart);

    // Draw sine waveform
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
      cancelAnimationFrame(animFrameRef.current);
      removeListeners();
      window.removeEventListener("ambientSound:start", handleStart);
    };
  }, [unmute]);

  return (
    <button ref={toggleRef} type="button" className="ambient" onClick={toggleAudio}>
      {/* Real HTML element with autoplay + muted attributes — always allowed by all browsers */}
      <audio
        ref={audioElRef}
        src="/sounds/ambience.mp3"
        autoPlay
        muted
        loop
        playsInline
      />
      <canvas ref={canvasRef} className="ambient_canvas" />
      <span className="ambient_label">Sound</span>
    </button>
  );
});

export default AmbientSound;
