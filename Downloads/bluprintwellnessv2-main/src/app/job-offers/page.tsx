import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Apply for Membership | Bluprint Wellness",
  description: "Begin your journey at Bluprint Wellness. Apply for membership today.",
};

export default function JobOffersPage() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "120px" }}>
      <div className="container">
        <div style={{ maxWidth: "800px" }}>
          <h1 className="st1" style={{ marginBottom: "40px", fontSize: "clamp(40px, 4vw, 80px)" }}>
            Apply for Membership
          </h1>
          <div className="st3" style={{ marginBottom: "40px" }}>
            <p>
              Experience a new standard of personalized wellness with our premium membership offerings.
              Take the first step toward optimal health with our comprehensive integrated wellness approach.
            </p>
          </div>
          <div className="st3" style={{ marginBottom: "40px" }}>
            <p>
              To apply for membership, please reach out to us directly:
            </p>
            <p style={{ marginTop: "1rem" }}>
              Email: <a href="mailto:jonathan@bluprintwellness.com">jonathan@bluprintwellness.com</a>
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              Location: 137 Lomas Santa Fe Drive, Solana Beach, CA 92075
            </p>
          </div>
          <div style={{ marginTop: "60px" }}>
            <Link href="/" style={{ opacity: 0.7, textDecoration: "underline" }}>
              &larr; Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
