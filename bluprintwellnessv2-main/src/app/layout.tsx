import type { Metadata } from "next";
import "./globals.css";
import CookieConsentInit from "@/components/CookieConsentInit";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bluprintwellness.com"),
  title: "Bluprint Wellness | Your Everyday Wellness Retreat",
  description: "An integrated wellness destination in Solana Beach where performance training, advanced recovery, functional medicine, and aesthetics converge.",
  openGraph: {
    title: "Bluprint Wellness | Your Everyday Wellness Retreat",
    description: "An integrated wellness destination in Solana Beach where performance training, advanced recovery, functional medicine, and aesthetics converge.",
    url: "https://www.bluprintwellness.com",
    siteName: "Bluprint Wellness",
    images: [{ url: "/images/share.jpg", width: 1280, height: 780, alt: "Bluprint Wellness" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bluprint Wellness | Your Everyday Wellness Retreat",
    description: "An integrated wellness destination in Solana Beach where performance training, advanced recovery, functional medicine, and aesthetics converge.",
    images: ["/images/share.jpg"],
  },
  icons: {
    apple: "/images/favicon/apple-touch-icon.png",
    icon: [
      { url: "/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  manifest: "/images/favicon/site.webmanifest",
  other: {
    "msapplication-TileColor": "#da532c",
    "theme-color": "#000000",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/SaansVF.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="home">
        {children}
        <CookieConsentInit />
      </body>
    </html>
  );
}
