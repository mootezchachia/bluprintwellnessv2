import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precision Aesthetics | Bluprint Wellness",
  description:
    "Next-level aesthetics in Solana Beach — Morpheus8 RF Microneedling, Botox®, dermal fillers, and Candela GentleMax Pro Plus laser services by Suzanne Dean, RN.",
};

export default function AestheticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
