import Link from "next/link";
import { Container, Row, Col } from "@/components/layout/Grid";
import { footerContent } from "@/data/content";

const footerRoutes = [
  { href: "/functional-medicine", label: "Functional Medicine" },
  { href: "/aesthetics", label: "Precision Aesthetics" },
  { href: "/founder", label: "The Founder" },
  { href: "/apply", label: "Apply for Membership" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col span={3} xs={8}>
            <a href="/" className="footer_logo">
              <img src="/images/logo-footer.svg" alt="Bluprint Wellness" loading="lazy" />
            </a>
          </Col>
          <Col span={1} offset={1} md={2} offsetMd={0} xs={8} offsetXs={0}>
            <div className="st5">{footerContent.reachOutTitle}</div>
            <p>{footerContent.reachOutBody}</p>
          </Col>
          <Col span={1} md={2} xs={4}>
            <div className="st5">Explore</div>
            <ul className="footer_routes">
              {footerRoutes.map((route) => (
                <li key={route.href}>
                  <Link href={route.href}>{route.label}</Link>
                </li>
              ))}
            </ul>
          </Col>
          <Col span={1} md={2} xs={4}>
            <div className="st5">{footerContent.contactTitle}</div>
            <p>
              {footerContent.phone && <>{footerContent.phone}<br /></>}
              <a href={`mailto:${footerContent.email}`}>{footerContent.email}</a>
            </p>
            <p>
              <a href={footerContent.addressUrl} target="_blank" rel="noopener">
                {footerContent.address}
              </a>
            </p>
            <p className="footer_legal">
              <Link href="/privacy-policy">Privacy Policy</Link>{" · "}<Link href="/legal-notice">Terms of Service</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
