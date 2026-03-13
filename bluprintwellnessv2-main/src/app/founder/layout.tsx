import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jonathan Uphoff | Bluprint Wellness",
  description:
    "Meet Jonathan Uphoff — award-winning fitness entrepreneur, CSCS-certified strength coach, and visionary founder of Bluprint Wellness in Solana Beach.",
};

export default function JonathanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
