"use client";

import { useEffect, useState } from "react";

export function useDeviceType() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      // Check both viewport width and touch capability
      const isMobileDevice = 
        window.innerWidth <= 768 || 
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0);
      
      setIsMobile(isMobileDevice);
      setIsLoading(false);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isLoading };
}

