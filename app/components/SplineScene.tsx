"use client";

import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import { Application } from "@splinetool/runtime";
import { CameraState } from "../types/camera";

interface SplineSceneProps {
  cameraState: CameraState;
}

export default function SplineScene({ cameraState }: SplineSceneProps) {
  // Run mobile detection immediately, not in useEffect (synchronous)
  const isMobileDevice = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [isMobile] = useState(isMobileDevice);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const splineRef = useRef<Application | null>(null);
  const cameraRef = useRef<any>(null);
  const cameraStateRef = useRef<CameraState>(cameraState);
  const animationIdRef = useRef<number | null>(null);
  const isAnimatingRef = useRef<boolean>(false);

  // Error boundary handler
  const handleError = (event: React.SyntheticEvent<HTMLDivElement>) => {
    console.error("Spline error:", event);
    setHasError(true);
  };

  // Reset error state for retry
  const handleRetry = () => {
    setHasError(false);
    setLoadTimeout(false);
    setIsLoading(true);
    setRetryKey(prev => prev + 1); // Force re-render by changing key
  };

  // Update cameraState ref whenever it changes
  useEffect(() => {
    cameraStateRef.current = cameraState;
  }, [cameraState]);

  // Check WebGL capability
  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
        if (!gl) {
          console.error("WebGL not supported");
          return false;
        }
        
        // Check WebGL capabilities
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter((debugInfo as any).UNMASKED_RENDERER_WEBGL);
          console.log("WebGL Renderer:", renderer);
        }
        
        // Check max texture size (important for Spline scenes)
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        console.log("Max Texture Size:", maxTextureSize);
        
        if (maxTextureSize < 2048) {
          console.warn("Device may not support high-quality 3D scenes");
        }
        
        return true;
      } catch (error) {
        console.error("WebGL check failed:", error);
        return false;
      }
    };
    
    setWebglSupported(checkWebGL());
  }, []);

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

    // Performance optimization for mobile devices
    let lastTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    // Smooth interpolation function
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateCamera = (currentTime: number) => {
      if (!cameraRef.current || !splineRef.current) {
        isAnimatingRef.current = false;
        return;
      }

      // Throttle updates based on target FPS
      if (currentTime - lastTime < frameInterval) {
        animationIdRef.current = requestAnimationFrame(updateCamera);
        return;
      }
      lastTime = currentTime;

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
      // Reduced ease factor on mobile for smoother, less computationally intensive animations
      const easeFactor = isMobile ? 0.5 : 0.7;
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
    console.log(`Camera update loop started (${targetFPS}fps - ${isMobile ? 'mobile' : 'desktop'})`);
  };

  const onLoad = (spline: Application) => {
    try {
      console.log("Spline onLoad called");
      console.log("Device info:", {
        isMobile,
        userAgent: navigator.userAgent,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        memory: (performance as any).memory?.usedJSHeapSize || 'unavailable',
        devicePixelRatio: window.devicePixelRatio
      });
      
      splineRef.current = spline;
      setIsLoading(false); // Scene loaded successfully
      
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
              setHasError(true);
            }
          }
        }
      }
      
      // Try to start animation loop when camera becomes available
      if (splineRef.current && cameraRef.current && !isAnimatingRef.current) {
        console.log("Starting animation loop...");
        startAnimationLoop();
      }
    } catch (error) {
      console.error("Error in onLoad:", error);
      setHasError(true);
      setIsLoading(false);
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

  // Memory management: pause animations when page is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, pause animation to save resources
        if (animationIdRef.current !== null) {
          cancelAnimationFrame(animationIdRef.current);
          isAnimatingRef.current = false;
          console.log("Animation paused (page hidden)");
        }
      } else {
        // Page is visible again, resume animation
        if (splineRef.current && cameraRef.current && !isAnimatingRef.current) {
          startAnimationLoop();
          console.log("Animation resumed (page visible)");
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMobile]);

  // Loading timeout detection
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.error("Spline scene loading timeout (10 seconds)");
        setLoadTimeout(true);
        setHasError(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Global error handler to catch uncaught errors
  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      console.error("Window error caught:", {
        error: event.error,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
      if (event.message.includes('WebGL') || event.message.includes('Spline') || event.message.includes('three')) {
        setHasError(true);
      }
    };
    
    window.addEventListener('error', handleWindowError);
    return () => window.removeEventListener('error', handleWindowError);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {webglSupported === null ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <p className="text-gray-600">Checking device compatibility...</p>
        </div>
      ) : !webglSupported ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="text-gray-600 mb-4">3D not supported on this device</p>
            <p className="text-gray-500 text-sm">Your browser or device doesn't support WebGL</p>
          </div>
        </div>
      ) : hasError || loadTimeout ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {loadTimeout ? "3D scene loading timeout" : "3D scene failed to load"}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              {loadTimeout 
                ? "The scene took too long to load. This may be due to network or device limitations." 
                : "There was an error loading the 3D scene."}
            </p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <Spline
          key={retryKey}
          scene="https://prod.spline.design/0OcmU8W25rvMzPDk/scene.splinecode"
          onLoad={onLoad}
          onError={handleError}
          className="w-full h-full"
        />
      )}
    </div>
  );
}
