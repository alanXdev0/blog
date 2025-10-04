import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

const initializeGtag = (measurementId: string) => {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
  });

  if (document.querySelector(`script[data-gtag="${measurementId}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.gtag = measurementId;
  document.head.appendChild(script);
};

const trackPageView = (measurementId: string, path: string) => {
  window.gtag?.("event", "page_view", {
    send_to: measurementId,
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
};

export const GoogleAnalytics = () => {
  const location = useLocation();
  const measurementId = MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId) {
      return;
    }
    initializeGtag(measurementId);
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId) {
      return;
    }

    const pagePath = `${location.pathname}${location.search}`;
    trackPageView(measurementId, pagePath);
  }, [location, measurementId]);

  return null;
};

export default GoogleAnalytics;
