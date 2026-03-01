import { Texture } from "ogl";
import type { OGLRenderingContext } from "ogl";

/* ------------------------------------------------------------------ */
/*  Step definitions                                                   */
/* ------------------------------------------------------------------ */

export interface StepImages {
  desktop: string[];
  mobile: string[];
}

/*
 * Transition chain: hero → sport → manifesto → brands → sphere → experimentation → focus → join → invest
 * RULE: Every adjacent pair MUST have different [0] images for visible morph transitions.
 *
 * hero[0]           = hero.webp          (athletic torso)
 * sport[0]          = customer-1.webp    (balanced stones)
 * manifesto[0]      = customer-2.webp    (ice on skin)
 * brands[0]         = customer-1.webp    (athletic man — slide 1 of recognition)
 * sphere[0]         = join.webp          (Bluprint lobby — The Studio)
 * experimentation[0]= detail-1.webp      (personal training)
 * focus[0]          = focus-1.webp       (treadmills)
 * join[0]           = customer-3.webp    (B&W rocks)
 * invest[0]         = customer-2.webp    (ice close-up)
 */
export const STEPS: Record<string, StepImages> = {
  hero: {
    desktop: ["/images/desktop/hero.webp"],
    mobile: ["/images/mobile/hero.webp"],
  },
  sport: {
    desktop: ["/images/desktop/customer-1.webp"],
    mobile: ["/images/mobile/customer-1.webp"],
  },
  manifesto: {
    desktop: [
      "/images/desktop/customer-2.webp",
      "/images/desktop/customer-3.webp",
      "/images/desktop/customer-4.webp",
    ],
    mobile: [
      "/images/mobile/customer-2.webp",
      "/images/mobile/customer-3.webp",
      "/images/mobile/customer-4.webp",
    ],
  },
  brands: {
    desktop: [
      "/images/desktop/customer-1.webp",
      "/images/desktop/customer-2.webp",
      "/images/desktop/customer-3.webp",
    ],
    mobile: [
      "/images/mobile/customer-1.webp",
      "/images/mobile/customer-2.webp",
      "/images/mobile/customer-3.webp",
    ],
  },
  sphere: {
    desktop: ["/images/desktop/join.webp"],
    mobile: ["/images/mobile/join.webp"],
  },
  experimentation: {
    desktop: [
      "/images/desktop/detail-1.webp",
      "/images/desktop/detail-2.webp",
      "/images/desktop/detail-3.webp",
    ],
    mobile: [
      "/images/mobile/detail-1.webp",
      "/images/mobile/detail-2.webp",
      "/images/mobile/detail-3.webp",
    ],
  },
  focusIntro: {
    desktop: ["/images/desktop/detail-3.webp"],
    mobile: ["/images/mobile/detail-3.webp"],
  },
  focus: {
    desktop: [
      "/images/desktop/focus-1.webp",
      "/images/desktop/focus-2.webp",
      "/images/desktop/focus-3.webp",
      "/images/desktop/focus-4.webp",
    ],
    mobile: [
      "/images/mobile/focus-1.webp",
      "/images/mobile/focus-2.webp",
      "/images/mobile/focus-3.webp",
      "/images/mobile/focus-4.webp",
    ],
  },
  join: {
    desktop: ["/images/desktop/customer-3.webp"],
    mobile: ["/images/mobile/customer-3.webp"],
  },
  invest: {
    desktop: ["/images/desktop/customer-2.webp"],
    mobile: ["/images/mobile/customer-2.webp"],
  },
  blank: {
    desktop: ["/images/desktop/hero.webp"],
    mobile: ["/images/mobile/hero.webp"],
  },
};

/** Ordered step keys for iteration. */
export const STEP_ORDER = Object.keys(STEPS);

/* ------------------------------------------------------------------ */
/*  ImageTransition                                                    */
/* ------------------------------------------------------------------ */

export class ImageTransition {
  private gl: OGLRenderingContext;

  /* ----- texture cache ----- */
  private cache: Map<string, Texture> = new Map();
  private loadingPromises: Map<string, Promise<Texture | null>> = new Map();

  /* ----- dual texture slots ----- */
  public textureA: Texture;
  public textureB: Texture;
  public imageResA: [number, number] = [1, 1];
  public imageResB: [number, number] = [1, 1];

  /* ----- transition uniforms ----- */
  public progress = 0; // morph progress (mode 0) 0..1
  public fadeProgress = 0; // fade progress (mode 1) 0..1
  public mode = 0; // 0 = morph, 1 = fade
  public imageMix = 0; // 0 = black, 1 = show images

  /* ----- shader parameters ----- */
  public strength = 0.1;
  public lateral = 0.5;
  public distort = 0.003;
  public intensity = 0.1;
  public color: [number, number, number] = [0.125, 0.125, 0.125]; // #202020

