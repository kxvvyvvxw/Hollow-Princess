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

    // Fallback for older browsers
    // @ts-expect-error addListener exists in some environments
    media.addListener?.(update);
    return () => {
      // @ts-expect-error removeListener exists in some environments
      media.removeListener?.(update);
    };
  }, [breakpointPx]);

  return isMobile;
}

export default function useIsMobile(breakpointPx?: number): boolean {
  return useDeviceType(breakpointPx);
}


