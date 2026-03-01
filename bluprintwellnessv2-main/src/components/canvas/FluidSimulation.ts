import { Renderer, Program, Mesh, Triangle, RenderTarget, Texture } from "ogl";
import type { OGLRenderingContext } from "ogl";

import {
  fluidVert,
  baseVert,
  clearFrag,
  splatFrag,
  advectionFrag,
  advectionManualFrag,
  divergenceFrag,
  curlFrag,
  vorticityFrag,
  pressureFrag,
  gradientSubtractFrag,
} from "./shaders";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DoubleFBO {
  read: RenderTarget;
  write: RenderTarget;
}

interface SplatData {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: [number, number, number];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Check if rendering to the given format+type is supported (color-renderable). */
function supportedFormat(
  gl: WebGL2RenderingContext,
  internalFormat: number,
  format: number,
  type: number,
): { internalFormat: number; format: number } | null {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

  gl.deleteTexture(tex);
  gl.deleteFramebuffer(fb);

  // Reset to previous framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  if (status !== gl.FRAMEBUFFER_COMPLETE) return null;
  return { internalFormat, format };
}

/** Generate a subtle density color for quick pulse effect. */
function randomDensityColor(): [number, number, number] {
  const r = Math.random() * 0.25 + 0.1;
  const g = Math.random() * 0.25 + 0.1;
  const b = Math.random() * 0.25 + 0.1;
  return [r, g, b];
}

/* ------------------------------------------------------------------ */
/*  FluidSimulation                                                    */
/* ------------------------------------------------------------------ */

export class FluidSimulation {
  private renderer: Renderer;
  private gl: OGLRenderingContext;

  /* ----- render targets ----- */
  private velocity!: DoubleFBO;
  private density!: DoubleFBO;
  private pressure!: DoubleFBO;
  private divergenceFBO!: RenderTarget;
  private curlFBO!: RenderTarget;

  /* ----- programs ----- */
  private clearProgram!: Program;
  private splatProgram!: Program;
  private curlProgram!: Program;
  private vorticityProgram!: Program;
  private divergenceProgram!: Program;
  private pressureProgram!: Program;
  private gradientSubtractProgram!: Program;
  private advectionProgram!: Program;

  /* ----- geometry / mesh ----- */
  private mesh!: Mesh;

  /* ----- state ----- */
  private splatQueue: SplatData[] = [];
  private supportLinearFiltering: boolean = false;

  /* ----- parameters ----- */
  private simRes = 128;
  private dyeRes = 512;
  private radius = 0.0015;
  private densityDissipation = 0.96;
  private velocityDissipation = 0.97;
  private pressureDissipation = 0.8;
  private curlStrength = 3;
  private mouseVelocityForce = 15;
  private dt = 0.016;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.gl = renderer.gl;

    this.detectCapabilities();
    this.createRenderTargets();
    this.createPrograms();
  }

  /* ================================================================ */
  /*  Initialization                                                   */
  /* ================================================================ */

  private detectCapabilities() {
    const gl = this.gl as unknown as WebGL2RenderingContext;
    // In WebGL2 linear filtering for float textures requires OES_texture_float_linear
    const ext = gl.getExtension("OES_texture_float_linear");
    this.supportLinearFiltering = !!ext;
  }

  private createRenderTargets() {
    const gl2 = this.gl as unknown as WebGL2RenderingContext;
    const oglGl = this.gl; // typed as OGLRenderingContext for OGL constructors

    // Determine best half-float format
    const halfFloat = gl2.HALF_FLOAT;

    // Try RG16F for velocity, fallback to RGBA16F
    const rgFormat = supportedFormat(gl2, gl2.RG16F, gl2.RG, halfFloat);
    const rgbaFormat = supportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, halfFloat);
    const rFormat = supportedFormat(gl2, gl2.R16F, gl2.RED, halfFloat);

    // Velocity: prefer RG16F, fallback RGBA16F
    const velFmt = rgFormat || rgbaFormat;
    // Scalar fields (pressure, divergence, curl): prefer R16F, fallback RGBA16F
    const scalarFmt = rFormat || rgbaFormat;
    // Density: always RGBA16F
    const dyeFmt = rgbaFormat;

    if (!velFmt || !scalarFmt || !dyeFmt) {
      console.error("FluidSimulation: Required float texture formats not available");
      return;
    }

    const simW = this.simRes;
    const simH = this.simRes;
    const dyeW = this.dyeRes;
    const dyeH = this.dyeRes;

    const linearFilter = this.supportLinearFiltering ? gl2.LINEAR : gl2.NEAREST;

    // Helper to create a single FBO
    const createFBO = (
      w: number,
      h: number,
      fmt: { internalFormat: number; format: number },
      filter: number,
    ): RenderTarget => {
      return new RenderTarget(oglGl, {
        width: w,
        height: h,
        type: halfFloat,
        format: fmt.format,
        internalFormat: fmt.internalFormat,
        minFilter: filter,
        magFilter: filter,
        depth: false,
      });
    };

