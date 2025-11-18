"use client";

import { useState, useEffect, useRef } from "react";

export function useActiveSection() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isAtTop = () => typeof window !== "undefined" && window.scrollY <= 10;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleTopReset = () => {
      if (isAtTop()) {
        setActiveIndex(-1);
      }
    };

    window.addEventListener("scroll", handleTopReset, { passive: true });
    handleTopReset();

    return () => {
      window.removeEventListener("scroll", handleTopReset);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Create IntersectionObserver to track which section is in view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isAtTop()) {
          return;
        }

        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const navGroupAttr = entry.target.getAttribute("data-nav-group");
          if (navGroupAttr) {
            const parsedNavIndex = parseInt(navGroupAttr, 10);
            if (!Number.isNaN(parsedNavIndex)) {
              setActiveIndex(parsedNavIndex);
              return;
            }
          }

          const sectionNumber = entry.target.getAttribute("data-section");
          if (!sectionNumber) {
            return;
          }

          const numericSection = parseInt(sectionNumber, 10);
          if (Number.isNaN(numericSection)) {
            return;
          }

          const navIndex = Math.max(
            0,
            Math.floor((numericSection - 1) / 2)
          );
          setActiveIndex(navIndex);
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of section is visible
        rootMargin: "-100px 0px -100px 0px" // Adjust trigger points
      }
    );

    // Get all sections with data-section attribute
    const sections = document.querySelectorAll('[data-section]');
    
    // Observe each section
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    // Cleanup
    return () => {
      if (observerRef.current) {
        sections.forEach((section) => {
          observerRef.current?.unobserve(section);
        });
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { activeIndex };
}
