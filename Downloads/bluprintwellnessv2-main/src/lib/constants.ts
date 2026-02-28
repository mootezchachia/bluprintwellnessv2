export const COLORS = {
  black: "#000000",
  white: "#ffffff",
  overlay: "rgba(0,0,0,.1)",
  overlayDark: "rgba(0,0,0,.3)",
} as const;

export const BREAKPOINTS = {
  md: 1199,
  sm: 979,
  xs: 767,
  xxs: 359,
} as const;

export const EASING = {
  smooth: "cubic-bezier(0.19, 1, 0.22, 1)",
  smoothArray: [0.19, 1, 0.22, 1] as [number, number, number, number],
} as const;

export const SECTION_NAMES = [
  "hero",
  "sport",
  "manifesto",
  "customers",
  "sphere",
  "experimentation",
  "focus",
  "join",
  "invest",
  "contact",
] as const;

export type SectionName = (typeof SECTION_NAMES)[number];

export const CIRCLE_STATES: Record<string, number> = {
  hero: 0,
  sport: 1,
  manifesto: 2,
  customers: 3,
  sphere: 4,
  experimentation: 5,
  focus: 7,
  join: 8,
  invest: 8,
};

export const SECTION_TRANSITIONS: Array<{ from: string; to: string }> = [
  { from: "hero", to: "sport" },
  { from: "sport", to: "manifesto" },
  { from: "manifesto", to: "brands" },
  { from: "brands", to: "sphere" },
  { from: "sphere", to: "experimentation" },
  { from: "experimentation", to: "focus" },
  { from: "focus", to: "join" },
  { from: "join", to: "invest" },
];

export const NAVBAR_SECTIONS = [
  { id: "intro", label: "" },
  { id: "sphere", label: "The Sphere Lab" },
  { id: "join", label: "Join The Team" },
  { id: "invest", label: "Invest" },
];

export const GA_MEASUREMENT_ID = "G-78TYLBY8MY";
export const META_PIXEL_ID = "1186413442376538";
