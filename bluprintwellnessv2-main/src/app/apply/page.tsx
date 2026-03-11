import type { Metadata } from "next";
import ApplyWizard from "@/components/apply/ApplyWizard";

export const metadata: Metadata = {
  title: "Apply for Membership | Bluprint Wellness",
  description:
    "Apply for private membership at Bluprint Wellness — an integrated wellness destination in Solana Beach.",
};

export default function ApplyPage() {
  return (
    <main className="applyPage">
      <ApplyWizard />
    </main>
  );
}
