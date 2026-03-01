// 1. Base vertex for fluid passes (with neighbor UVs)
export const fluidVert = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
out vec2 vL, vR, vT, vB;
uniform vec2 texelSize;
void main() {
  vUv = uv;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// 2. Simple vertex for output pass
export const baseVert = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// 3. Clear shader (pressure decay)
export const clearFrag = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
uniform sampler2D uTexture;
uniform float uClearValue;
out vec4 outColor;
void main() {
  outColor = uClearValue * texture(uTexture, vUv);
}`;

// 4. Splat shader
export const splatFrag = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uTarget;
uniform float uAspectRatio;
uniform vec3 uColor;
uniform vec2 uPointer;
uniform float uRadius;
out vec4 outColor;
void main() {
  vec2 p = vUv - uPointer;
  p.x *= uAspectRatio;
  float d = dot(p, p);
  vec3 splat = exp(-d / uRadius) * uColor;
  vec3 base = texture(uTarget, vUv).xyz;
  outColor = vec4(base + splat, 1.0);
}`;

// 5. Advection shader (manual bilinear interpolation)
export const advectionManualFrag = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform vec2 dyeTexelSize;
uniform float dt;
uniform float uDissipation;
out vec4 outColor;
vec4 bilerp(sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = texture(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}
void main() {
  vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
  outColor = uDissipation * bilerp(uSource, coord, dyeTexelSize);
  outColor.a = 1.0;
}`;

// 6. Advection shader (hardware linear filtering)
export const advectionFrag = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float uDissipation;
out vec4 outColor;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  outColor = uDissipation * texture(uSource, coord);
  outColor.a = 1.0;
}`;

// 7. Divergence shader
export const divergenceFrag = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
in vec2 vL, vR, vT, vB;
uniform sampler2D uVelocity;
out vec4 outColor;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  float div = 0.5 * (R - L + T - B);
  outColor = vec4(div, 0.0, 0.0, 1.0);
}`;

// 8. Curl shader
export const curlFrag = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
in vec2 vL, vR, vT, vB;
uniform sampler2D uVelocity;
out vec4 outColor;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  outColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}`;

// 9. Vorticity confinement shader
export const vorticityFrag = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL, vR, vT, vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uCurlValue;
uniform float dt;
out vec4 outColor;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= uCurlValue * C;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy;
  outColor = vec4(vel + force * dt, 0.0, 1.0);
}`;

// 10. Pressure solve (Jacobi iteration)
export const pressureFrag = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
in vec2 vL, vR, vT, vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
out vec4 outColor;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float C = texture(uDivergence, vUv).x;
  float pressure = (L + R + B + T - C) * 0.25;
  outColor = vec4(pressure, 0.0, 0.0, 1.0);
}`;

