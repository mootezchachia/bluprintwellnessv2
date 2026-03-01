import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";

export function initCookieConsent() {
  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: "box inline",
        position: "bottom left",
      },
      preferencesModal: {
        layout: "box",
      },
    },
    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {
        autoClear: {
          cookies: [
            { name: /^_ga/ },
            { name: "_gid" },
            { name: /^_fbp/ },
          ],
        },
      },
    },
    language: {
      default: "en",
      translations: {
        en: {
          consentModal: {
            title: "We use cookies",
            description:
              "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and serve personalized content. By clicking \"Accept All\", you consent to our use of cookies.",
            acceptAllBtn: "Accept All",
            acceptNecessaryBtn: "Reject All",
            showPreferencesBtn: "Manage Preferences",
          },
          preferencesModal: {
            title: "Cookie Preferences",
            acceptAllBtn: "Accept All",
            acceptNecessaryBtn: "Reject All",
            savePreferencesBtn: "Save Preferences",
            sections: [
              {
                title: "Necessary Cookies",
                description: "These cookies are essential for the website to function properly.",
                linkedCategory: "necessary",
              },
              {
                title: "Analytics Cookies",
                description:
                  "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This includes Google Analytics and Meta Pixel.",
                linkedCategory: "analytics",
              },
            ],
          },
        },
      },
    },
  });
}
