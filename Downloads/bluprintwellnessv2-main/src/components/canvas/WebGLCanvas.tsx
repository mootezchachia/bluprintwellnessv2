"use client";

import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";
import { FluidSimulation } from "./FluidSimulation";
import { ImageTransition, STEPS } from "./ImageTransition";
import { baseVert, outputFrag } from "./shaders";

export default function WebGLCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const fluidRef = useRef<FluidSimulation | null>(null);
  const imageRef = useRef<ImageTransition | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ------------------------------------------------------------ */
    /*  Renderer setup (WebGL2)                                      */
    /* ------------------------------------------------------------ */
    const dpr = Math.min(window.devicePixelRatio, 2);
    const renderer = new Renderer({
      dpr,
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      webgl: 2,
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    rendererRef.current = renderer;

    /* ------------------------------------------------------------ */
    /*  Sizing via ResizeObserver                                     */
    /* ------------------------------------------------------------ */
    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    /* ------------------------------------------------------------ */
    /*  Fluid simulation                                             */
    /* ------------------------------------------------------------ */
    const fluid = new FluidSimulation(renderer);
    fluidRef.current = fluid;

    /* ------------------------------------------------------------ */
    /*  Image transition system                                      */
    /* ------------------------------------------------------------ */
    const images = new ImageTransition(gl);
    imageRef.current = images;

    // Preload all images in background
    images.preloadAll();

    // Set initial step
    images.setStep("hero");

    /* ------------------------------------------------------------ */
    /*  Output composite program                                     */
    /* ------------------------------------------------------------ */
    const geometry = new Triangle(gl);

    // Create a 1x1 black fallback texture for initial state
    const fallbackTexture = new Texture(gl, {
      width: 1,
      height: 1,
      image: new Uint8Array([0, 0, 0, 255]),
    });

    const outputProgram = new Program(gl, {
      vertex: baseVert,
      fragment: outputFrag,
      uniforms: {
        tFluid: { value: fluid.texture },
        tMapA: { value: images.textureA || fallbackTexture },
        tMapB: { value: images.textureB || fallbackTexture },
        uProgress: { value: 0 },
        uFadeProgress: { value: 0 },
        uMode: { value: 0 },
        uStrength: { value: images.strength },
        uLateral: { value: images.lateral },
        uDistort: { value: images.distort },
        uIntensity: { value: images.intensity },
        uColor: { value: images.color },
        uResolution: { value: [renderer.width, renderer.height] },
        uImageResA: { value: [1, 1] },
        uImageResB: { value: [1, 1] },
        uZoomFrom: { value: 1.0 },
        uRotationFrom: { value: 0.0 },
        uImageMix: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    });

    const outputMesh = new Mesh(gl, { geometry, program: outputProgram });

    /* ------------------------------------------------------------ */
    /*  Animation loop                                               */
    /* ------------------------------------------------------------ */
    const animate = () => {
      // Run fluid simulation step
      fluid.update();

      // Update output uniforms from fluid + images state
      const u = outputProgram.uniforms;
      u.tFluid.value = fluid.texture;
      u.tMapA.value = images.textureA || fallbackTexture;
      u.tMapB.value = images.textureB || fallbackTexture;
      u.uProgress.value = images.progress;
      u.uFadeProgress.value = images.fadeProgress;
      u.uMode.value = images.mode;
      u.uStrength.value = images.strength;
      u.uLateral.value = images.lateral;
      u.uDistort.value = images.distort;
      u.uIntensity.value = images.intensity;
      u.uColor.value = images.color;
      u.uResolution.value = [renderer.width, renderer.height];
      u.uImageResA.value = images.imageResA;
      u.uImageResB.value = images.imageResB;
      u.uZoomFrom.value = images.zoomFrom;
      u.uRotationFrom.value = images.rotationFrom;
      u.uImageMix.value = images.imageMix;

      // Render to screen
      renderer.render({ scene: outputMesh });

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    /* ------------------------------------------------------------ */
    /*  Pointer interaction (21TSI-style velocity tracking)          */
    /* ------------------------------------------------------------ */
    let lastPointerTime = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let pointerActive = false;
    let velocityX = 0;
    let velocityY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      if (!pointerActive) {
        // First move — initialize without splat
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        lastPointerTime = performance.now();
        pointerActive = true;
        mouseRef.current = { x, y, prevX: x, prevY: y };
        return;
      }

      // Time-based velocity (like 21TSI's flowmap)
      const now = performance.now();
      const dt = Math.max(14, now - lastPointerTime);
      lastPointerTime = now;

      const deltaX = e.clientX - lastPointerX;
      const deltaY = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;

      // Velocity normalized by time (smoother than raw deltas)
      velocityX = deltaX / dt;
      velocityY = deltaY / dt;

      mouseRef.current = { x, y, prevX: x, prevY: y };

      // Only splat when there's meaningful movement
      if (Math.abs(velocityX) > 0.001 || Math.abs(velocityY) > 0.001) {
        // Scale velocity back up for the splat (time-normalized values are small)
        fluid.splat(x, y, velocityX * 0.8, velocityY * 0.8);
      }
    };
    window.addEventListener("pointermove", handlePointerMove);

    /* ------------------------------------------------------------ */
    /*  Scroll-driven section transitions (listen on window)         */
    /*  LS v5 dispatches CustomEvents on window for                  */
    /*  data-scroll-event-progress and data-scroll-call              */
    /* ------------------------------------------------------------ */

    // Direct LS v5 sectionTransition progress events
    const handleSectionTransition = (e: Event) => {
      const { target, progress } = (e as CustomEvent).detail;
      const from = target.getAttribute("data-from");
      const to = target.getAttribute("data-to");
      if (to && STEPS[to] && progress > 0 && progress < 1) {
        images.onProgress(progress, from || "hero", to);
      }
    };

    // AnimationController dispatches webgl:transition (redundant safety)
    const handleWebGLTransition = (e: Event) => {
      const { progress, from, to } = (e as CustomEvent).detail;
      if (to && STEPS[to]) {
        images.onProgress(progress, from || "hero", to);
      }
    };

    // Slide change events from AnimationController (recognition, manifesto, accordions)
    const handleSlideChange = (e: Event) => {
      const { index, step } = (e as CustomEvent).detail;
      if (step) images.setStep(step);
      images.changeSlide(index ?? 0);
    };

    // Section activation → set current step for image system
    const handleActivateSection = (e: Event) => {
      const { target, way } = (e as CustomEvent).detail;
      if (way !== "enter") return;
      const scrollTarget = target.getAttribute("data-scroll-target");
      // Map scroll targets to image step keys
      const stepMap: Record<string, string> = {
        hero: "hero",
        sport: "sport",
        manifesto: "manifesto",
        customers: "brands",
        sphere: "sphere",
        experimentation: "experimentation",
        focus: "focus",
        join: "join",
        invest: "invest",
      };
      const stepKey = stepMap[scrollTarget] || scrollTarget;
      if (stepKey && STEPS[stepKey]) {
        images.setStep(stepKey);
      }
    };

    window.addEventListener("sectionTransition", handleSectionTransition);
    window.addEventListener("webgl:transition", handleWebGLTransition);
    window.addEventListener("webgl:changeSlide", handleSlideChange);
    window.addEventListener("activateSection", handleActivateSection);

    /* ------------------------------------------------------------ */
    /*  Mobile mode switching on resize                              */
    /* ------------------------------------------------------------ */
    const handleMobileCheck = () => {
      const mobile = window.innerWidth < 768;
      images.setMobileMode(mobile);
    };
    window.addEventListener("resize", handleMobileCheck);

    /* ------------------------------------------------------------ */
    /*  Cleanup                                                      */
    /* ------------------------------------------------------------ */
    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleMobileCheck);
      window.removeEventListener("sectionTransition", handleSectionTransition);
      window.removeEventListener("webgl:transition", handleWebGLTransition);
      window.removeEventListener("webgl:changeSlide", handleSlideChange);
      window.removeEventListener("activateSection", handleActivateSection);
      gl.canvas.remove();
    };
  }, []);

  return (
    <div ref={containerRef} className="render">
      <div className="render_blur" />
    </div>
  );
}
