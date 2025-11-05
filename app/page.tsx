"use client";

import SplineScene from "./components/SplineScene";
import ScrollVideo from "./components/ScrollVideo";
import WallNav from "./components/WallNav";
import Section1 from "./components/sections/Section1";
import Section2 from "./components/sections/Section2";
import Section3 from "./components/sections/Section3";
import Section4 from "./components/sections/Section4";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useActiveSection } from "./hooks/useActiveSection";
import { useDeviceType } from "./hooks/useDeviceType";
import { useScrollProgress } from "./hooks/useScrollProgress";

export default function Home() {
  const { cameraState, scrollToSection } = useSmoothScroll();
  const { activeIndex } = useActiveSection();
  const { isMobile, isLoading } = useDeviceType();
  const scrollProgress = useScrollProgress();

  return (
    <main className="relative">
      {/* Fixed 4-Wall Navigation */}
      <WallNav activeIndex={activeIndex} scrollToSection={scrollToSection} />

      {/* Conditional rendering: Spline for desktop, Video for mobile */}
      {!isLoading && (
        <>
          {!isMobile ? (
            <SplineScene cameraState={cameraState} />
          ) : (
            <ScrollVideo
              videoSrc="/videos/hollow-princess-scrub.mp4"
              scrollProgress={scrollProgress}
            />
          )}
        </>
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
