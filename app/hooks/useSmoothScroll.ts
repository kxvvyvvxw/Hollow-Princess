"use client";

import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { CameraState } from "../types/camera";

// Camera positions for each section
const CAMERA_STATES: CameraState[] = [
  {
    // Section 1 - Base State
    position: { x: 80.16, y: 597.14, z: 0.72 },
    rotation: { x: -21.75, y: 26.92, z: 13.89 },
  },
  {
    // Section 2 - State 2
    position: { x: -224.85, y: 488.24, z: -61.60 },
    rotation: { x: -36.43, y: -67.54, z: -34.3 },
  },
  {
    // Section 3 - State 3
    position: { x: 99.23, y: 15.67, z: 140.16 },
    rotation: { x: 22.58, y: 22.3, z: 21.74 },
  },
  {
    // Section 4 - State 4
    position: { x: -175.77, y: 171.81, z: 1039.52 },
    rotation: { x: 4.24, y: -8.76, z: 0.65 },
  },
];

export function useSmoothScroll() {
  const [cameraState, setCameraState] = useState<CameraState>(CAMERA_STATES[0]);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Animation loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis to window scroll
    lenis.on("scroll", () => {
      // This will be handled by the second useEffect
    });

    // Intersection Observer removed - scroll handler now controls all camera state updates
    // This prevents conflicting state updates that cause janky animation

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  // Listen to Lenis scroll for smooth interpolation between sections
  useEffect(() => {
    // Wait for Lenis to be initialized and sections to be available
    const timeoutId = setTimeout(() => {
      if (!lenisRef.current) {
        console.warn("Lenis not initialized yet");
        return;
      }

      const lenis = lenisRef.current;

      const handleScroll = ({ scroll }: { scroll: number }) => {
        const sections = document.querySelectorAll("[data-section]");
        if (sections.length === 0) {
          console.warn("No sections found");
          return;
        }

        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight * 0.5;

        // Get actual DOM positions for each section's center point
        const sectionCenters: number[] = [];
        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = scroll + rect.top;
          const sectionHeight = rect.height;
          const sectionCenter = sectionTop + (sectionHeight / 2);
          sectionCenters[index] = sectionCenter;
        });

        // Find which two section centers we're between based on viewport center
        const viewportCenterScroll = scroll + viewportCenter;
        
        let currentSectionIndex = 0;
        let nextSectionIndex = 0;
        let interpolationFactor = 0;

        // If viewport center is before first section center
        if (viewportCenterScroll < sectionCenters[0]) {
          currentSectionIndex = 0;
          nextSectionIndex = 0;
          interpolationFactor = 0;
        }
        // If viewport center is after last section center
        else if (viewportCenterScroll >= sectionCenters[sectionCenters.length - 1]) {
          currentSectionIndex = sectionCenters.length - 1;
          nextSectionIndex = sectionCenters.length - 1;
          interpolationFactor = 1;
        }
        // Find which section centers we're between
        else {
          for (let i = 0; i < sectionCenters.length - 1; i++) {
            if (viewportCenterScroll >= sectionCenters[i] && viewportCenterScroll < sectionCenters[i + 1]) {
              currentSectionIndex = i;
              nextSectionIndex = i + 1;
              // Calculate interpolation: 0 at current center, 1 at next center
              const distanceBetweenCenters = sectionCenters[i + 1] - sectionCenters[i];
              const distanceFromCurrent = viewportCenterScroll - sectionCenters[i];
              interpolationFactor = Math.max(0, Math.min(1, distanceFromCurrent / distanceBetweenCenters));
              break;
            }
          }
        }

        // Interpolate between the two camera states
        const current = CAMERA_STATES[currentSectionIndex];
        const next = CAMERA_STATES[nextSectionIndex];

        const interpolatedState: CameraState = {
          position: {
            x: current.position.x + (next.position.x - current.position.x) * interpolationFactor,
            y: current.position.y + (next.position.y - current.position.y) * interpolationFactor,
            z: current.position.z + (next.position.z - current.position.z) * interpolationFactor,
          },
          rotation: {
            x: current.rotation.x + (next.rotation.x - current.rotation.x) * interpolationFactor,
            y: current.rotation.y + (next.rotation.y - current.rotation.y) * interpolationFactor,
            z: current.rotation.z + (next.rotation.z - current.rotation.z) * interpolationFactor,
          },
        };

        setCameraState(interpolatedState);
      };

      lenis.on("scroll", handleScroll);

      // Initial call after a short delay to ensure limit is set
      setTimeout(() => {
        const initialScroll = lenis.scroll;
        handleScroll({ scroll: initialScroll });
      }, 100);

      // Store cleanup function
      (lenis as Lenis & { _cameraScrollCleanup?: () => void })._cameraScrollCleanup = () => {
        lenis.off("scroll", handleScroll);
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (lenisRef.current) {
        const lenisWithCleanup = lenisRef.current as Lenis & { _cameraScrollCleanup?: () => void };
        if (lenisWithCleanup._cameraScrollCleanup) {
          lenisWithCleanup._cameraScrollCleanup();
        }
      }
    };
  }, []);

  const scrollToSection = (sectionIndex: number) => {
    if (!lenisRef.current) return;
    
    // Get all sections with data-section attribute
    const sections = document.querySelectorAll('[data-section]');
    if (sections.length === 0 || sectionIndex < 0 || sectionIndex >= sections.length) return;
    
    // Get the target section
    const targetSection = sections[sectionIndex];
    const targetId = targetSection.getAttribute('id');
    
    if (targetId) {
      // Use Lenis's scrollTo method for smooth scrolling
      lenisRef.current.scrollTo(`#${targetId}`, {
        offset: 0, // No offset, scroll to exact position
        duration: 2.5, // Slower duration for more elegant transitions
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Same easing as Lenis
      });
    }
  };

  return { cameraState, scrollToSection };
}
