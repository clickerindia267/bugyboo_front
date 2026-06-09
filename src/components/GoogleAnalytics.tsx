import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // 100ms timeout ensures that components updating document.title (like SEO.tsx)
    // have executed their useEffect hooks before we send the GA4 page view config.
    const timer = setTimeout(() => {
      if (typeof window.gtag === "function") {
        window.gtag("config", "G-FY4S00T94P", {
          page_path: location.pathname + location.search,
          page_title: document.title,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
};

export default GoogleAnalytics;
