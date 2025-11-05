"use client";

import dynamic from "next/dynamic";
import { CameraState } from "../types/camera";

interface SplineSceneClientProps {
  cameraState: CameraState;
}

// Import SplineScene with client-side only rendering (no SSR)
const SplineScene = dynamic(() => import("./SplineScene"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0 bg-white" />,
});

export default function SplineSceneClient({ cameraState }: SplineSceneClientProps) {
  return <SplineScene cameraState={cameraState} />;
}

