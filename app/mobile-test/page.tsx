"use client";

import { useState, useEffect } from "react";
import SplineScene from "../components/SplineScene";
import ScrollVideo from "../components/ScrollVideo";
import WallNav from "../components/WallNav";
import Section1 from "../components/sections/Section1";
import Section2 from "../components/sections/Section2";
import Section3 from "../components/sections/Section3";
import Section4 from "../components/sections/Section4";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useActiveSection } from "../hooks/useActiveSection";
import { useScrollProgress } from "../hooks/useScrollProgress";

export default function MobileTest() {
  const { cameraState, scrollToSection } = useSmoothScroll();
  const { activeIndex } = useActiveSection();
  const scrollProgress = useScrollProgress();
  
  // Test mode: force video mode or allow toggle
  const [useVideo, setUseVideo] = useState(true);
  const [showDebug, setShowDebug] = useState(true);
  const [fps, setFps] = useState(0);

  // FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        setFps(Math.round((frameCount * 1000) / delta));
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <main className="relative">
      {/* Test Controls - Fixed overlay */}
      {showDebug && (
        <div className="fixed top-4 left-4 z-50 backdrop-blur-md bg-white/90 p-4 rounded-lg shadow-lg max-w-xs">
          <h2 className="font-geist-mono text-sm tracking-widest text-neutral-800 mb-3">
            MOBILE TEST CONTROLS
          </h2>
          
          {/* Mode Toggle */}
          <div className="mb-3 pb-3 border-b border-neutral-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useVideo}
                onChange={(e) => setUseVideo(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-neutral-600">
                {useVideo ? "Video Mode" : "Spline Mode"}
              </span>
            </label>
          </div>

          {/* Metrics */}
          <div className="space-y-2 text-xs font-geist-mono">
            <div className="flex justify-between">
              <span className="text-neutral-500">FPS:</span>
              <span className="text-neutral-800 font-medium">{fps}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Scroll:</span>
              <span className="text-neutral-800 font-medium">
                {(scrollProgress * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Section:</span>
              <span className="text-neutral-800 font-medium">{activeIndex + 1}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-3 pt-3 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 leading-relaxed">
              Toggle to compare video vs Spline performance. Video should be smooth
              scrolling both up and down.
            </p>
          </div>

          {/* Hide Debug Button */}
          <button
            onClick={() => setShowDebug(false)}
            className="mt-3 w-full text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Hide Debug Panel
          </button>
        </div>
      )}

      {/* Show Debug Button (when hidden) */}
      {!showDebug && (
        <button
          onClick={() => setShowDebug(true)}
          className="fixed top-4 left-4 z-50 backdrop-blur-md bg-white/90 px-4 py-2 rounded-lg shadow-lg text-xs font-geist-mono text-neutral-600 hover:text-neutral-800 transition-colors"
        >
          Show Debug
        </button>
      )}

      {/* Fixed 4-Wall Navigation */}
      <WallNav activeIndex={activeIndex} scrollToSection={scrollToSection} />
      
      {/* Conditional rendering based on test mode */}
      {useVideo ? (
        <ScrollVideo 
          videoSrc="/videos/hollow-princess-scrub.mp4"
          scrollProgress={scrollProgress}
        />
      ) : (
        <SplineScene cameraState={cameraState} />
      )}

      {/* Scrollable sections container */}
      <div className="relative z-10">
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
      </div>
    </main>
  );
}

