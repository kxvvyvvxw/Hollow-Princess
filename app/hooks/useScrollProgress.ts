"use client";

import { useEffect, useState } from "react";

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress from 0 to 1
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = scrollHeight > 0 ? currentScroll / scrollHeight : 0;
      
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    // Listen to Lenis scroll events if available
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("lenis:scrolltick", handleScroll);
    
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("lenis:scrolltick", handleScroll);
    };
  }, []);

  return scrollProgress;
}

