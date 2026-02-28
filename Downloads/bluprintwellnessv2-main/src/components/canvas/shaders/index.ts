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

// 12. Output composite shader (full version with dual-image transitions + fluid distortion)
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

void main() {
  vec4 fluid = texture(tFluid, vUv);

  vec2 uvA = coverUV(vUv, uImageResA, uResolution);
  vec2 uvB = coverUV(vUv, uImageResB, uResolution);

  // Apply fluid distortion
  uvA -= fluid.rg * uDistort;
  uvB -= fluid.rg * uDistort;

  vec4 texA = texture(tMapA, uvA);
  vec4 texB = texture(tMapB, uvB);

  // Morph transition (mode 0)
  float morphProgress = uProgress;
  float lumA = dot(texA.rgb, vec3(0.299, 0.587, 0.114));
  float lumB = dot(texB.rgb, vec3(0.299, 0.587, 0.114));
  vec2 dispA = vec2(lumA * uStrength * morphProgress, lumA * uLateral * morphProgress);
  vec2 dispB = vec2(lumB * uStrength * (1.0 - morphProgress), lumB * uLateral * (1.0 - morphProgress));
  vec4 morphA = texture(tMapA, uvA + dispA);
  vec4 morphB = texture(tMapB, uvB - dispB);
  vec4 morphResult = mix(morphA, morphB, morphProgress);

  // Fade transition (mode 1)
  float fadeT = easeQuadOut(uFadeProgress);
  float zoomA = mix(1.0, uZoomFrom, 1.0 - fadeT);
  float zoomB = mix(uZoomFrom, 1.0, fadeT);
  float rotA = mix(0.0, uRotationFrom, 1.0 - fadeT);
  float rotB = mix(-uRotationFrom, 0.0, fadeT);
  vec2 zoomedUvA = (uvA - 0.5) * zoomA + 0.5;
  vec2 zoomedUvB = (uvB - 0.5) * zoomB + 0.5;
  zoomedUvA = rotateUV(zoomedUvA, rotA);
  zoomedUvB = rotateUV(zoomedUvB, rotB);
  zoomedUvA -= fluid.rg * uDistort;
  zoomedUvB -= fluid.rg * uDistort;
  vec4 fadeA = texture(tMapA, zoomedUvA);
  vec4 fadeB = texture(tMapB, zoomedUvB);
  vec4 fadeResult = mix(fadeA, fadeB, fadeT);

  // Select mode
  vec4 result = mix(morphResult, fadeResult, step(0.5, uMode));

  // Mix with blank if no image
  result = mix(vec4(0.0, 0.0, 0.0, 1.0), result, uImageMix);

  // Add fluid color overlay
  float fluidLen = length(fluid.rg);
  result.rgb += uColor * fluidLen * uIntensity;

  outColor = result;
}`;
