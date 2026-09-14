"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { siteConfig } from "@/config/site";

export function AnalyticsScripts() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    // Check initial consent state
    const consent = localStorage.getItem("cet_cookie_consent");
    if (consent === "accepted") {
      setConsentGranted(true);
    }

    const handleConsentChange = (e: CustomEvent) => {
      if (e.detail === "accepted") {
        setConsentGranted(true);
      }
    };

    window.addEventListener("cet-consent-update" as any, handleConsentChange);
    return () => {
      window.removeEventListener("cet-consent-update" as any, handleConsentChange);
    };
  }, []);

  const gaId = siteConfig.analytics?.googleAnalyticsId;
  const pixelId = siteConfig.analytics?.metaPixelId;

  // If no IDs provided or consent not yet accepted, do not load trackers
  if (!consentGranted) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel */}
      {pixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}
