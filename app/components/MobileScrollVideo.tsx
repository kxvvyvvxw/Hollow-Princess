"use client";

import { useEffect, useRef, useState } from "react";

export default function MobileScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  // Mobile detection
  useEffect(() => {
    if (typeof window === "undefined") return;

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );

    setIsMobile(isMobileDevice);
  }, []);

  // Lerp function for smooth interpolation
  const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  };

  // Scroll handler to calculate target time
  useEffect(() => {
    if (!isMobile || !videoRef.current) return;

    const video = videoRef.current;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? scrollTop / documentHeight : 0;

      // Clamp progress between 0 and 1
      const clampedProgress = Math.max(0, Math.min(1, progress));

      // Calculate target time based on video duration
      if (video.duration && !isNaN(video.duration)) {
        targetTimeRef.current = clampedProgress * video.duration;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  // Ensure video stays paused at all times
  useEffect(() => {
    if (!isMobile || !videoRef.current) return;

    const video = videoRef.current;

    const keepPaused = () => {
      if (!video.paused) {
        video.pause();
      }
    };

    // Prevent play events
    video.addEventListener("play", keepPaused);
    video.addEventListener("playing", keepPaused);

    // Ensure paused initially
    keepPaused();

    return () => {
      video.removeEventListener("play", keepPaused);
      video.removeEventListener("playing", keepPaused);
    };
  }, [isMobile]);

  // rAF loop to smoothly lerp video.currentTime
  useEffect(() => {
    if (!isMobile || !videoRef.current) return;

    const video = videoRef.current;
    const easingFactor = 0.12; // Smooth easing factor

    const updateVideoTime = () => {
      if (!video.duration || isNaN(video.duration)) {
        rafIdRef.current = requestAnimationFrame(updateVideoTime);
        return;
      }

      // Lerp current time toward target time
      currentTimeRef.current = lerp(
        currentTimeRef.current,
        targetTimeRef.current,
        easingFactor
      );

      // Update video currentTime
      video.currentTime = currentTimeRef.current;

      // Ensure video stays paused
      if (!video.paused) {
        video.pause();
      }

      // Continue animation loop
      rafIdRef.current = requestAnimationFrame(updateVideoTime);
    };

    // Wait for video to be ready
    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        currentTimeRef.current = video.currentTime;
        video.pause(); // Ensure paused
        rafIdRef.current = requestAnimationFrame(updateVideoTime);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Start loop if metadata already loaded
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [isMobile]);

  // Return null if not mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <video
        ref={videoRef}
        src="/videos/hollow-princess-scrub.mp4"
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
      {/* Visual overlay to confirm playback changes */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}

