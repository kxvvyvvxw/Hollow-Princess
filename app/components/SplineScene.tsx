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

  // Update cameraState ref whenever it changes
  useEffect(() => {
    cameraStateRef.current = cameraState;
  }, [cameraState]);

  // Function to start the animation loop
  const startAnimationLoop = () => {
    if (isAnimatingRef.current || !splineRef.current || !cameraRef.current) {
      return;
    }

    isAnimatingRef.current = true;
    const camera = cameraRef.current;
    let currentPos = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    let currentRot = {
      x: camera.rotation.x,
      y: camera.rotation.y,
      z: camera.rotation.z,
    };

    // Smooth interpolation function
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateCamera = () => {
      if (!cameraRef.current || !splineRef.current) {
        isAnimatingRef.current = false;
        return;
      }

      const currentCamera = cameraRef.current;
      
      // Get latest camera state from ref
      const targetState = cameraStateRef.current;

      // Convert target rotation to radians
      const targetRotX = (targetState.rotation.x * Math.PI) / 180;
      const targetRotY = (targetState.rotation.y * Math.PI) / 180;
      const targetRotZ = (targetState.rotation.z * Math.PI) / 180;

      // Smoothly interpolate position (using ease factor for responsive movement)
      // Higher value = more responsive, lower value = smoother but laggier
      // Since scroll handler already interpolates, use higher ease for immediate response
      const easeFactor = 0.7;
      currentPos.x = lerp(currentPos.x, targetState.position.x, easeFactor);
      currentPos.y = lerp(currentPos.y, targetState.position.y, easeFactor);
      currentPos.z = lerp(currentPos.z, targetState.position.z, easeFactor);

      // Smoothly interpolate rotation
      currentRot.x = lerp(currentRot.x, targetRotX, easeFactor);
      currentRot.y = lerp(currentRot.y, targetRotY, easeFactor);
      currentRot.z = lerp(currentRot.z, targetRotZ, easeFactor);

      // Update camera position and rotation
      // Coordinate system: X=X (left-right), Y=Y (up-down), Z=Z (depth) - consistent across all systems
      currentCamera.position.x = currentPos.x;
      currentCamera.position.y = currentPos.y;
      currentCamera.position.z = currentPos.z;

      currentCamera.rotation.x = currentRot.x;
      currentCamera.rotation.y = currentRot.y;
      currentCamera.rotation.z = currentRot.z;

      animationIdRef.current = requestAnimationFrame(updateCamera);
    };

    // Start the animation loop
    animationIdRef.current = requestAnimationFrame(updateCamera);
    console.log("Camera update loop started");
  };

  const onLoad = (spline: Application) => {
    splineRef.current = spline;
    // Find the camera in the scene - camera is named "CameraX"
    const camera = spline.findObjectByName("CameraX");
    if (camera) {
      cameraRef.current = camera;
      console.log("CameraX found successfully");
    } else {
      // Fallback: try alternative names
      const fallbackCamera =
        spline.findObjectByName("Camera") ||
        spline.findObjectByName("camera") ||
        spline.findObjectByName("Main Camera");
      if (fallbackCamera) {
        cameraRef.current = fallbackCamera;
        console.log("Camera found with fallback name");
      } else {
        console.warn("CameraX not found, attempting to access scene camera");
        // Access camera through scene if available
        const scene = (spline as any).scene;
        if (scene && scene.children) {
          const foundCamera = scene.children.find(
            (obj: any) => obj.type === "PerspectiveCamera" || obj.type === "OrthographicCamera"
          );
          if (foundCamera) {
            cameraRef.current = foundCamera;
            console.log("Camera found via scene children");
          } else {
            console.error("Camera not found by any method");
          }
        }
      }
    }
    
    // Try to start animation loop when camera becomes available
    if (splineRef.current && cameraRef.current && !isAnimatingRef.current) {
      startAnimationLoop();
    }
  };

  // Watch for camera availability and start loop when ready
  useEffect(() => {
    // Check periodically if camera is ready
    const checkInterval = setInterval(() => {
      if (splineRef.current && cameraRef.current && !isAnimatingRef.current) {
        console.log("Camera now ready, starting animation loop");
        startAnimationLoop();
        clearInterval(checkInterval);
      }
    }, 100);

    // Also try immediately
    if (splineRef.current && cameraRef.current && !isAnimatingRef.current) {
      startAnimationLoop();
      clearInterval(checkInterval);
    }

    return () => {
      clearInterval(checkInterval);
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
