/**
 * Magnetic interaction — elements pull toward cursor when hovering nearby.
 * Uses requestAnimationFrame for smooth spring physics.
 */

interface MagneticInstance {
  el: HTMLElement;
  inner: HTMLElement | null;
  strength: number;
  innerStrength: number;
  threshold: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  innerCurrentX: number;
  innerCurrentY: number;
  innerTargetX: number;
  innerTargetY: number;
  active: boolean;
  raf: number | null;
}

const instances: MagneticInstance[] = [];
let listening = false;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function tick() {
  for (const inst of instances) {
    // Spring lerp toward target
    inst.currentX = lerp(inst.currentX, inst.targetX, 0.15);
    inst.currentY = lerp(inst.currentY, inst.targetY, 0.15);

    // Snap to zero when close enough
    if (Math.abs(inst.currentX) < 0.01 && Math.abs(inst.currentY) < 0.01 && !inst.active) {
      inst.currentX = 0;
      inst.currentY = 0;
    }

    inst.el.style.transform = `translate3d(${inst.currentX}px, ${inst.currentY}px, 0)`;

    // Inner element moves in the opposite direction (parallax feel)
    if (inst.inner) {
      inst.innerCurrentX = lerp(inst.innerCurrentX, inst.innerTargetX, 0.15);
      inst.innerCurrentY = lerp(inst.innerCurrentY, inst.innerTargetY, 0.15);

      if (Math.abs(inst.innerCurrentX) < 0.01 && Math.abs(inst.innerCurrentY) < 0.01 && !inst.active) {
        inst.innerCurrentX = 0;
        inst.innerCurrentY = 0;
      }

      inst.inner.style.transform = `translate3d(${inst.innerCurrentX}px, ${inst.innerCurrentY}px, 0)`;
    }
  }

  requestAnimationFrame(tick);
}

function handleMouseMove(e: MouseEvent) {
  for (const inst of instances) {
    const rect = inst.el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const threshold = inst.threshold || Math.max(rect.width, rect.height) * 0.7;

    if (dist < threshold) {
      inst.active = true;
      const pull = 1 - dist / threshold; // 1 at center, 0 at edge
      inst.targetX = dx * inst.strength * pull;
      inst.targetY = dy * inst.strength * pull;

      if (inst.inner) {
        inst.innerTargetX = dx * inst.innerStrength * pull;
        inst.innerTargetY = dy * inst.innerStrength * pull;
      }
    } else if (inst.active) {
      inst.active = false;
      inst.targetX = 0;
      inst.targetY = 0;
      inst.innerTargetX = 0;
      inst.innerTargetY = 0;
    }
  }
}

export function initMagnetic(
  el: HTMLElement,
  {
    strength = 0.3,
    innerStrength = 0.5,
    innerSelector,
    threshold,
  }: {
    strength?: number;
    innerStrength?: number;
    innerSelector?: string;
    threshold?: number;
  } = {}
) {
  const inner = innerSelector ? el.querySelector(innerSelector) as HTMLElement : null;

  const inst: MagneticInstance = {
    el,
    inner,
    strength,
    innerStrength,
    threshold: threshold || 0,
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    innerCurrentX: 0,
    innerCurrentY: 0,
    innerTargetX: 0,
    innerTargetY: 0,
    active: false,
    raf: null,
  };

  instances.push(inst);

  if (!listening) {
    listening = true;
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    requestAnimationFrame(tick);
  }

  return () => {
    const idx = instances.indexOf(inst);
    if (idx >= 0) instances.splice(idx, 1);
    el.style.transform = "";
    if (inner) inner.style.transform = "";
  };
}

export function destroyAllMagnetic() {
  instances.length = 0;
  if (listening) {
    window.removeEventListener("mousemove", handleMouseMove);
    listening = false;
  }
}
