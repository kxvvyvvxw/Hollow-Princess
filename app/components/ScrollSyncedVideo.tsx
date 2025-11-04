"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollSyncedVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded, duration:", video.duration);
      setIsReady(true);
      setIsLoading(false);
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    let rafId: number | null = null;
    let targetTime = 0;

    const updateVideoTime = () => {
      // Only update if difference is significant (reduces seeking)
      if (video.readyState >= 2 && Math.abs(video.currentTime - targetTime) > 0.03) {
        video.currentTime = targetTime;
      }
      rafId = null;
    };

    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) based on entire document
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(1, Math.max(0, scrollTop / documentHeight));
      
      // Map scroll progress to video time (0 to 12 seconds)
      targetTime = scrollProgress * 12;
      
      // Use RAF to throttle video.currentTime updates (smoother playback)
      if (rafId === null) {
        rafId = requestAnimationFrame(updateVideoTime);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isReady]);

  return (
    <div className="fixed inset-0 z-0">
      {isLoading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
          <div className="text-neutral-400 font-geist-sans text-sm tracking-widest">
            Loading...
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        style={{ backgroundColor: '#ffffff' }}
      >
        <source src="/videos/hollow-princess-video.webm" type="video/webm" />
        <source src="/videos/hollow-princess-vid.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
