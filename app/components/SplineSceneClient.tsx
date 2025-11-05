"use client";

import dynamic from "next/dynamic";
import { CameraState } from "../types/camera";

interface SplineSceneClientProps {
  cameraState: CameraState;
}

// Import SplineScene with client-side only rendering (no SSR)
// This wrapper forces the 3D Spline/WebGL scene to mount only in the browser.
// Prevents a server render + client hydration from initializing WebGL twice
// (which previously caused stacked contexts and crashes on mobile).
const SplineScene = dynamic(() => import("./SplineScene"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0 bg-white" />,
});

export default function SplineSceneClient({
  cameraState,
}: SplineSceneClientProps) {
  return <SplineScene cameraState={cameraState} />;
}
