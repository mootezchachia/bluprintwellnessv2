"use client";

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";

export interface AmbientSoundRef {
  start: () => void;
}

const AmbientSound = forwardRef<AmbientSoundRef>(function AmbientSound(_, ref) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const canPlayRef = useRef(false);
  const startRequestedRef = useRef(false);
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

  const tryPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !canPlayRef.current) return;
    audio.play().catch(() => {});
    toggleRef.current?.classList.add("playing");
  }, []);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying()) {
      audio.pause();
      toggleRef.current?.classList.remove("playing");
    } else {
      audio.play().catch(() => {});
      toggleRef.current?.classList.add("playing");
    }
  }, [isPlaying]);

  // Expose start method for loading sequence
  useImperativeHandle(ref, () => ({
    start: () => {
      startRequestedRef.current = true;
      if (canPlayRef.current) tryPlay();
    },
  }), [tryPlay]);

  useEffect(() => {
    // Create audio element
    const audio = new Audio("/sounds/ambience.mp3");
    audioRef.current = audio;

    // Manual loop via ended event
    audio.addEventListener("ended", function () {
      this.currentTime = 0;
      this.play();
    });

    // Set ready on first user interaction
    const setReady = () => {
      if (canPlayRef.current) return;
      canPlayRef.current = true;
      toggleRef.current?.classList.add("ready");
      if (startRequestedRef.current) tryPlay();
      window.removeEventListener("click", setReady);
      window.removeEventListener("touchstart", setReady);
    };
    window.addEventListener("click", setReady);
    window.addEventListener("touchstart", setReady);

    // Listen for start event from loading sequence
    const handleStart = () => {
      startRequestedRef.current = true;
      if (canPlayRef.current) tryPlay();
    };
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
      cancelAnimationFrame(animFrameRef.current);
      audio.pause();
      audio.src = "";
      window.removeEventListener("click", setReady);
      window.removeEventListener("touchstart", setReady);
      window.removeEventListener("ambientSound:start", handleStart);
    };
  }, [tryPlay]);

  return (
    <button ref={toggleRef} type="button" className="ambient" onClick={toggleAudio}>
      <canvas ref={canvasRef} className="ambient_canvas" />
      <span className="ambient_label">Sound</span>
    </button>
  );
});

export default AmbientSound;
