"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollVideoProps {
  videoSrc: string;
  scrollProgress: number; // 0 to 1 based on page scroll
}

export default function ScrollVideo({ videoSrc, scrollProgress }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  // Load and prepare video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsReady(true);
      console.log("Video loaded, duration:", video.duration);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [videoSrc]);

  // Update target time from scroll progress (no lerp here)
  useEffect(() => {
    if (!isReady || !videoRef.current) return;
    targetTimeRef.current = scrollProgress * videoRef.current.duration;
  }, [scrollProgress, isReady]);

  // Continuous rAF loop with lerp easing (industry-standard approach)
  useEffect(() => {
    if (!isReady || !videoRef.current) return;

    const video = videoRef.current;
    let isAnimating = true;

    const animate = () => {
      if (!isAnimating || !video) return;

      const target = targetTimeRef.current;
      const current = currentTimeRef.current;
      
      // Lerp for smooth easing (0.1 = smooth + responsive balance)
      // This is the key to butter-smooth bidirectional scrolling
      const eased = current + (target - current) * 0.1;
      
      // Only update if changed (performance optimization)
      if (Math.abs(eased - video.currentTime) > 0.001) {
        video.currentTime = eased;
        currentTimeRef.current = eased;
      }
      
      rafIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isAnimating = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isReady]);

  return (
    <div className="fixed inset-0 z-0 bg-white">
      {/* Direct video element - industry-standard approach */}
      <video
        ref={videoRef}
        src={videoSrc}
        playsInline
        muted
        preload="auto"
        className="w-full h-full object-cover"
        style={{ 
          opacity: isReady ? 1 : 0, 
          transition: "opacity 0.5s",
          display: "block"
        }}
      />
      
      {/* Loading state */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-neutral-600 font-geist-mono tracking-widest">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}

