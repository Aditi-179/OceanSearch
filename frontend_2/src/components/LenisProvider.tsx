"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Suppress 3rd-party @react-three/fiber internal THREE.Clock deprecation notice
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      if (typeof args[0] === "string" && args[0].includes("THREE.Clock: This module has been deprecated")) {
        return;
      }
      originalWarn(...args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}

