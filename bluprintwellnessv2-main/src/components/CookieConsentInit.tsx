"use client";

import { useEffect } from "react";
import { initCookieConsent } from "@/lib/cookie-consent";

export default function CookieConsentInit() {
  useEffect(() => {
    initCookieConsent();
  }, []);
  return null;
}