// 11. Gradient subtract shader
export const gradientSubtractFrag = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
in vec2 vL, vR, vT, vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
out vec4 outColor;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 vel = texture(uVelocity, vUv).xy;
  vel.xy -= vec2(R - L, T - B);
  outColor = vec4(vel, 0.0, 1.0);
}`;

// 12. Output composite shader (full version with dual-image transitions + fluid distortion + post-processing)
export const outputFrag = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D tFluid;
uniform sampler2D tMapA;
uniform sampler2D tMapB;
uniform float uProgress;
uniform float uFadeProgress;
uniform float uMode;
uniform float uStrength;
uniform float uLateral;
uniform float uDistort;
uniform float uIntensity;
uniform vec3 uColor;
uniform vec2 uResolution;
uniform vec2 uImageResA;
uniform vec2 uImageResB;
uniform float uZoomFrom;
uniform float uRotationFrom;
uniform float uImageMix;
// Post-processing uniforms
uniform float uTime;
uniform float uGrainIntensity;   // ~0.04
uniform float uChromaStrength;   // ~0.005
uniform float uVignetteStrength; // ~0.2
out vec4 outColor;

vec2 coverUV(vec2 uv, vec2 imgRes, vec2 screenRes) {
  float screenAspect = screenRes.x / screenRes.y;
  float imgAspect = imgRes.x / imgRes.y;
  vec2 scale = vec2(1.0);
  if (screenAspect > imgAspect) {
    scale.y = imgAspect / screenAspect;
  } else {
    scale.x = screenAspect / imgAspect;
  }
  return (uv - 0.5) * scale + 0.5;
}

float easeQuadOut(float t) {
  return t * (2.0 - t);
}

vec2 rotateUV(vec2 uv, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  uv -= 0.5;
  uv = mat2(c, -s, s, c) * uv;
  uv += 0.5;
  return uv;
}

// Film grain — animated blue-noise-like hash
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Helper: compute composite for a given UV offset (used for per-channel chromatic split)
vec4 composite(sampler2D mapA, sampler2D mapB, vec2 baseUvA, vec2 baseUvB,
               vec4 fluidSample, float distortAmt,
               float progress, float fadeProgress, float mode,
               float strength, float lateral,
               float zoomFrom, float rotFrom) {
  vec2 uA = baseUvA - fluidSample.rg * distortAmt;
  vec2 uB = baseUvB - fluidSample.rg * distortAmt;

  // Morph (mode 0)
  vec4 tA = texture(mapA, uA);
  vec4 tB = texture(mapB, uB);
  float lumA = dot(tA.rgb, vec3(0.299, 0.587, 0.114));
  float lumB = dot(tB.rgb, vec3(0.299, 0.587, 0.114));
  vec2 dA = vec2(lumA * strength * progress, lumA * lateral * progress);
  vec2 dB = vec2(lumB * strength * (1.0 - progress), lumB * lateral * (1.0 - progress));
  vec4 morphResult = mix(texture(mapA, uA + dA), texture(mapB, uB - dB), progress);

  // Fade (mode 1)
  float fT = easeQuadOut(fadeProgress);
  vec2 zA = (uA - 0.5) * mix(1.0, zoomFrom, 1.0 - fT) + 0.5;
  vec2 zB = (uB - 0.5) * mix(zoomFrom, 1.0, fT) + 0.5;
  zA = rotateUV(zA, mix(0.0, rotFrom, 1.0 - fT)) - fluidSample.rg * distortAmt;
  zB = rotateUV(zB, mix(-rotFrom, 0.0, fT)) - fluidSample.rg * distortAmt;
  vec4 fadeResult = mix(texture(mapA, zA), texture(mapB, zB), fT);

  return mix(morphResult, fadeResult, step(0.5, mode));
}

void main() {
  vec4 fluid = texture(tFluid, vUv);
  float fluidLen = length(fluid.rg);

  vec2 uvA = coverUV(vUv, uImageResA, uResolution);
  vec2 uvB = coverUV(vUv, uImageResB, uResolution);

  // ---- Chromatic aberration: per-channel fluid distortion offset ----
  // R/B channels get slightly different distortion, driven by fluid velocity
  vec2 chromaDir = (fluidLen > 0.001) ? normalize(fluid.rg) : vec2(0.0);
  float chromaAmt = fluidLen * uChromaStrength;

  // Green channel: standard distortion (center reference)
  vec4 gComposite = composite(tMapA, tMapB, uvA, uvB, fluid, uDistort,
    uProgress, uFadeProgress, uMode, uStrength, uLateral, uZoomFrom, uRotationFrom);

  vec4 result;
  if (chromaAmt > 0.0001) {
    // Red channel: offset UV in +chromaDir
    vec2 rOffA = uvA + chromaDir * chromaAmt;
    vec2 rOffB = uvB + chromaDir * chromaAmt;
    vec4 rComposite = composite(tMapA, tMapB, rOffA, rOffB, fluid, uDistort,
      uProgress, uFadeProgress, uMode, uStrength, uLateral, uZoomFrom, uRotationFrom);

    // Blue channel: offset UV in -chromaDir
    vec2 bOffA = uvA - chromaDir * chromaAmt;
    vec2 bOffB = uvB - chromaDir * chromaAmt;
    vec4 bComposite = composite(tMapA, tMapB, bOffA, bOffB, fluid, uDistort,
      uProgress, uFadeProgress, uMode, uStrength, uLateral, uZoomFrom, uRotationFrom);

    result = vec4(rComposite.r, gComposite.g, bComposite.b, 1.0);
  } else {
    result = gComposite;
  }

  // Mix with black if no image
  result = mix(vec4(0.0, 0.0, 0.0, 1.0), result, uImageMix);

  // Fluid color overlay
  result.rgb += uColor * fluidLen * uIntensity;

  // ---- Film grain ----
  float lum = dot(result.rgb, vec3(0.299, 0.587, 0.114));
  float grainAmount = uGrainIntensity * (1.0 - lum * 0.5);
  float noise = hash(vUv * uResolution + fract(uTime * 1.7) * 437.585) - 0.5;
  result.rgb += noise * grainAmount;

  // ---- Vignette ----
  float dist = length(vUv - 0.5) * 1.4;
  float vig = 1.0 - smoothstep(0.4, 1.1, dist) * uVignetteStrength;
  result.rgb *= vig;

  outColor = result;
}`;
