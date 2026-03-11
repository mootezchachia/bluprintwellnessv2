import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Functional Medicine | Bluprint Wellness",
  description:
    "Personalized, root-cause analysis and interventions to optimize metabolic health, hormones, and cellular function — led by Dr. Lain Lye, ND.",
};

export default function FunctionalMedicineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
