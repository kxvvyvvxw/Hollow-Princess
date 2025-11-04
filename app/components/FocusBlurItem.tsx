"use client";

import * as React from "react";
import { motion } from "framer-motion";

type FocusBlurItemProps = {
  children: React.ReactNode;
  className?: string;
  maxBlur?: number; // in px
  focusRadius?: number; // in px around viewport center with zero blur
  falloff?: number; // in px distance over which blur reaches max
  smoothing?: number; // 0..1 exponential smoothing factor
  outsideViewportBlur?: number; // px blur to apply when fully off-screen
  useLenisTicks?: boolean; // listen to lenis:scrolltick instead of continuous rAF
  frameSkip?: number; // update every Nth lenis tick (1 = no skip)
};

export default function FocusBlurItem({
  children,
  className,
  maxBlur = 14,
  focusRadius = 64,
  falloff,
  smoothing = 0.18,
  outsideViewportBlur,
  useLenisTicks = true,
  frameSkip = 1,
}: FocusBlurItemProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const blurRef = React.useRef(0);
  const opacityRef = React.useRef(1);
  const didSetOffscreen = React.useRef(false);

  const resolvedFalloff = React.useMemo(() => {
    if (typeof window === "undefined") return 400;
    if (typeof falloff === "number") return falloff;
    return Math.max(300, Math.floor(window.innerHeight * 0.45));
  }, [falloff]);

  // Initialize CSS vars on mount
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--blur", `0px`);
    el.style.opacity = `1`;
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respect reduced motion preference
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.setProperty("--blur", `0px`);
      el.style.opacity = `1`;
      return;
    }

    let rafId = 0;
    let tailFrames = 0;
    let skipCounter = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vpH = window.innerHeight;

      // Skip work if completely off-screen; set once
      if (rect.bottom < 0 || rect.top > vpH) {
        if (!didSetOffscreen.current) {
          const off = outsideViewportBlur ?? maxBlur;
          el.style.setProperty("--blur", `${off}px`);
          el.style.opacity = `${1 - 0.35}`;
          blurRef.current = off;
          opacityRef.current = 1 - 0.35;
          didSetOffscreen.current = true;
        }
        return;
      }
      didSetOffscreen.current = false;

      const rowCenterY = rect.top + rect.height / 2;
      const viewportCenterY = vpH / 2;
      const distanceFromCenter = Math.abs(rowCenterY - viewportCenterY);

      const tRaw = (distanceFromCenter - focusRadius) / resolvedFalloff;
      const tClamped = Math.min(1, Math.max(0, tRaw));
      // smoothstep easing
      const eased = tClamped * tClamped * (3 - 2 * tClamped);

      const targetBlur = Math.min(maxBlur, Math.max(0, eased * maxBlur));
      const targetOpacity = 1 - eased * 0.35; // subtle dim as it moves away

      // Exponential smoothing to reduce jitter
      blurRef.current += (targetBlur - blurRef.current) * smoothing;
      opacityRef.current += (targetOpacity - opacityRef.current) * smoothing;

      el.style.setProperty("--blur", `${blurRef.current.toFixed(2)}px`);
      el.style.opacity = `${opacityRef.current.toFixed(3)}`;
    };

    const runTail = () => {
      tailFrames = 0;
      const step = () => {
        update();
        if (++tailFrames < 6) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    };

    if (useLenisTicks) {
      const onTick = () => {
        if (frameSkip > 1 && skipCounter++ % frameSkip !== 0) return;
        update();
        runTail();
      };
      window.addEventListener("lenis:scrolltick", onTick);
      return () => {
        window.removeEventListener("lenis:scrolltick", onTick);
        cancelAnimationFrame(rafId);
      };
    }

    // Fallback: continuous rAF (only used when explicitly disabled)
    const loop = () => {
      update();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [
    resolvedFalloff,
    focusRadius,
    maxBlur,
    smoothing,
    outsideViewportBlur,
    useLenisTicks,
    frameSkip,
  ]);

  return (
    <motion.div
      ref={containerRef}
      className={className}
      // CSS vars and opacity are updated imperatively for stability
    >
      {children}
    </motion.div>
  );
}