  /* ----- fade parameters (set per transition) ----- */
  public zoomFrom = 1.0;
  public rotationFrom = 0.0;

  /* ----- state ----- */
  private isMobile = false;
  private currentStepKey = "";
  private currentSlideIndex = 0;
  private fadeAnimationId: number | null = null;
  private fallbackTexture: Texture;
  private _carouselLock = false; // true while a carousel controls images
  private _lastSlidePerStep: Map<string, number> = new Map(); // tracks last slide index per step

  constructor(gl: OGLRenderingContext) {
    this.gl = gl;

    // Create 1x1 black fallback texture
    this.fallbackTexture = new Texture(gl, {
      width: 1,
      height: 1,
      image: new Uint8Array([0, 0, 0, 255]),
    });

    this.textureA = this.fallbackTexture;
    this.textureB = this.fallbackTexture;

    // Detect mobile
    this.isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  }

  /* ================================================================ */
  /*  Image Loading                                                    */
  /* ================================================================ */

  /** Load a single image URL, returns cached texture or loads new one. */
  private loadTexture(url: string): Promise<Texture | null> {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url)!);
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const promise = new Promise<Texture | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const texture = new Texture(this.gl, {
          image: img,
          generateMipmaps: false,
        });
        this.cache.set(url, texture);
        this.loadingPromises.delete(url);
        resolve(texture);
      };
      img.onerror = () => {
        this.loadingPromises.delete(url);
        resolve(null);
      };
      img.src = url;
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  /** Preload all images for a given step key. */
  async preloadStep(key: string): Promise<void> {
    const step = STEPS[key];
    if (!step) return;
    const urls = this.isMobile ? step.mobile : step.desktop;
    await Promise.all(urls.map((url) => this.loadTexture(url)));
  }

  /** Preload all images for all steps. */
  async preloadAll(): Promise<void> {
    const allUrls = new Set<string>();
    for (const key of STEP_ORDER) {
      const step = STEPS[key];
      const urls = this.isMobile ? step.mobile : step.desktop;
      urls.forEach((url) => allUrls.add(url));
    }
    await Promise.all([...allUrls].map((url) => this.loadTexture(url)));
  }

  /* ================================================================ */
  /*  Mode switching                                                   */
  /* ================================================================ */

  setMobileMode(mobile: boolean) {
    if (this.isMobile === mobile) return;
    this.isMobile = mobile;
  }

  /* ================================================================ */
  /*  Texture resolution helpers                                       */
  /* ================================================================ */

  private getTextureRes(tex: Texture): [number, number] {
    if (tex === this.fallbackTexture) return [1, 1];
    return [tex.width || 1, tex.height || 1];
  }

  private getImageUrl(stepKey: string, slideIndex: number): string | null {
    const step = STEPS[stepKey];
    if (!step) return null;
    const urls = this.isMobile ? step.mobile : step.desktop;
    if (slideIndex < 0 || slideIndex >= urls.length) return null;
    return urls[slideIndex];
  }

  private getTextureForUrl(url: string): Texture {
    return this.cache.get(url) || this.fallbackTexture;
  }

  /* ================================================================ */
  /*  Morph transition (mode 0) - scroll driven                        */
  /* ================================================================ */

  /**
   * Called by scroll system. Sets tMapA to `fromKey` image and tMapB to `toKey` image.
   * Progress goes 0 -> 1 during the scroll between sections.
   */
  onProgress(progress: number, fromKey: string, toKey: string) {
    if (this._carouselLock) return;

    // If a slide fade is in progress, complete it immediately to allow the morph
    if (this.fadeAnimationId !== null) {
      cancelAnimationFrame(this.fadeAnimationId);
      this.fadeAnimationId = null;
      this.textureA = this.textureB;
      this.imageResA = [...this.imageResB] as [number, number];
      this.fadeProgress = 0;
      this.mode = 0;
      this.progress = 0;
    }

    this.mode = 0;

    // Use last known slide index for the "from" step
    // (preserves accordion/carousel position, e.g. focus-4 instead of focus-1)
    const fromSlideIdx = this._lastSlidePerStep.get(fromKey) ?? 0;
    const fromUrl = this.getImageUrl(fromKey, fromSlideIdx);
    const toUrl = this.getImageUrl(toKey, 0);

    if (fromUrl) {
      const tex = this.getTextureForUrl(fromUrl);
      if (tex !== this.fallbackTexture) {
        this.textureA = tex;
        this.imageResA = this.getTextureRes(tex);
      }
    }

    if (toUrl) {
      const tex = this.getTextureForUrl(toUrl);
      if (tex !== this.fallbackTexture) {
        this.textureB = tex;
        this.imageResB = this.getTextureRes(tex);
      }
    }

    this.progress = Math.max(0, Math.min(1, progress));
    this.imageMix = 1;
  }

  /* ================================================================ */
  /*  Fade transition (mode 1) - animated slide change                 */
  /* ================================================================ */

  /**
   * Animate to a new slide within the current step.
   * Used for sections with multiple images (manifesto, experimentation, focus, brands).
   */
  changeSlide(
    index: number,
    duration = 0.8,
    zoomFrom = 1.05,
    rotationFrom = 0.02,
    trusted = false,
  ) {
    // Block non-trusted slide changes while carousel is locked
    if (this._carouselLock && !trusted) return;

    // Cancel any running fade animation
    if (this.fadeAnimationId !== null) {
      cancelAnimationFrame(this.fadeAnimationId);
      this.fadeAnimationId = null;
    }

    const stepKey = this.currentStepKey;
    const step = STEPS[stepKey];
    if (!step) return;

    const urls = this.isMobile ? step.mobile : step.desktop;
    if (index < 0 || index >= urls.length) return;

    const fromIndex = this.currentSlideIndex;
    const toIndex = index;

    if (fromIndex === toIndex) return;

    // Track target slide immediately so sectionTransition morphs use the right "from" image
    this._lastSlidePerStep.set(this.currentStepKey, toIndex);

    // Set A = current slide, B = target slide
    const fromUrl = urls[fromIndex];
    const toUrl = urls[toIndex];

    if (fromUrl) {
      const tex = this.getTextureForUrl(fromUrl);
      this.textureA = tex;
      this.imageResA = this.getTextureRes(tex);
    }

    if (toUrl) {
      const tex = this.getTextureForUrl(toUrl);
      this.textureB = tex;
      this.imageResB = this.getTextureRes(tex);
    }

    this.mode = 1;
    this.zoomFrom = zoomFrom;
    this.rotationFrom = rotationFrom;
    this.fadeProgress = 0;
    this.imageMix = 1;

    // Animate fadeProgress from 0 to 1
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      this.fadeProgress = t;

      if (t < 1) {
        this.fadeAnimationId = requestAnimationFrame(animate);
      } else {
        this.fadeAnimationId = null;
        this.currentSlideIndex = toIndex;
        // After fade completes, swap: A = new current, keep mode 1 until next transition
        this.textureA = this.textureB;
        this.imageResA = [...this.imageResB] as [number, number];
        this.fadeProgress = 0;
        this.mode = 0;
        this.progress = 0;
      }
    };

    this.fadeAnimationId = requestAnimationFrame(animate);
  }

  /* ================================================================ */
  /*  Step change (between sections)                                   */
  /* ================================================================ */

  /**
   * Set the active step and optionally reset to slide 0.
   */
  setStep(key: string) {
    if (this.currentStepKey === key) return;
    // Block step changes while carousel is locked (e.g. sphere activation during recognition)
    if (this._carouselLock) return;

    // Save current step's slide position before changing
    if (this.currentStepKey) {
      this._lastSlidePerStep.set(this.currentStepKey, this.currentSlideIndex);
    }

    this.currentStepKey = key;
    this.currentSlideIndex = 0;

    // Only load textures on cold start (no visible image yet).
    // During scroll transitions, sectionTransition morphs handle the visual change
    // — loading here would snap the image and break the smooth morph.
    if (this.textureA !== this.fallbackTexture) return;

    // Cold start: load first image of the new step as the "A" texture
    const url = this.getImageUrl(key, 0);
    if (url) {
      const tex = this.getTextureForUrl(url);
      if (tex !== this.fallbackTexture) {
        this.textureA = tex;
        this.imageResA = this.getTextureRes(tex);
        this.imageMix = 1;
      } else {
        // Texture not yet loaded — load it async then apply
        this.loadTexture(url).then((loadedTex) => {
          if (loadedTex && this.currentStepKey === key) {
            this.textureA = loadedTex;
            this.imageResA = this.getTextureRes(loadedTex);
            this.imageMix = 1;
          }
        });
      }
    }
  }

  /**
   * Lock sectionTransition morphs (carousel is controlling images).
   */
  lockCarousel() {
    this._carouselLock = true;
  }

  /**
   * Unlock sectionTransition morphs.
   */
  unlockCarousel() {
    this._carouselLock = false;
  }

  /**
   * Show no image (black).
   */
  hide() {
    this.imageMix = 0;
  }

  /**
   * Show current image.
   */
  show() {
    this.imageMix = 1;
  }

  /* ================================================================ */
  /*  Getters for current state                                        */
  /* ================================================================ */

  get stepKey(): string {
    return this.currentStepKey;
  }

  get slideIndex(): number {
    return this.currentSlideIndex;
  }

  get slideCount(): number {
    const step = STEPS[this.currentStepKey];
    if (!step) return 0;
    return (this.isMobile ? step.mobile : step.desktop).length;
  }
}
