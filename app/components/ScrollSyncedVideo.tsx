"use client";

import { useEffect, useRef } from "react";

export default function ScrollSyncedVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      if (sections.length === 0) return;

      const viewportHeight = window.innerHeight;
      const viewportCenter = window.scrollY + (viewportHeight / 2);
      
      // Calculate which section the viewport center is in
      let targetTime = 0;
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const sectionBottom = sectionTop + rect.height;
        
        if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
          // Calculate progress within this section (0 to 1)
          const sectionProgress = (viewportCenter - sectionTop) / rect.height;
          
          // Each section is 3 seconds in the video
          const sectionStartTime = index * 3;
          
          // Interpolate within the 3-second window
          targetTime = sectionStartTime + (sectionProgress * 3);
        }
      });
      
      // Clamp to video duration
      targetTime = Math.max(0, Math.min(12, targetTime));
      video.currentTime = targetTime;
    };

    // Initial sync
    handleScroll();
    
    // Listen to scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      preload="auto"
      className="fixed inset-0 z-0 w-full h-full object-cover"
    >
      <source src="/videos/hollow-princess-vid.mp4" type="video/mp4" />
    </video>
  );
}