    // Helper to create a double (ping-pong) FBO
    const createDoubleFBO = (
      w: number,
      h: number,
      fmt: { internalFormat: number; format: number },
      filter: number,
    ): DoubleFBO => {
      return {
        read: createFBO(w, h, fmt, filter),
        write: createFBO(w, h, fmt, filter),
      };
    };

    // Velocity: 128x128, LINEAR
    this.velocity = createDoubleFBO(simW, simH, velFmt, linearFilter);

    // Density (dye): 512x512, LINEAR
    this.density = createDoubleFBO(dyeW, dyeH, dyeFmt, linearFilter);

    // Pressure: 128x128, NEAREST
    this.pressure = createDoubleFBO(simW, simH, scalarFmt, gl2.NEAREST);

    // Divergence: 128x128, NEAREST, single FBO
    this.divergenceFBO = createFBO(simW, simH, scalarFmt, gl2.NEAREST);

    // Curl: 128x128, NEAREST, single FBO
    this.curlFBO = createFBO(simW, simH, scalarFmt, gl2.NEAREST);
  }

  private createPrograms() {
    const gl = this.gl;
    const geometry = new Triangle(gl);

    const simTexelSize = [1.0 / this.simRes, 1.0 / this.simRes];
    const dyeTexelSize = [1.0 / this.dyeRes, 1.0 / this.dyeRes];

    // ----- Clear -----
    this.clearProgram = new Program(gl, {
      vertex: fluidVert,
      fragment: clearFrag,
      uniforms: {
        texelSize: { value: simTexelSize },
        uTexture: { value: null as Texture | null },
        uClearValue: { value: this.pressureDissipation },
      },
      depthTest: false,
      depthWrite: false,
    });

    // ----- Splat -----
    this.splatProgram = new Program(gl, {
      vertex: baseVert,
      fragment: splatFrag,
      uniforms: {
        uTarget: { value: null as Texture | null },
        uAspectRatio: { value: 1.0 },
        uColor: { value: [0.0, 0.0, 0.0] },
        uPointer: { value: [0.0, 0.0] },
        uRadius: { value: this.radius },
      },
      depthTest: false,
      depthWrite: false,
    });

    // ----- Curl -----
    this.curlProgram = new Program(gl, {
      vertex: fluidVert,
      fragment: curlFrag,
      uniforms: {
        texelSize: { value: simTexelSize },
        uVelocity: { value: null as Texture | null },
      },
      depthTest: false,
      depthWrite: false,
    });

    // ----- Vorticity -----
    this.vorticityProgram = new Program(gl, {
      vertex: fluidVert,
      fragment: vorticityFrag,
      uniforms: {
        texelSize: { value: simTexelSize },
        uVelocity: { value: null as Texture | null },
        uCurl: { value: null as Texture | null },
        uCurlValue: { value: this.curlStrength },
        dt: { value: this.dt },
      },
      depthTest: false,
      depthWrite: false,
    });

    // ----- Divergence -----
    this.divergenceProgram = new Program(gl, {
      vertex: fluidVert,
      fragment: divergenceFrag,
      uniforms: {
        texelSize: { value: simTexelSize },
        uVelocity: { value: null as Texture | null },
      },
      depthTest: false,
      depthWrite: false,
    });

    // ----- Pressure (Jacobi) -----
    this.pressureProgram = new Program(gl, {
      vertex: fluidVert,
      fragment: pressureFrag,
      uniforms: {
        texelSize: { value: simTexelSize },
        uPressure: { value: null as Texture | null },
        uDivergence: { value: null as Texture | null },
      },
      depthTest: false,
      depthWrite: false,
    });

    // ----- Gradient Subtract -----
    this.gradientSubtractProgram = new Program(gl, {
      vertex: fluidVert,
      fragment: gradientSubtractFrag,
      uniforms: {
        texelSize: { value: simTexelSize },
        uPressure: { value: null as Texture | null },
        uVelocity: { value: null as Texture | null },
      },
      depthTest: false,
      depthWrite: false,
    });

    // ----- Advection -----
    // Use manual bilinear interpolation when linear filtering is not available
    const advectionShader = this.supportLinearFiltering
      ? advectionFrag
      : advectionManualFrag;

    const advectionUniforms: Record<string, { value: unknown }> = {
      texelSize: { value: simTexelSize },
      uVelocity: { value: null as Texture | null },
      uSource: { value: null as Texture | null },
      dt: { value: this.dt },
      uDissipation: { value: 1.0 },
    };

    // Manual advection also uses dyeTexelSize
    if (!this.supportLinearFiltering) {
      advectionUniforms.dyeTexelSize = { value: dyeTexelSize };
    }

    this.advectionProgram = new Program(gl, {
      vertex: baseVert,
      fragment: advectionShader,
      uniforms: advectionUniforms,
      depthTest: false,
      depthWrite: false,
    });

    // Create the mesh (shared geometry, program swapped per pass)
    this.mesh = new Mesh(gl, { geometry, program: this.clearProgram });
  }

  /* ================================================================ */
  /*  Render helpers                                                   */
  /* ================================================================ */

  private blit(target: RenderTarget | null) {
    this.renderer.render({
      scene: this.mesh,
      target: target ?? undefined,
      sort: false,
      frustumCull: false,
      update: false,
    } as Parameters<Renderer["render"]>[0]);
  }

  private swap(fbo: DoubleFBO) {
    const tmp = fbo.read;
    fbo.read = fbo.write;
    fbo.write = tmp;
  }

  /* ================================================================ */
  /*  Public API                                                       */
  /* ================================================================ */

  /** Queue a splat at normalised coordinates with velocity deltas. */
  splat(x: number, y: number, dx: number, dy: number) {
    this.splatQueue.push({
      x,
      y: 1.0 - y, // flip Y for GL
      dx: dx * this.mouseVelocityForce,
      dy: -dy * this.mouseVelocityForce, // flip Y
      color: randomDensityColor(),
    });
  }

  /** The density texture to sample in the output composite shader. */
  get texture(): Texture {
    return this.density.read.texture;
  }

  /* ================================================================ */
  /*  Simulation step                                                  */
  /* ================================================================ */

  update() {
    const aspect = this.renderer.width / this.renderer.height;

    /* ---- 1. Process queued splats ---- */
    for (const s of this.splatQueue) {
      // Splat into velocity
      this.mesh.program = this.splatProgram;
      this.splatProgram.uniforms.uTarget.value = this.velocity.read.texture;
      this.splatProgram.uniforms.uAspectRatio.value = aspect;
      this.splatProgram.uniforms.uPointer.value = [s.x, s.y];
      this.splatProgram.uniforms.uColor.value = [s.dx, s.dy, 1.0];
      this.splatProgram.uniforms.uRadius.value = this.radius;
      this.blit(this.velocity.write);
      this.swap(this.velocity);

      // Splat into density
      this.splatProgram.uniforms.uTarget.value = this.density.read.texture;
      this.splatProgram.uniforms.uColor.value = s.color;
      this.blit(this.density.write);
      this.swap(this.density);
    }
    this.splatQueue.length = 0;

    /* ---- 2. Compute curl ---- */
    this.mesh.program = this.curlProgram;
    this.curlProgram.uniforms.uVelocity.value = this.velocity.read.texture;
    this.blit(this.curlFBO);

    /* ---- 3. Vorticity confinement ---- */
    this.mesh.program = this.vorticityProgram;
    this.vorticityProgram.uniforms.uVelocity.value = this.velocity.read.texture;
    this.vorticityProgram.uniforms.uCurl.value = this.curlFBO.texture;
    this.blit(this.velocity.write);
    this.swap(this.velocity);

    /* ---- 4. Divergence ---- */
    this.mesh.program = this.divergenceProgram;
    this.divergenceProgram.uniforms.uVelocity.value = this.velocity.read.texture;
    this.blit(this.divergenceFBO);

    /* ---- 5. Clear / decay pressure ---- */
    this.mesh.program = this.clearProgram;
    this.clearProgram.uniforms.uTexture.value = this.pressure.read.texture;
    this.clearProgram.uniforms.uClearValue.value = this.pressureDissipation;
    this.blit(this.pressure.write);
    this.swap(this.pressure);

    /* ---- 6. Pressure solve (Jacobi iteration) ---- */
    this.mesh.program = this.pressureProgram;
    this.pressureProgram.uniforms.uDivergence.value = this.divergenceFBO.texture;
    for (let i = 0; i < 8; i++) {
      this.pressureProgram.uniforms.uPressure.value = this.pressure.read.texture;
      this.blit(this.pressure.write);
      this.swap(this.pressure);
    }

    /* ---- 7. Gradient subtract ---- */
    this.mesh.program = this.gradientSubtractProgram;
    this.gradientSubtractProgram.uniforms.uPressure.value = this.pressure.read.texture;
    this.gradientSubtractProgram.uniforms.uVelocity.value = this.velocity.read.texture;
    this.blit(this.velocity.write);
    this.swap(this.velocity);

    /* ---- 8. Advect velocity ---- */
    this.mesh.program = this.advectionProgram;
    this.advectionProgram.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectionProgram.uniforms.uSource.value = this.velocity.read.texture;
    this.advectionProgram.uniforms.uDissipation.value = this.velocityDissipation;

    if (!this.supportLinearFiltering && this.advectionProgram.uniforms.dyeTexelSize) {
      this.advectionProgram.uniforms.dyeTexelSize.value = [
        1.0 / this.simRes,
        1.0 / this.simRes,
      ];
    }

    this.blit(this.velocity.write);
    this.swap(this.velocity);

    /* ---- 9. Advect density ---- */
    this.advectionProgram.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectionProgram.uniforms.uSource.value = this.density.read.texture;
    this.advectionProgram.uniforms.uDissipation.value = this.densityDissipation;

    if (!this.supportLinearFiltering && this.advectionProgram.uniforms.dyeTexelSize) {
      this.advectionProgram.uniforms.dyeTexelSize.value = [
        1.0 / this.dyeRes,
        1.0 / this.dyeRes,
      ];
    }

    this.blit(this.density.write);
    this.swap(this.density);
  }
}
