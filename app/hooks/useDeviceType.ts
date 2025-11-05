"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when viewport width is <= breakpoint (default 768px).
 * Uses matchMedia and listens for changes; safe for SSR (defaults to false).
 */
export function useDeviceType(breakpointPx: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const query = `(max-width: ${breakpointPx}px)`;
    const media = window.matchMedia(query);

    const update = () => setIsMobile(media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    // Fallback for older browsers (deprecated API)
    if (typeof (media as any).addListener === "function") {
      (media as any).addListener(update);
      return () => (media as any).removeListener?.(update);
    }
    return;
  }, [breakpointPx]);

  return isMobile;
}

export default function useIsMobile(breakpointPx?: number): boolean {
  return useDeviceType(breakpointPx);
}

/**
 * Returns true when viewport width is <= 1024px (mobile + tablet).
 * Useful for applying mobile/tablet-specific behavior.
 */
export function useIsMobileOrTablet(): boolean {
  return useDeviceType(1024);
}

