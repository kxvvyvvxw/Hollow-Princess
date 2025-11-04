"use client";

import { useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";
import { Application } from "@splinetool/runtime";
import { CameraState } from "../types/camera";

interface SplineSceneProps {
  cameraState: CameraState;
}

export default function SplineScene({ cameraState }: SplineSceneProps) {
  const splineRef = useRef<Application | null>(null);
  const cameraRef = useRef<any>(null);
  const cameraStateRef = useRef<CameraState>(cameraState);
  const animationIdRef = useRef<number | null>(null);
  const isAnimatingRef = useRef<boolean>(false);

  useEffect(() => {
    cameraStateRef.current = cameraState;
  }, [cameraState]);

  const startAnimationLoop = () => {
    if (isAnimatingRef.current || !splineRef.current || !cameraRef.current) {
      return;
    }

    isAnimatingRef.current = true;
    const camera = cameraRef.current;
    let currentPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    let currentRot = { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z };

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateCamera = () => {
      if (!cameraRef.current || !splineRef.current) {
        isAnimatingRef.current = false;
        return;
      }

      const targetState = cameraStateRef.current;
      const easeFactor = 0.7;

      currentPos.x = lerp(currentPos.x, targetState.position.x, easeFactor);
      currentPos.y = lerp(currentPos.y, targetState.position.y, easeFactor);
      currentPos.z = lerp(currentPos.z, targetState.position.z, easeFactor);

      const targetRotX = (targetState.rotation.x * Math.PI) / 180;
      const targetRotY = (targetState.rotation.y * Math.PI) / 180;
      const targetRotZ = (targetState.rotation.z * Math.PI) / 180;

      currentRot.x = lerp(currentRot.x, targetRotX, easeFactor);
      currentRot.y = lerp(currentRot.y, targetRotY, easeFactor);
      currentRot.z = lerp(currentRot.z, targetRotZ, easeFactor);

      cameraRef.current.position.x = currentPos.x;
      cameraRef.current.position.y = currentPos.y;
      cameraRef.current.position.z = currentPos.z;
      cameraRef.current.rotation.x = currentRot.x;
      cameraRef.current.rotation.y = currentRot.y;
      cameraRef.current.rotation.z = currentRot.z;

      animationIdRef.current = requestAnimationFrame(updateCamera);
    };

    animationIdRef.current = requestAnimationFrame(updateCamera);
  };

  const onLoad = (spline: Application) => {
    splineRef.current = spline;
    const camera = spline.findObjectByName("CameraX");
    if (camera) {
      cameraRef.current = camera;
      startAnimationLoop();
    }
  };

  useEffect(() => {
    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        isAnimatingRef.current = false;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Spline
        scene="https://prod.spline.design/0OcmU8W25rvMzPDk/scene.splinecode"
        onLoad={onLoad}
        className="w-full h-full"
      />
    </div>
  );
}
