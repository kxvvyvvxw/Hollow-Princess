"use client";

import React, { useEffect, useRef, useState } from "react";

type MobileScrollVideoProps = {
	/**
	 * Optional override for the video source. Defaults to `/videos/hollow-princess-video.webm`.
	 */
	src?: string;
};

const DEFAULT_SRC = "/videos/hollow-princess-video.webm";

/**
 * Mobile-only, userAgent-gated, scroll-scrubbed video with eased rAF scrubbing.
 * - Does not run on desktop/tablets
 * - Video stays paused; time is controlled via scroll progress
 */
export default function MobileScrollVideo({ src = DEFAULT_SRC }: MobileScrollVideoProps) {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const durationRef = useRef<number>(0);
	const targetTimeRef = useRef<number>(0);
	const rafIdRef = useRef<number | null>(null);
	const preloadLinkRef = useRef<HTMLLinkElement | null>(null);
	const isAnimatingRef = useRef<boolean>(false);

	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	// UA detection on mount
	useEffect(() => {
		if (typeof navigator === "undefined") {
			setIsMobile(false);
			return;
		}

		const ua = navigator.userAgent || "";
		const isiPhone = /iPhone|iPod/i.test(ua);
		const isAndroidMobile = /Android.*Mobile/i.test(ua);
		const isIpad = /iPad/i.test(ua) || (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1);
		const isTablet = /iPad|Tablet/i.test(ua);
		const mobile = (isiPhone || isAndroidMobile) && !isTablet && !isIpad;

		setIsMobile(mobile);
	}, []);

	// Early return while unknown or not mobile to avoid SSR mismatches and non-mobile execution
	if (isMobile !== true) {
		return null;
	}

	// Linear interpolation helper for easing towards target time
	const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

	// Compute scroll progress 0..1 of the whole document
	const computeScrollProgress = () => {
		const docEl = document.documentElement;
		const maxScroll = Math.max(1, docEl.scrollHeight - window.innerHeight);
		const raw = window.scrollY / maxScroll;
		return Math.min(1, Math.max(0, raw));
	};

	// rAF loop: ease currentTime towards targetTime
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		let mounted = true;

		const tick = () => {
			if (!mounted) return;
			const v = videoRef.current;
			if (!v) {
				isAnimatingRef.current = false;
				return;
			}

			const duration = durationRef.current;
			if (duration <= 0) {
				rafIdRef.current = requestAnimationFrame(tick);
				return;
			}

			const current = v.currentTime;
			const target = Math.min(duration, Math.max(0, targetTimeRef.current));
			// Smooth towards target; higher t = snappier
			const next = lerp(current, target, 0.18);

			// If close to target, snap and stop continuous animating until next scroll change
			if (Math.abs(next - target) < 0.01) {
				if (Math.abs(current - target) >= 0.001) {
					v.currentTime = target;
				}
				isAnimatingRef.current = false;
				rafIdRef.current = requestAnimationFrame(tick);
				return;
			}

			v.currentTime = next;
			isAnimatingRef.current = true;
			rafIdRef.current = requestAnimationFrame(tick);
		};

		rafIdRef.current = requestAnimationFrame(tick);

		return () => {
			mounted = false;
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, []);

	// Setup: preload video, ensure paused, read duration, scroll handling
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		// Add preload link to avoid white flash / 1-frame glitch
		const link = document.createElement("link");
		link.rel = "preload";
		link.as = "video";
		link.href = src;
		document.head.appendChild(link);
		preloadLinkRef.current = link;

		// Ensure the video never plays; keep paused
		const handleLoadedMetadata = () => {
			durationRef.current = isFinite(video.duration) ? video.duration : 0;
			video.pause();
			video.currentTime = targetTimeRef.current || 0;
		};

		const handleCanPlay = () => {
			video.pause();
		};

		video.addEventListener("loadedmetadata", handleLoadedMetadata, { passive: true } as any);
		video.addEventListener("canplay", handleCanPlay, { passive: true } as any);

		// Initialize target based on current scroll
		const initProgress = computeScrollProgress();
		targetTimeRef.current = (durationRef.current || 0) * initProgress;

		// Passive scroll listener: update target time (work happens in rAF loop)
		const onScroll = () => {
			const progress = computeScrollProgress();
			const duration = durationRef.current;
			if (duration > 0) {
				targetTimeRef.current = duration * progress;
			}
		};

		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", onScroll);
			video.removeEventListener("loadedmetadata", handleLoadedMetadata as any);
			video.removeEventListener("canplay", handleCanPlay as any);
			if (preloadLinkRef.current) {
				try {
					document.head.removeChild(preloadLinkRef.current);
				} catch {}
				preloadLinkRef.current = null;
			}
		};
	}, [src]);

	return (
		<div className="relative h-screen w-full bg-neutral-100">
			<video
				ref={videoRef}
				src={src}
				preload="auto"
				muted
				playsInline
				controls={false}
				// Keep paused; do not autoplay
				className="h-full w-full object-cover pointer-events-none select-none"
			/>
		</div>
	);
}


