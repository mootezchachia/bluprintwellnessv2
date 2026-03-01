import { Container, Row, Col } from "@/components/layout/Grid";
import { footerContent } from "@/data/content";

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
          <Col span={1} offset={2} md={2} offsetMd={1} xs={8} offsetXs={0}>
            <div className="st5">{footerContent.reachOutTitle}</div>
            <p>{footerContent.reachOutBody}</p>
          </Col>
          <Col span={1} md={2} xs={8}>
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
            <p>
              <a href="/privacy-policy">Privacy Policy</a>{" · "}<a href="/terms-of-service">Terms of Service</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
