import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Bluprint Wellness",
  description: "Privacy policy for Bluprint Wellness.",
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "120px" }}>
      <div className="container">
        <div style={{ maxWidth: "800px" }}>
          <h1 className="st1" style={{ marginBottom: "60px", fontSize: "clamp(40px, 4vw, 80px)" }}>
            Privacy Policy
          </h1>

          <div className="st3" style={{ marginBottom: "40px" }}>
            <h2 className="st5">Company Information</h2>
            <p>Bluprint Wellness</p>
            <p>137 Lomas Santa Fe Drive</p>
            <p>Solana Beach, CA 92075</p>
            <p style={{ marginTop: "1rem" }}>
              Email: <a href="mailto:jonathan@bluprintwellness.com">jonathan@bluprintwellness.com</a>
            </p>
          </div>

          <div className="st3" style={{ marginBottom: "40px" }}>
            <h2 className="st5">Privacy Policy</h2>
            <p>
              We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data
              when you visit our website and tell you about your privacy rights.
            </p>
            <p>
              We use cookies and similar tracking technologies to track activity on our website
              and hold certain information. You can instruct your browser to refuse all cookies
              or to indicate when a cookie is being sent. However, if you do not accept cookies,
              you may not be able to use some portions of our website.
            </p>
          </div>

          <div className="st3" style={{ marginBottom: "40px" }}>
            <h2 className="st5">Analytics</h2>
            <p>
              We use Google Analytics (GA4) and Meta Pixel for website analytics purposes.
              These services collect anonymous usage data to help us understand how visitors
              interact with our website. This data collection is subject to your cookie consent preferences.
            </p>
          </div>

          <div className="st3">
            <h2 className="st5">Contact</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at{" "}
              <a href="mailto:jonathan@bluprintwellness.com">jonathan@bluprintwellness.com</a>.
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
