"use client";

import SplineScene from "./components/SplineScene";
import WallNav from "./components/WallNav";
import Section1 from "./components/sections/Section1";
import Section2 from "./components/sections/Section2";
import Section3 from "./components/sections/Section3";
import Section4 from "./components/sections/Section4";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useActiveSection } from "./hooks/useActiveSection";

export default function Home() {
  const { cameraState, scrollToSection } = useSmoothScroll();
  const { activeIndex } = useActiveSection();

  return (
    <main className="relative">
      {/* Fixed 4-Wall Navigation */}
      <WallNav activeIndex={activeIndex} scrollToSection={scrollToSection} />
      
      {/* Fixed Spline canvas - full viewport */}
      <SplineScene cameraState={cameraState} />

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